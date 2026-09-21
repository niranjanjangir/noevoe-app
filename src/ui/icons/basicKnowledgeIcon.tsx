import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function BasicKnowledgeIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Path d="M15 4a7 7 0 0 0-4 12.8c1 .7 1.5 1.5 1.5 2.7h5c0-1.2.5-2 1.5-2.7A7 7 0 0 0 15 4Z" fill={colors.primary} stroke={colors.accent} strokeWidth={1.5} />
      <Path d="M12.5 23h5M13 26h4M15 1v1M5 5l1.5 1.5M25 5l-1.5 1.5" fill="none" stroke={colors.accent} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}
