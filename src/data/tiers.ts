import type { TierConfig } from '@/types';

export const TIERS: Record<string, TierConfig> = {
  starter: {
    id: 'starter',
    label: 'Starter',
    description: 'Simple websites, fast generation, basic animations. Perfect for beginners.',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
    icon: 'zap',
    requiredPlan: 'free',
  },
  pro: {
    id: 'pro',
    label: 'Professional',
    description: 'Advanced layouts, modern visual effects, multi-page projects.',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
    icon: 'layers',
    requiredPlan: 'pro',
  },
  premium: {
    id: 'premium',
    label: 'Premium Experience',
    description: 'Cinematic 3D showcases, scroll storytelling, luxury brand experiences.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    icon: 'crown',
    requiredPlan: 'premium',
  },
};

export const PLAN_ACCESS: Record<string, string[]> = {
  free: ['starter'],
  pro: ['starter', 'pro'],
  premium: ['starter', 'pro', 'premium'],
  team: ['starter', 'pro', 'premium'],
};

export const canAccessTier = (userPlan: string, tier?: string): boolean => {
  return (PLAN_ACCESS[userPlan] || ['starter']).includes(tier || 'starter');
};
