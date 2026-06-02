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

const adSlots: AdSlotConfig[] = [
  // ── Banner slots — always render ──
  // 728x90 banner after header (all pages)
  {
    id: 'after-header',
    key: '15ce9c139c20adf11145e670f717a1d9',
    format: 'iframe',
    width: 728,
    height: 90,
    scriptUrl: 'https://tolerateshyrenamed.com/15ce9c139c20adf11145e670f717a1d9/invoke.js',
    aggressive: false,
  },
  // 300x250 banner before footer (desktop)
  {
    id: 'before-footer-desktop',
    key: 'e76ddce0c5fd88a8ea9e4c1c66c35568',
    format: 'iframe',
    width: 300,
    height: 250,
    scriptUrl: 'https://tolerateshyrenamed.com/e76ddce0c5fd88a8ea9e4c1c66c35568/invoke.js',
    aggressive: false,
  },
  // 320x50 banner before footer (mobile)
  {
    id: 'before-footer-mobile',
    key: 'bfae236fa1c40bb93264ca845006ffd3',
    format: 'iframe',
    width: 320,
    height: 50,
    scriptUrl: 'https://tolerateshyrenamed.com/bfae236fa1c40bb93264ca845006ffd3/invoke.js',
    aggressive: false,
  },
  // 300x250 banner mid-article (ArticleLayout pages)
  {
    id: 'mid-content',
    key: 'e76ddce0c5fd88a8ea9e4c1c66c35568',
    format: 'iframe',
    width: 300,
    height: 250,
    scriptUrl: 'https://tolerateshyrenamed.com/e76ddce0c5fd88a8ea9e4c1c66c35568/invoke.js',
    aggressive: false,
  },
  // 300x250 banner homepage feed
  {
    id: 'home-feed',
    key: 'e76ddce0c5fd88a8ea9e4c1c66c35568',
    format: 'iframe',
    width: 300,
    height: 250,
    scriptUrl: 'https://tolerateshyrenamed.com/e76ddce0c5fd88a8ea9e4c1c66c35568/invoke.js',
    aggressive: false,
  },

  // ── Native Banner — always render (safe format) ──
  {
    id: 'native-banner',
    key: 'abad091f51ad558460bad1d9dfd3e37d',
    format: 'native-banner',
    width: 0,
    height: 0,
    containerId: 'container-abad091f51ad558460bad1d9dfd3e37d',
    scriptUrl: 'https://tolerateshyrenamed.com/abad091f51ad558460bad1d9dfd3e37d/invoke.js',
    aggressive: false,
  },

  // ── Aggressive — Social Bar (only when aggressiveFormatsEnabled) ──
  {
    id: 'social-bar',
    key: '5e096652c1c98e1f67aff2f1625b0586',
    format: 'script',
    width: 0,
    height: 0,
    scriptUrl: 'https://tolerateshyrenamed.com/5e/09/66/5e096652c1c98e1f67aff2f1625b0586.js',
    aggressive: true,
  },
];

// ─── Feature Toggles ──────────────────────────────────────────

const adultAdsEnabled = false;
const aggressiveFormatsEnabled = true;

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
