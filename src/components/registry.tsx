import type { BlockResult, LessonBlock } from "../types";
import { IllustrationBlock } from "./IllustrationBlock";
import { MultipleChoiceBlock } from "./MultipleChoiceBlock";
import { PracticeBlock } from "./PracticeBlock";
import { SelfCheckBlock } from "./SelfCheckBlock";
import { TextBlock } from "./TextBlock";
import { TrueFalseBlock } from "./TrueFalseBlock";
import { UnsupportedBlock } from "./UnsupportedBlock";
import { VideoBlock } from "./VideoBlock";

type Props = {
  block: LessonBlock;
  result?: BlockResult;
  onResult: (result: BlockResult) => void;
  lessonId?: string;
};

export function BlockView({ block, result, onResult, lessonId }: Props) {
  switch (block.type) {
    case "text":
      return <TextBlock payload={block.payload} />;
    case "illustration":
      return <IllustrationBlock payload={block.payload} />;
    case "video":
      return <VideoBlock payload={block.payload} />;
    case "multiple_choice":
      return <MultipleChoiceBlock blockId={block.id} payload={block.payload} result={result} onResult={onResult} />;
    case "true_false":
      return <TrueFalseBlock blockId={block.id} payload={block.payload} result={result} onResult={onResult} />;
    case "practice":
      return <PracticeBlock blockId={block.id} payload={block.payload} result={result} onResult={onResult} />;
    case "self_check":
      return <SelfCheckBlock blockId={block.id} payload={block.payload} result={result} onResult={onResult} />;
    default:
      return <UnsupportedBlock type={String((block as { type: unknown }).type)} reportUnknown lessonId={lessonId} />;
  }
}
