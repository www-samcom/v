import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { TEMPLATES, CATEGORIES } from '@/data';
import type { Template } from '@/types';

interface AdminPanelProps {
  toast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
}

export function AdminPanel({ toast }: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState('templates');
  const [tpls, setTpls] = useState<Template[]>(TEMPLATES);

  const fakeUsers = [
    { id: 1, name: 'Alex Chen', email: 'alex@nexify.io', plan: 'pro', created: '2026-01-15', status: 'active' },
    { id: 2, name: 'Jordan Kim', email: 'jordan@stackr.dev', plan: 'team', created: '2026-02-03', status: 'active' },
    { id: 3, name: 'Sam Rivera', email: 'sam@gmail.com', plan: 'free', created: '2026-03-22', status: 'active' },
    { id: 4, name: 'Morgan Blake', email: 'morgan@orbitly.io', plan: 'pro', created: '2026-04-01', status: 'inactive' },
    { id: 5, name: 'Casey Nguyen', email: 'casey@prism.co', plan: 'free', created: '2026-04-18', status: 'active' },
  ];

  const fakeAnalytics = {
    daily: [120, 98, 145, 132, 167, 189, 201, 178, 234, 256, 212, 290],
    totalUsers: 2847,
    newToday: 23,
    revenue: 18420,
    conversions: 12.4,
  };

  const disableTemplate = (id: string) => {
    setTpls((t) => t.map((tp) => (tp.id === id ? { ...tp, disabled: !tp.disabled } : tp)));
    toast('Template status updated', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Icon name="shield" size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-zinc-500">Manage templates, users, and platform analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-800/40 border border-zinc-700/30 rounded-lg w-fit mb-6">
        {[
          { id: 'templates', label: 'Templates', icon: 'layers' },
          { id: 'users', label: 'Users', icon: 'users' },
          { id: 'analytics', label: 'Analytics', icon: 'chart' },
          { id: 'billing', label: 'Revenue', icon: 'credit_card' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setAdminTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              adminTab === t.id ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon name={t.icon} size={12} /> {t.label}
          </button>
        ))}
      </div>

      {/* Templates Tab */}
      {adminTab === 'templates' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-500">{tpls.length} templates in library</span>
            <button
              onClick={() => toast('Template editor coming soon!', 'info')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-lg transition-all"
            >
              <Icon name="plus" size={12} /> Add Template
            </button>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-700/30">
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Template</th>
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Plan</th>
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tpls.slice(0, 15).map((t) => (
                  <tr key={t.id} className="border-b border-zinc-700/20 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${t.palette.accent}, ${t.palette.accent2})` }}
                        >
                          {t.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{t.name}</div>
                          <div className="text-[11px] text-zinc-500">{t.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {CATEGORIES.find((c) => c.id === t.category)?.label}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          t.plan === 'pro'
                            ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {t.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          t.disabled
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {t.disabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toast('Edit mode coming soon', 'info')}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/40 transition-all"
                        >
                          <Icon name="edit" size={12} />
                        </button>
                        <button
                          onClick={() => disableTemplate(t.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            t.disabled
                              ? 'text-zinc-400 hover:text-white hover:bg-zinc-700/40'
                              : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                          }`}
                        >
                          <Icon name={t.disabled ? 'unlock' : 'lock'} size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {adminTab === 'users' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-500">{fakeUsers.length} registered users</span>
            <button
              onClick={() => toast('Export coming soon', 'info')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 bg-zinc-800/50 border border-zinc-700/30 rounded-lg hover:bg-zinc-700/30 transition-all"
            >
              <Icon name="download" size={12} /> Export CSV
            </button>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-700/30">
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">User</th>
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Plan</th>
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Joined</th>
                  <th className="text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {fakeUsers.map((u) => (
                  <tr key={u.id} className="border-b border-zinc-700/20 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{u.name}</div>
                          <div className="text-[11px] text-zinc-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          u.plan === 'pro'
                            ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                            : u.plan === 'team'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{u.created}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {adminTab === 'analytics' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', value: fakeAnalytics.totalUsers.toLocaleString(), icon: 'users', color: '#6366f1', change: '+23 today' },
              { label: 'Monthly Revenue', value: `$${fakeAnalytics.revenue.toLocaleString()}`, icon: 'credit_card', color: '#22c55e', change: '+$1,240 this week' },
              { label: 'Conversion Rate', value: `${fakeAnalytics.conversions}%`, icon: 'trending_up', color: '#22d3ee', change: '+0.8% vs last month' },
              { label: 'New Today', value: fakeAnalytics.newToday, icon: 'activity', color: '#f59e0b', change: 'Peak at 2PM' },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                    <Icon name={s.icon} size={14} style={{ color: s.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-emerald-400">{s.change}</div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5">
            <div className="font-semibold text-sm mb-4">Daily Generations (last 12 days)</div>
            <div className="flex items-end gap-2 h-32">
              {fakeAnalytics.daily.map((v, i) => {
                const max = Math.max(...fakeAnalytics.daily);
                const pct = (v / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-zinc-500">{v}</span>
                    <div
                      className="w-full rounded-t transition-all duration-500"
                      style={{
                        height: `${Math.max(pct, 5)}%`,
                        background: 'linear-gradient(to top, #6366f1, #8b5cf6)',
                        opacity: i === fakeAnalytics.daily.length - 1 ? 1 : 0.7,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {adminTab === 'billing' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'MRR', value: '$18,420', sub: 'Monthly recurring revenue', color: '#22c55e', icon: 'trending_up' },
              { label: 'Pro Users', value: '412', sub: 'At $29/mo = $11,948 MRR', color: '#6366f1', icon: 'users' },
              { label: 'Team Users', value: '89', sub: 'At $79/mo = $7,031 MRR', color: '#22d3ee', icon: 'users' },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                    <Icon name={s.icon} size={14} style={{ color: s.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-zinc-500">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5">
            <div className="font-semibold text-sm mb-1">Stripe Integration</div>
            <div className="text-sm text-zinc-500 mb-4">
              Connect Stripe to enable subscription billing and payment processing.
            </div>
            <button
              onClick={() => toast('Stripe integration ready to configure in .env.local', 'info')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
            >
              <Icon name="link" size={12} /> Connect Stripe
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
