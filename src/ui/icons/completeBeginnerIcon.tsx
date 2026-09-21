import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "../theme";

export function CompleteBeginnerIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Circle cx="15" cy="8" r="4" fill={colors.primary} stroke={colors.accent} strokeWidth={1.5} />
      <Path d="M9 25c.5-6 2.5-9 6-9s5.5 3 6 9M9 19l-4 3M21 19l4 3" fill="none" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" />
      <Path d="M11 13c1 2 7 2 8 0" fill="none" stroke={colors.accent} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
