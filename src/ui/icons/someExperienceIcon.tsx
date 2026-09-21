import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function SomeExperienceIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Path d="M4 25 12 14l5 5 4-6 5 12H4Z" fill={colors.primaryTint} stroke={colors.accent} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="m8 10 4-4 3 3 5-5" fill="none" stroke={colors.success} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 4h4v4" fill="none" stroke={colors.success} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
