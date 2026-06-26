import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { HeroScene } from '@/components/3d';
import { TEMPLATES, CATEGORIES } from '@/data';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const SAMPLE = TEMPLATES.slice(0, 6);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(onEnter, 800);
  };

  return (
    <AnimatePresence>
      {!isTransitioning && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen bg-[#07070a] overflow-x-hidden relative"
        >
          {/* 3D Background */}
          <div className="fixed inset-0 z-0">
            <HeroScene />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#07070a]/75 backdrop-blur-2xl border-b border-white/[0.04] h-14 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm">
                    ⬡
                  </div>
                  <span className="font-bold text-base bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    DevForge
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Beta
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleEnter}
                    className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleEnter}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
                  >
                    Get Started Free <Icon name="arrow_right" size={14} />
                  </button>
                </div>
              </div>
            </header>

            {/* Hero */}
            <section className="relative pt-40 pb-20 text-center" style={{ minHeight: '100vh' }}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2256%22%20height%3D%2256%22%20viewBox%3D%220%200%2056%2056%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2256%22%20height%3D%2256%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M56%201V0H0v1h56zM1%200v56H0V0h1z%22%20fill%3D%22rgba(99%2C102%2C241%2C0.03)%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%2F%3E%3C%2Fsvg%3E')] opacity-30 pointer-events-none" />

              <div className="max-w-4xl mx-auto px-6 relative z-10 pt-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  50+ Premium Templates · Production-Ready Next.js Code
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.04]"
                >
                  The AI Website Generator
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    for Serious Developers
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed"
                >
                  Pick from 50+ stunning templates across 22 categories. Get production-ready Next.js code with TypeScript, Tailwind CSS, and Framer Motion — instantly.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap gap-3 justify-center mb-14"
                >
                  <button
                    onClick={handleEnter}
                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all"
                  >
                    <Icon name="zap" size={18} /> Generate Your Website Free
                  </button>
                  <button
                    onClick={handleEnter}
                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-2xl border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    Browse Templates <Icon name="layers" size={16} />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-10 mb-16"
                >
                  {[
                    { v: '50+', l: 'Templates' },
                    { v: '22', l: 'Categories' },
                    { v: '12K+', l: 'Developers' },
                    { v: '4.9★', l: 'Rating' },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <div className="text-2xl font-bold text-indigo-400 tracking-tight">{s.v}</div>
                      <div className="text-xs text-zinc-500 font-medium mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </motion.div>

                <div className="mb-8">
                  <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.15em] mb-4">
                    Trusted by developers at
                  </div>
                  <div className="flex flex-wrap gap-8 justify-center items-center">
                    {['Vercel', 'Stripe', 'Linear', 'Notion', 'Figma', 'Supabase'].map((co) => (
                      <span key={co} className="text-sm font-bold text-zinc-600">
                        {co}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Template Showcase */}
            <section className="py-24 relative z-10">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                    Template Library
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                    A template for every vision
                  </h2>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Each template has a unique visual identity — not re-skinned versions of the same layout.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-10">
                  {CATEGORIES.slice(0, 11).map((cat) => (
                    <div
                      key={cat.id}
                      onClick={handleEnter}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-800/50 border border-zinc-700/50 cursor-pointer hover:bg-zinc-700/50 transition-colors"
                      style={{ color: cat.color }}
                    >
                      {cat.label}
                    </div>
                  ))}
                  <div
                    onClick={handleEnter}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 cursor-pointer hover:bg-zinc-700/50 transition-colors"
                  >
                    +11 more
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                  {SAMPLE.map((t) => {
                    const c = t.preview.colors;
                    const isDark = t.preview.style === 'dark';
                    return (
                      <div
                        key={t.id}
                        onClick={handleEnter}
                        className="bg-zinc-800/50 border border-zinc-700/30 rounded-2xl overflow-hidden cursor-pointer group hover:border-zinc-600/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
                      >
                        <div className="h-40 relative overflow-hidden" style={{ background: c.bg }}>
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: `linear-gradient(${c.c1}10 1px, transparent 1px), linear-gradient(90deg, ${c.c1}10 1px, transparent 1px)`,
                              backgroundSize: '22px 22px',
                            }}
                          />
                          <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-2xl opacity-30"
                            style={{ background: `radial-gradient(circle, ${c.c1}40, transparent 70%)` }}
                          />
                          <div className="relative z-10 p-4 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                              <div
                                className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold"
                                style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c1}aa)` }}
                              >
                                {t.name[0]}
                              </div>
                              <span
                                className="text-[8px] font-bold px-2 py-0.5 rounded text-white"
                                style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c1}aa)` }}
                              >
                                CTA
                              </span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                              <div
                                className="text-xs font-bold mb-1"
                                style={{ color: isDark ? '#f0f0f8' : '#0a0a14', fontFamily: 'Space Grotesk, sans-serif' }}
                              >
                                {t.preview.headline}
                              </div>
                              <div
                                className="text-[8px] opacity-40 max-w-[180px]"
                                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
                              >
                                {t.preview.sub.slice(0, 46)}…
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mt-3">
                              {['⚡', '🔒', '🌍'].map((e) => (
                                <div
                                  key={e}
                                  className="text-center py-1 rounded text-xs"
                                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                                >
                                  {e}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-3.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold">{t.name}</span>
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {t.badge}
                            </span>
                            {t.plan === 'pro' && (
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                PRO
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500">{t.tagline}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleEnter}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    View All {TEMPLATES.length} Templates <Icon name="arrow_right" size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-zinc-900/50 border-y border-zinc-800/50 relative z-10">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-2">Why developers choose DevForge</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: 'zap', color: '#6366f1', title: 'Instant Generation', desc: 'From idea to complete Next.js project in under 30 seconds. No setup, no boilerplate.' },
                    { icon: 'code', color: '#22d3ee', title: 'Production-Ready Code', desc: 'TypeScript, Tailwind CSS, Framer Motion — the stack top engineers use, ready to ship.' },
                    { icon: 'layers', color: '#22c55e', title: '50+ Unique Designs', desc: 'Every template has a completely distinct visual identity — not re-skinned versions.' },
                    { icon: 'rocket', color: '#f59e0b', title: 'Deploy Anywhere', desc: 'Pre-configured for Vercel, Netlify, AWS. One-click deploys out of the box.' },
                    { icon: 'sparkles', color: '#ec4899', title: 'AI-Powered Content', desc: 'Claude fills your site with realistic content that fits your industry. No lorem ipsum.' },
                    { icon: 'users', color: '#a78bfa', title: 'Team Collaboration', desc: 'Shared template libraries, white-label exports, built for agencies that ship fast.' },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="bg-zinc-800/40 border border-zinc-700/30 rounded-2xl p-5 hover:border-zinc-600/50 hover:-translate-y-1 transition-all duration-200"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ background: `${f.color}15` }}
                      >
                        <Icon name={f.icon} size={18} style={{ color: f.color }} />
                      </div>
                      <div className="font-bold text-sm mb-1.5">{f.title}</div>
                      <div className="text-xs text-zinc-400 leading-relaxed">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative z-10">
              <div className="max-w-3xl mx-auto px-6 text-center">
                <div className="relative overflow-hidden rounded-[28px] p-14 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/5">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-44 bg-indigo-500/20 blur-3xl pointer-events-none" />
                  <div className="relative z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-5">
                      Get Started
                    </span>
                    <h2 className="text-3xl font-bold mb-3">Your next project starts here</h2>
                    <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-8 leading-relaxed">
                      Join 12,000+ developers building faster with DevForge. Free forever for 5 templates.
                    </p>
                    <button
                      onClick={handleEnter}
                      className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <Icon name="zap" size={18} /> Start Building Free
                    </button>
                    <div className="text-[11px] text-zinc-600 mt-3">
                      No credit card · Free plan forever · Upgrade anytime
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800/50 py-8 relative z-10">
              <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    DevForge
                  </span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Beta
                  </span>
                </div>
                <div className="text-[11px] text-zinc-600">
                  © 2026 DevForge. Built for developers who care about design.
                </div>
                <div className="flex gap-4">
                  {['GitHub', 'Twitter', 'Discord', 'Docs', 'Blog'].map((l) => (
                    <a key={l} href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
