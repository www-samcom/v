import { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsPageProps {
  userPlan: string;
  toast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
}

export function SettingsPage({ userPlan, toast }: SettingsPageProps) {
  const [notifs, setNotifs] = useState(true);
  const [dark, setDark] = useState(true);
  const [compact, setCompact] = useState(false);

  const Toggle = ({ val, onToggle }: { val: boolean; onToggle: () => void }) => (
    <div
      onClick={onToggle}
      className={`relative w-9 h-[22px] rounded-full border cursor-pointer transition-all duration-200 ${
        val ? 'bg-indigo-500 border-indigo-500' : 'bg-zinc-700 border-zinc-600'
      }`}
    >
      <div
        className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
          val ? 'left-[18px]' : 'left-[2px]'
        }`}
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-xl">
      <h1 className="text-xl font-bold mb-6">Settings</h1>

      {[
        {
          title: 'Account',
          items: [
            { label: 'Display Name', type: 'input' as const, value: 'Alex Chen' },
            { label: 'Email', type: 'input' as const, value: 'alex@nexify.io' },
            { label: 'Current Plan', type: 'badge' as const, value: userPlan },
          ],
        },
        {
          title: 'Preferences',
          items: [
            {
              label: 'Dark Mode',
              type: 'toggle' as const,
              value: dark,
              onChange: () => {
                setDark((v) => !v);
                toast('Preference saved', 'success');
              },
            },
            {
              label: 'Email Notifications',
              type: 'toggle' as const,
              value: notifs,
              onChange: () => {
                setNotifs((v) => !v);
                toast('Preference saved', 'success');
              },
            },
            {
              label: 'Compact View',
              type: 'toggle' as const,
              value: compact,
              onChange: () => {
                setCompact((v) => !v);
                toast('Preference saved', 'success');
              },
            },
          ],
        },
      ].map((section) => (
        <div key={section.title} className="mb-7">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3.5">
            {section.title}
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl overflow-hidden">
            {section.items.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i < section.items.length - 1 ? 'border-b border-zinc-700/30' : ''
                }`}
              >
                <span className="text-sm text-zinc-300">{item.label}</span>
                {item.type === 'input' && (
                  <input
                    type="text"
                    defaultValue={item.value}
                    className="w-auto max-w-[220px] px-3 py-1.5 bg-zinc-700/40 border border-zinc-600/30 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                )}
                {item.type === 'toggle' && 'onChange' in item && (
                  <Toggle val={item.value as boolean} onToggle={item.onChange as () => void} />
                )}
                {item.type === 'badge' && (
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      item.value === 'pro'
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : item.value === 'premium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          onClick={() => toast('Settings saved!', 'success')}
          className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Save Changes
        </button>
        <button
          onClick={() => toast('Account deletion requires email confirmation', 'warn')}
          className="px-5 py-2.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
        >
          Delete Account
        </button>
      </div>
    </motion.div>
  );
}
