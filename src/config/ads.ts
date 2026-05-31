// ─── Adsterra Ad Configuration ────────────────────────────────
// This is the ONLY place ad keys and zone IDs live.
// AdSlot.astro and BaseLayout read from here.
// Never hardcode ad script IDs anywhere else.

export interface AdSlotConfig {
  id: string;
  key: string;
  format: string;
  width: number;
  height: number;
  containerId?: string;
  scriptUrl: string;
  aggressive: boolean; // if true, only renders when aggressiveFormatsEnabled is true
}

// ─── Ad Slot Definitions ──────────────────────────────────────
// TODO: Replace placeholder keys with real Adsterra keys for the BBQ It site

const adSlots: AdSlotConfig[] = [
  // Safe slots — always render (when enabled)
  {
    id: 'after-header',
    key: 'PLACEHOLDER_BANNER_728x90',
    format: 'iframe',
    width: 728,
    height: 90,
    scriptUrl: 'https://www.highperformanceformat.com/PLACEHOLDER_KEY/invoke.js',
    aggressive: false,
  },
  {
    id: 'before-footer-desktop',
    key: 'PLACEHOLDER_BANNER_300x250',
    format: 'iframe',
    width: 300,
    height: 250,
    scriptUrl: 'https://www.highperformanceformat.com/PLACEHOLDER_KEY/invoke.js',
    aggressive: false,
  },
  {
    id: 'before-footer-mobile',
    key: 'PLACEHOLDER_BANNER_320x50',
    format: 'iframe',
    width: 320,
    height: 50,
    scriptUrl: 'https://www.highperformanceformat.com/PLACEHOLDER_KEY/invoke.js',
    aggressive: false,
  },
  {
    id: 'mid-content',
    key: 'PLACEHOLDER_MID_BANNER',
    format: 'iframe',
    width: 300,
    height: 250,
    scriptUrl: 'https://www.highperformanceformat.com/PLACEHOLDER_KEY/invoke.js',
    aggressive: false,
  },
  // Aggressive slots — only render when aggressiveFormatsEnabled is true
  {
    id: 'popup',
    key: 'PLACEHOLDER_POPUP',
    format: 'popup',
    width: 0,
    height: 0,
    containerId: 'container-placeholder-popup',
    scriptUrl: 'https://plPLACEHOLDER.effectivecpmnetwork.com/PLACEHOLDER/invoke.js',
    aggressive: true,
  },
  {
    id: 'bottom-script',
    key: 'PLACEHOLDER_BOTTOM',
    format: 'script',
    width: 0,
    height: 0,
    scriptUrl: 'https://plPLACEHOLDER.effectivecpmnetwork.com/PLACEHOLDER/PLACEHOLDER.js',
    aggressive: true,
  },
];

// ─── Feature Toggles ──────────────────────────────────────────

const adultAdsEnabled = false;
const aggressiveFormatsEnabled = false;

// ─── Accessors ────────────────────────────────────────────────

export function getAdSlot(id: string): AdSlotConfig | undefined {
  return adSlots.find(s => s.id === id);
}

export function getSafeAdSlots(): AdSlotConfig[] {
  return adSlots.filter(s => !s.aggressive);
}

export function getAggressiveAdSlots(): AdSlotConfig[] {
  return adSlots.filter(s => s.aggressive);
}

export function isAdultAdsEnabled(): boolean {
  return adultAdsEnabled;
}

export function isAggressiveFormatsEnabled(): boolean {
  return aggressiveFormatsEnabled;
}

export function shouldRenderSlot(slot: AdSlotConfig): boolean {
  if (slot.key.includes('PLACEHOLDER') || slot.scriptUrl.includes('PLACEHOLDER')) {
    return false;
  }
  if (slot.aggressive) {
    return aggressiveFormatsEnabled;
  }
  return true;
}
