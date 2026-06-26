import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { PLANS } from '@/data';

interface PricingPageProps {
  userPlan: string;
  onUpgrade: (planId: string) => void;
}

export function PricingPage({ userPlan, onUpgrade }: PricingPageProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="text-center mb-12">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          Pricing
        </span>
        <h1 className="text-4xl font-bold mb-3">
          Simple, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">transparent</span> pricing
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          Start free. Scale as you grow. No hidden fees.
        </p>

        <div className="inline-flex items-center gap-2 p-1 bg-zinc-800/60 border border-zinc-700/30 rounded-xl">
          {['Monthly', 'Annual'].map((p) => (
            <button
              key={p}
              onClick={() => setAnnual(p === 'Annual')}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                (p === 'Annual') === annual
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {p} {p === 'Annual' && <span className="opacity-70 ml-1">−20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16">
        {PLANS.map((plan) => {
          const price = annual && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price;
          const isCurrent = plan.id === userPlan;

          return (
            <div
              key={plan.id}
              className={`relative p-7 rounded-2xl border transition-all hover:-translate-y-1 ${
                plan.popular
                  ? 'border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 shadow-xl shadow-indigo-500/10'
                  : 'border-zinc-700/30 bg-zinc-800/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-indigo-500">
                  POPULAR
                </div>
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider">
                  {plan.name}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Current plan
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">
                {plan.price === 0 ? 'Free' : `$${price}`}
                {plan.price > 0 && <span className="text-sm font-normal text-zinc-500">/mo</span>}
              </div>
              <div className="text-sm text-zinc-500 mb-5">{plan.description}</div>
              <button
                onClick={() => onUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all mb-5 ${
                  plan.popular
                    ? 'text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5'
                    : 'border border-zinc-600 text-zinc-300 hover:bg-zinc-700/30'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
              >
                {isCurrent ? 'Your current plan' : plan.cta}
              </button>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-center gap-2.5 text-sm ${
                      f.ok ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                        f.ok ? 'bg-emerald-500/10' : 'bg-zinc-700/30'
                      }`}
                    >
                      {f.ok ? (
                        <Icon name="check" size={10} className="text-emerald-400" />
                      ) : (
                        <Icon name="minus" size={10} className="text-zinc-600" />
                      )}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-0">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel with one click from your dashboard. No questions asked, no cancellation fees.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfer for annual enterprise plans.' },
            { q: 'Is there a free trial for Pro?', a: 'Yes — Pro comes with a 7-day free trial. No credit card required to start.' },
            { q: 'Can I export the generated code?', a: 'Pro and Team plans include full ZIP export with production-ready Next.js code.' },
            { q: 'What happens when I hit my limits?', a: 'Free users can generate 5 previews per day. Upgrade to Pro for unlimited generations.' },
          ].map(({ q, a }) => (
            <div key={q} className="py-4 border-b border-zinc-700/30">
              <div className="text-sm font-semibold mb-1.5">{q}</div>
              <div className="text-sm text-zinc-400 leading-relaxed">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
