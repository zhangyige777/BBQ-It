import configData from '@/data/game.config.json';
import meatsData from '@/data/meats.json';
import codesData from '@/data/codes.json';
import grillsData from '@/data/grills.json';
import upgradesData from '@/data/upgrades.json';

// ─── Interfaces ───────────────────────────────────────────────

export interface GameConfig {
  game: {
    name: string;
    robloxId: string;
    developer: string;
    genre: string;
    currentVersion: string;
    lastUpdated: string;
    updateSchedule: string;
    platforms: string[];
    description: string;
  };
  stats: {
    visits: string;
    favorites: string;
    likes: string;
    onlineNow: string;
    serverSize: string;
    active: boolean;
    lastChecked: string;
  };
  seo: {
    siteTitle: string;
    siteDescription: string;
    baseUrl: string;
    primaryKeywords: string[];
    secondaryKeywords: string[];
    defaultOgImage: string;
  };
  routes: { path: string; title: string; priority: string }[];
}

export interface Meat {
  id: string;
  name: string;
  slug: string;
  rawCost: number;
  cookValue: number;
  perfectValue: number;
  burnValue: number;
  cookTime: number;
  weight: number;
  tier: string;
  description: string;
  tags: string[];
}

export interface Code {
  code: string;
  reward: string;
  source: string;
  addedDate: string;
  status: 'active' | 'expired';
  isNew: boolean;
}

export interface Grill {
  id: string;
  name: string;
  slug: string;
  cost: number;
  slots: number;
  cookSpeed: number;
  offline: boolean;
  tier: string;
  description: string;
}

export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  effect: string;
  category: string;
  tier: string;
  description: string;
}

// ─── Data Access ──────────────────────────────────────────────

const config: GameConfig = configData as GameConfig;
const meats: Meat[] = (meatsData as { meats: Meat[] }).meats;
const codes: Code[] = (codesData as { codes: Code[] }).codes;
const grills: Grill[] = (grillsData as { grills: Grill[] }).grills;
const upgrades: Upgrade[] = (upgradesData as { upgrades: Upgrade[] }).upgrades;

export const getGameConfig = () => config;

export const getActiveCodes = () => codes.filter(c => c.status === 'active');

export const getExpiredCodes = () => codes.filter(c => c.status === 'expired');

export const getMeats = () => meats;

export const getMeatBySlug = (slug: string) => meats.find(m => m.slug === slug);

export const getMeatsByTier = (tier: string) => meats.filter(m => m.tier === tier);

export const getGrills = () => grills;

export const getOfflineGrills = () => grills.filter(g => g.offline);

export const getActiveGrills = () => grills.filter(g => !g.offline);

export const getUpgrades = () => upgrades;

export const getUpgradesByCategory = (category: string) => upgrades.filter(u => u.category === category);

// ─── Helpers ──────────────────────────────────────────────────

export function getCurrentDateString() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(0);
}

// ─── SEO Schema Generators ────────────────────────────────────

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = config.seo.baseUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.url, baseUrl).href,
    })),
  };
}

export function generateFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export function generateVideoGameSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: config.game.name,
    description: config.seo.siteDescription,
    genre: config.game.genre,
    url: `https://www.roblox.com/games/${config.game.robloxId}/BBQ-It`,
    operatingSystem: config.game.platforms.join(', '),
    author: {
      '@type': 'Organization',
      name: config.game.developer,
    },
    applicationCategory: 'Game',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateItemListSchema(items: { name: string; url: string; position: number }[]) {
  const baseUrl = config.seo.baseUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: new URL(item.url, baseUrl).href,
    })),
  };
}

export function generateWebApplicationSchema(name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: config.seo.baseUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
