import { useState, useMemo } from 'react';
import { TemplateCard } from './TemplateCard';
import { Icon } from './Icon';
import { TEMPLATES, CATEGORIES, TIERS, PLAN_ACCESS, canAccessTier } from '@/data';
import type { Template } from '@/types';

interface TemplateGridProps {
  onSelect: (t: Template) => void;
  userPlan: string;
}

export function TemplateGrid({ onSelect, userPlan }: TemplateGridProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showOnlyAccessible, setShowOnlyAccessible] = useState(false);

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tagline.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === 'all' || t.category === category;
      const matchTier = tierFilter === 'all' || t.tier === tierFilter;
      const matchAccess = !showOnlyAccessible || canAccessTier(userPlan, t.tier);
      return matchSearch && matchCat && matchTier && matchAccess;
    });
  }, [search, category, tierFilter, showOnlyAccessible, userPlan]);

  const tierCounts = useMemo(
    () => ({
      starter: TEMPLATES.filter((t) => t.tier === 'starter').length,
      pro: TEMPLATES.filter((t) => t.tier === 'pro').length,
      premium: TEMPLATES.filter((t) => t.tier === 'premium').length,
    }),
    []
  );

  return (
    <div>
      {/* Plan Access Banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 mb-5 rounded-xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-zinc-700/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <Icon name="crown" size={14} className="text-indigo-400" />
          </div>
          <div>
            <div className="text-sm font-semibold">
              You're on the{' '}
              <span className="text-indigo-400 capitalize">{userPlan}</span> plan
            </div>
            <div className="text-xs text-zinc-500">
              Access: {PLAN_ACCESS[userPlan].map((t) => TIERS[t].label).join(' + ')}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowOnlyAccessible((v) => !v)}
          className="flex items-center gap-2.5"
        >
          <div
            className={`relative w-9 h-[22px] rounded-full border transition-all duration-200 ${
              showOnlyAccessible
                ? 'bg-indigo-500 border-indigo-500'
                : 'bg-zinc-700 border-zinc-600'
            }`}
          >
            <div
              className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
                showOnlyAccessible ? 'left-[18px]' : 'left-[2px]'
              }`}
            />
          </div>
          <span className="text-xs text-zinc-400">Show only unlocked</span>
        </button>
      </div>

      {/* Tier Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { id: 'all', label: 'All Tiers', count: TEMPLATES.length, color: 'var(--text)', bg: 'var(--bg-4)', border: 'var(--border-3)' },
          { id: 'starter', label: 'Starter', count: tierCounts.starter, color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
          { id: 'pro', label: 'Professional', count: tierCounts.pro, color: '#a78bfa', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
          { id: 'premium', label: 'Premium Experience', count: tierCounts.premium, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTierFilter(t.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:-translate-y-0.5"
            style={{
              background: tierFilter === t.id ? t.bg : 'var(--bg-3)',
              borderColor: tierFilter === t.id ? t.border : 'var(--border)',
              color: tierFilter === t.id ? t.color : 'var(--text-2)',
            }}
          >
            {t.id === 'starter' && <Icon name="zap" size={11} />}
            {t.id === 'pro' && <Icon name="layers" size={11} />}
            {t.id === 'premium' && <Icon name="crown" size={11} />}
            {t.label}
            <span className="opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Search + Category */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="text-sm text-zinc-500">
          <span className="font-semibold text-zinc-300">{filtered.length}</span> templates
        </div>
      </div>

      {/* Category pills */}
      <div className="overflow-x-auto mb-6 pb-1">
        <div className="flex gap-1.5 min-w-max">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              category === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-700/50 hover:text-zinc-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat.id
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-700/50 hover:text-zinc-200'
              }`}
            >
              {cat.label}
              <span className="opacity-50 font-normal ml-1">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <div className="text-3xl mb-3">🔍</div>
          <div className="text-base font-semibold text-zinc-300 mb-1">No templates found</div>
          <div className="text-sm">Try adjusting your filters</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onSelect={onSelect}
              userPlan={userPlan}
              hovered={hoveredId === t.id}
              onHover={() => setHoveredId(t.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
