import Constants from "expo-constants";
import type { z } from "zod";
import {
  ApiErrorSchema,
  CurriculumGenerateRequestSchema,
  CurriculumGenerateResponseSchema,
  LessonGenerateRequestSchema,
} from "../types";
import { noteNetworkFailure } from "./offline";

export type CurriculumRequest = z.input<typeof CurriculumGenerateRequestSchema>;
export type LessonRequest = z.input<typeof LessonGenerateRequestSchema>;

const REJECTED_INPUT_MESSAGE = "Previous instruction seemed incomplete, inappropriate or unrelated.";

export type ApiClientErrorCode =
  | "bad_request"
  | "hobby_rejected"
  | "generation_failed"
  | "upstream_unavailable"
  | "not_found"
  | "internal"
  | "rejected"
  | "network"
  | "timeout"
  | "bad_response";

export class ApiClientError extends Error {
  code: ApiClientErrorCode;

  constructor(code: ApiClientErrorCode, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
  }
}

export function isConnectionError(err: unknown): boolean {
  return err instanceof ApiClientError && (err.code === "network" || err.code === "timeout");
}

export function errorMessage(err: unknown): string {
  if (!(err instanceof ApiClientError)) return "Something unexpected happened. Please try again.";
  switch (err.code) {
    case "network":
      return "You seem to be offline. Lessons already prepared still work; try again when you are connected.";
    case "timeout":
      return "The server took too long to answer. Please try again.";
    case "upstream_unavailable":
      return "Something went wrong. Please try again in a minute.";
    case "generation_failed":
      return "We could not build the content this time. Please try again.";
    case "rejected":
      return err.message;
    default:
      return "Something went wrong on the server. Please try again.";
  }
}

const REQUEST_TIMEOUT_MS = 150_000;

const DEFAULT_BASE_URL = "http://localhost:8787";

export function apiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  const configured = extra?.apiBaseUrl ?? DEFAULT_BASE_URL;
  return withDevServerHost(configured, Constants.expoConfig?.hostUri);
}

// TODO: remove it later
export function withDevServerHost(configured: string, hostUri: string | undefined): string {
  const isLocalhost = configured.includes("://localhost") || configured.includes("://127.0.0.1");
  if (!isLocalhost || !hostUri) return configured;
  const devHost = hostUri.split(":")[0];
  if (!devHost || devHost === "localhost" || devHost === "127.0.0.1") return configured;
  return configured.replace("localhost", devHost).replace("127.0.0.1", devHost);
}

export async function postJson(path: string, body: unknown): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(apiBaseUrl() + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiClientError("timeout", "The server took too long to answer.");
    }
    noteNetworkFailure();
    throw new ApiClientError("network", "Could not reach the server. Check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }

  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (response.ok) return json;

  // 422 is the one non-OK reply that is not an error envelope: the hobby was rejected.
  if (response.status === 422) {
    const rejected = CurriculumGenerateResponseSchema.safeParse(json);
    if (rejected.success && rejected.data.status === "rejected") {
      throw new ApiClientError("rejected", REJECTED_INPUT_MESSAGE);
    }

    const rejectedError = ApiErrorSchema.safeParse(json);
    if (rejectedError.success && rejectedError.data.error.code === "hobby_rejected") {
      throw new ApiClientError("rejected", REJECTED_INPUT_MESSAGE);
    }
  }

  const apiError = ApiErrorSchema.safeParse(json);
  if (apiError.success) {
    throw new ApiClientError(apiError.data.error.code, apiError.data.error.message);
  }
  throw new ApiClientError("internal", "The server returned an unexpected error.");
}
