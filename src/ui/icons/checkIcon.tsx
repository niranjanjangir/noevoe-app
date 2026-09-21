import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

type Props = {
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function CheckIcon({ size = 12, color = colors.surface, accessibilityLabel = "Completed" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" accessibilityLabel={accessibilityLabel}>
      <Path d="m2 6 2.5 2.5L10 3" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
