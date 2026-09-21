import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "../theme";

export function ComfortableHobbyistIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30" accessibilityLabel="Smiling face">
      <Circle cx="15" cy="15" r="12" fill={colors.primary} stroke={colors.accent} strokeWidth={1.5} />
      <Circle cx="11" cy="12" r="1.4" fill={colors.accent} />
      <Circle cx="19" cy="12" r="1.4" fill={colors.accent} />
      <Path d="M9 17c1.5 4 10.5 4 12 0" fill="none" stroke={colors.accent} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
