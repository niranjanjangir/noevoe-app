import { ClientReport, Curriculum, CurriculumGenerateResponseSchema, Lesson, LESSON_SCHEMA_VERSION, LessonGenerateResponseSchema, LessonSchema } from "../types";
import { apiBaseUrl, ApiClientError, CurriculumRequest, LessonRequest, postJson } from "./client";

export async function generateCurriculum(request: CurriculumRequest): Promise<Curriculum> {
  const json = await postJson("/v1/curriculum/generate", request);
  const parsed = CurriculumGenerateResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new ApiClientError("bad_response", "The server reply did not match what the app expects.");
  }
  if (parsed.data.status === "rejected") {
    throw new ApiClientError("rejected", parsed.data.reason);
  }
  return parsed.data.curriculum;
}

export async function generateLesson(request: LessonRequest): Promise<Lesson> {
  const json = await postJson("/v1/lessons/generate", request);
  const parsed = LessonGenerateResponseSchema.safeParse(json);
  const parsedLesson = parsed.success ? LessonSchema.safeParse(parsed.data.lesson) : null;
  const lesson = parsedLesson?.success ? parsedLesson.data : null;
  if (!lesson) {
    sendReport({
      kind: "schema_mismatch",
      lessonId: request.lessonId,
      schemaVersion: LESSON_SCHEMA_VERSION,
      message: "Lesson reply did not match the app's lesson schema.",
      at: new Date().toISOString(),
    });
    throw new ApiClientError("bad_response", "The lesson from the server did not match what the app expects.");
  }
  return lesson;
}

export function sendReport(report: ClientReport): void {
  try {
    fetch(apiBaseUrl() + "/v1/reports/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    }).catch(() => undefined);
  } catch { }
}
