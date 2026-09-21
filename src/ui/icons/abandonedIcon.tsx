import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function AbandonedIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" accessibilityLabel="Abandoned">
      <Path d="M9 4.5A3.5 3.5 0 1 0 9.5 8M9 2.5v2H7" fill="none" stroke={colors.warning} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
