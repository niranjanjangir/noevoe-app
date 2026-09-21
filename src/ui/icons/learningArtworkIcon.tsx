import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import { colors } from "../theme";

export function LearningArtworkIcon() {

  return (
    <Svg
      width="120%"
      height={300}
      viewBox="0 0 360 180"
      accessibilityLabel="Illustration of learning a hobby"
      style={{
        width: "120%",
        maxWidth: 520,
        height: 300,
      }}
    >
      <Ellipse cx="180" cy="180" rx="126" ry="10" fill={colors.text} opacity={0.14} />
      <Circle cx="285" cy="52" r="28" fill={colors.primary} opacity={0.7} />
      <Path d="M50 130c22-28 45-36 74-26 23 8 37 25 53 28" fill="none" stroke={colors.accent} strokeWidth="5" strokeLinecap="round" />
      <Path d="M102 104c-5-20 3-36 23-46 4 20-3 36-23 46Z" fill={colors.success} opacity={0.8} />
      <Path d="M105 104c14-8 30-6 41 6-16 11-32 10-41-6Z" fill={colors.primary} />
      <Path d="M125 132V75" fill="none" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />

      <Rect x="165" y="71" width="98" height="62" rx="8" fill={colors.surface} stroke={colors.border} strokeWidth="4" />
      <Path d="M212 71v62M177 91h24M177 108h24M225 91h24M225 108h17" fill="none" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />

      <G transform="translate(134 32) scale(1.25)">
        <Rect x="0" y="0" width="20" height="18" rx="3" fill={colors.primary} opacity={0.18} stroke={colors.primary} strokeWidth="2" />
        <Path d="M4 13l5-6 4 4 7-9" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>

      <G transform="translate(176 25) scale(1.15)">
        <Rect x="0" y="0" width="26" height="18" rx="4" fill={colors.surface} stroke={colors.accent} strokeWidth="2" />
        <Circle cx="13" cy="9" r="5" fill={colors.accent} opacity={0.9} />
        <Circle cx="13" cy="9" r="2" fill={colors.surface} />
      </G>

      <G transform="translate(88 28) scale(1.2)">
        <Rect x="0" y="0" width="18" height="18" rx="2" fill={colors.surface} stroke={colors.success} strokeWidth="2" />
        <Path d="M3 3h12v12H3zM3 9h12M9 3v12" fill="none" stroke={colors.success} strokeWidth="1.8" strokeLinecap="round" />
      </G>

      <G transform="translate(74 112) scale(1.15)">
        <Path d="M0 12c2-9 7-13 14-13 6 0 11 4 14 13-3 2-5 3-7 3H7c-2 0-4-1-7-3Z" fill={colors.success} opacity={0.8} />
        <Path d="M6 8c0-5 4-8 10-8s10 3 10 8" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
        <Path d="M9 12v9M15 12v9M21 12v9" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      </G>

      <G transform="translate(126 138) scale(1.1)">
        <Path d="M0 10c0-6 4-10 10-10h17c6 0 10 4 10 10v5H0v-5Z" fill={colors.primary} opacity={0.16} stroke={colors.primary} strokeWidth="2" />
        <Path d="M8 5c-2-5 0-8 5-9M17 5c-1-5 2-8 7-9M26 5c0-5 3-8 8-9" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
      </G>

      <G transform="translate(306 52) scale(1.1)">
        <Path d="M8 12c-4 0-8 3-8 8v8h7c4 0 7-3 7-7V12H8Z" fill={colors.success} opacity={0.8} />
        <Path d="M8 12c6-4 13-4 20 0v9c0 4-3 7-7 7H8V12Z" fill={colors.surface} stroke={colors.accent} strokeWidth="2" />
        <Path d="M10 12v16M17 10v18M24 12v16" fill="none" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />
      </G>

      <Path d="m285 105 8 8 15-18" fill="none" stroke={colors.success} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="296" y1="34" x2="296" y2="15" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />
      <Line x1="279" y1="40" x2="268" y2="29" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />
      <Line x1="313" y1="40" x2="324" y2="29" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}
