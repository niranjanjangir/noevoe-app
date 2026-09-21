import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function RetiredIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" accessibilityLabel="Retired">
      <Path d="M2.5 6h7" fill="none" stroke={colors.retired} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
