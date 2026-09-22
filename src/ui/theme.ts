export const colors = {
  background: "#FFFDF7",
  faintBackground: "#1E1B1273",
  surface: "#FFFFFF",
  surfaceMuted: "#FBF6E6",
  border: "#EFE6CC",
  text: "#1E1B12",
  textMuted: "#6E6754",
  textFaint: "#A79F86",
  primary: "#F6D96B",
  primaryPressed: "#EBC94A",
  primaryText: "#1E1B12",
  primaryTint: "#FFF4C7",
  accent: "#B8901A",
  success: "#5BE296",
  warning: "#C77700",
  danger: "#C63D3D",
  retired: "#A79F86",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: "700" as const, color: colors.text },
  heading: { fontSize: 18, fontWeight: "600" as const, color: colors.text },
  body: { fontSize: 16, lineHeight: 24, color: colors.text },
  caption: { fontSize: 13, lineHeight: 18, color: colors.textMuted },
} as const;
