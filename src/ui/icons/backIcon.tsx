import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" accessibilityLabel="Back">
      <Path d="M14 4.5 6.5 11l7.5 6.5" fill="none" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
