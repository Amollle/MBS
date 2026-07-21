export interface Theme {
  id: string
  label: string
  emoji: string
}

export const THEMES: Theme[] = [
  { id: 'classic', label: 'Classic Binder', emoji: '📖' },
  { id: 'galaxy', label: 'Galaxy', emoji: '🌌' },
  { id: 'sakura', label: 'Sakura', emoji: '🌸' },
  { id: 'museum', label: 'Museum', emoji: '🏛️' },
  { id: 'neon', label: 'Neon', emoji: '⚡' },
  { id: 'forest', label: 'Forest', emoji: '🌿' },
  { id: 'frost', label: 'Frost', emoji: '❄️' },
  { id: 'pirate', label: 'Pirate', emoji: '🏴‍☠️' },
  { id: 'pixel', label: 'Pixel', emoji: '🎮' },
  { id: 'sky', label: 'Sky', emoji: '☁️' },
]

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}
