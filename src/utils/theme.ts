export interface ThemeColor {
  token: string;
  name: string;
  hex: string;
}

export const themeColors: ThemeColor[] = [
  { token: 'indigo', name: 'Electric Indigo', hex: '#6366f1' },
  { token: 'crimson', name: 'Crimson Rose', hex: '#f43f5e' },
  { token: 'emerald', name: 'Emerald Sage', hex: '#10b981' },
  { token: 'purple', name: 'Neon Purple', hex: '#a855f7' },
  { token: 'peach', name: 'Sunset Peach', hex: '#f97316' },
  { token: 'neutral', name: 'Obsidian Charcoal', hex: '#555555' }
];

export const getThemeHex = (token: string): string => {
  const match = themeColors.find(c => c.token === token);
  return match ? match.hex : '#6366f1';
};
