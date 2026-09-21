import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "../theme";

export function ComfortableHobbyistIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Path d="M15 4a11 11 0 1 0 10.2 6.8" fill="none" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" />
      <Path d="M15 4v6h6" fill="none" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="15" cy="19" r="3" fill={colors.primary} stroke={colors.accent} strokeWidth={1.5} />
      <Path d="M15 16v-4M12 19H8" fill="none" stroke={colors.accent} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
