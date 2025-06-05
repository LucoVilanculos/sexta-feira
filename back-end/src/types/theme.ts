export interface ThemeSettings {
  mode: ThemeMode
  primaryColor: string
  accentColor: string
  fontSize: FontSize
  fontFamily: string
  customCss?: string
}

export type ThemeMode = "light" | "dark" | "system"
export type FontSize = "small" | "medium" | "large" 