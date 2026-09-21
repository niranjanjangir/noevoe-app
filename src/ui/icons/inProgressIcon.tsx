import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function InProgressIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" accessibilityLabel="In progress">
      <Path d="M3 6h6M6.5 3.5 9 6l-2.5 2.5" fill="none" stroke={colors.accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
