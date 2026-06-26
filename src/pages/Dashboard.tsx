import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { TEMPLATES, CATEGORIES } from '@/data';

interface DashboardProps {
  userPlan: string;
  generations: number;
  onNavigate: (page: string) => void;
}

export function Dashboard({ userPlan, generations, onNavigate }: DashboardProps) {
  const recent = TEMPLATES.slice(0, 3);
  const isFree = userPlan === 'free';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back 👋</h1>
          <p className="text-sm text-zinc-500">Here's what's happening with your account.</p>
        </div>
        <button
          onClick={() => onNavigate('generator')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Icon name="plus" size={14} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Generations', value: generations, icon: 'zap', color: '#6366f1', change: '+3 this week' },
          { label: 'Templates Used', value: 5, icon: 'layers', color: '#22d3ee', change: 'From 3 categories' },
          { label: 'Downloads', value: isFree ? 0 : 2, icon: 'download', color: '#22c55e', change: isFree ? 'Upgrade to download' : 'Last: 2 days ago' },
          { label: 'Plan', value: userPlan.charAt(0).toUpperCase() + userPlan.slice(1), icon: 'crown', color: '#f59e0b', change: isFree ? 'Upgrade available' : 'Active' },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <Icon name={s.icon} size={14} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </div>
            <div className="text-xs text-zinc-500">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Upgrade Banner */}
      {isFree && (
        <div className="flex items-center justify-between gap-4 flex-wrap p-5 mb-7 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20">
          <div>
            <div className="font-bold mb-1 flex items-center gap-2">
              <Icon name="sparkles" size={14} className="text-indigo-400" />
              Unlock all 50+ premium templates
            </div>
            <p className="text-sm text-zinc-400">
              Get unlimited generations, ZIP export, and priority support with Pro.
            </p>
          </div>
          <button
            onClick={() => onNavigate('pricing')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Upgrade to Pro — $29/mo
          </button>
        </div>
      )}

      {/* Recent Templates */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Recent Templates</h2>
          <button
            onClick={() => onNavigate('generator')}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Browse all <Icon name="arrow_right" size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recent.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/30 cursor-pointer hover:border-zinc-600/50 hover:bg-zinc-700/30 transition-all"
              onClick={() => onNavigate('generator')}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${t.palette.accent}, ${t.palette.accent2})` }}
              >
                {t.name[0]}
              </div>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-zinc-500">{CATEGORIES.find((c) => c.id === t.category)?.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage */}
      <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Daily Usage</span>
          <span className="text-xs text-zinc-500">{isFree ? `${generations}/5 generations` : 'Unlimited'}</span>
        </div>
        <div className="h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
            style={{ width: isFree ? `${Math.min(generations / 5, 1) * 100}%` : '35%' }}
          />
        </div>
        {isFree && (
          <p className="text-xs text-zinc-500 mt-2">
            {generations >= 5 ? 'Daily limit reached. Upgrade for unlimited.' : `${5 - generations} generations remaining today.`}
          </p>
        )}
      </div>
    </motion.div>
  );
}
