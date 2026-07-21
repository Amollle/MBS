export interface Theme {
  id: string
  label: string
  emoji: string
  vibe: string
  binderLabel: string
  cardLabel: string
  createLabel: string
}

export const THEMES: Theme[] = [
  {
    id: 'classic',
    label: 'Classic Binder',
    emoji: '📖',
    vibe: 'Clean and simple',
    binderLabel: 'Binder',
    cardLabel: 'Card',
    createLabel: 'Add Card',
  },
  {
    id: 'galaxy',
    label: 'Cosmic Archive',
    emoji: '🌌',
    vibe: 'Legendary treasures from across the universe',
    binderLabel: 'Archive',
    cardLabel: 'Artifact',
    createLabel: 'Log Artifact',
  },
  {
    id: 'sakura',
    label: 'Capsule Machine',
    emoji: '🌸',
    vibe: 'Gachapon capsule collecting joy',
    binderLabel: 'Capsule',
    cardLabel: 'Figure',
    createLabel: 'Unbox Figure',
  },
  {
    id: 'museum',
    label: 'Museum',
    emoji: '🏛️',
    vibe: 'Priceless artifacts on display',
    binderLabel: 'Exhibit',
    cardLabel: 'Specimen',
    createLabel: 'Add to Exhibit',
  },
  {
    id: 'neon',
    label: 'Neon Cyberpunk',
    emoji: '⚡',
    vibe: 'Hacker storing rare digital assets',
    binderLabel: 'Vault',
    cardLabel: 'Asset',
    createLabel: 'Upload Asset',
  },
  {
    id: 'forest',
    label: 'Cozy Library',
    emoji: '🌿',
    vibe: 'Ancient bookshelves full of collectibles',
    binderLabel: 'Tome',
    cardLabel: 'Page',
    createLabel: 'Add Page',
  },
  {
    id: 'frost',
    label: 'Floating Islands',
    emoji: '❄️',
    vibe: 'Peaceful islands in the sky',
    binderLabel: 'Island',
    cardLabel: 'Discovery',
    createLabel: 'Discover',
  },
  {
    id: 'pirate',
    label: 'Treasure Hunter',
    emoji: '🏴‍☠️',
    vibe: 'Your collection is your treasure',
    binderLabel: 'Chest',
    cardLabel: 'Loot',
    createLabel: 'Stash Loot',
  },
  {
    id: 'pixel',
    label: 'Retro Game UI',
    emoji: '🎮',
    vibe: 'Game Boy meets Pok\u00e9mon nostalgia',
    binderLabel: 'Save File',
    cardLabel: 'Creature',
    createLabel: 'Catch',
  },
  {
    id: 'sky',
    label: 'Research Lab',
    emoji: '☁️',
    vibe: 'Cataloguing every specimen',
    binderLabel: 'Catalog',
    cardLabel: 'Specimen',
    createLabel: 'Catalogue',
  },
]

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}
