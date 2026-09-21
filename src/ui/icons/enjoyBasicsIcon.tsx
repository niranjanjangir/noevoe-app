import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function EnjoyBasicsIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Path d="m15 3 2.2 7.1L24 12l-6.8 2.1L15 21l-2.2-6.9L6 12l6.8-1.9L15 3Z" fill={colors.primary} stroke={colors.accent} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="m24 20 .9 2.8L28 24l-3.1 1.2L24 28l-.9-2.8L20 24l3.1-1.2L24 20Z" fill={colors.surface} stroke={colors.accent} strokeWidth={1.2} strokeLinejoin="round" />
    </Svg>
  );
}
