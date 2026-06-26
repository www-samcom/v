import { useState, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import { ToastContainer } from '@/components/ToastContainer';
import { useToasts } from '@/hooks/useToasts';
import { LandingPage } from '@/pages/LandingPage';
import { GeneratorView } from '@/pages/GeneratorView';
import { PricingPage } from '@/pages/PricingPage';
import { Dashboard } from '@/pages/Dashboard';
import { AdminPanel } from '@/pages/AdminPanel';
import { SettingsPage } from '@/pages/SettingsPage';
import { CompactHeroScene } from '@/components/3d';


function App() {
  const [showLanding, setShowLanding] = useState(() => {
    try {
      return localStorage.getItem('devforge_visited') !== 'true';
    } catch {
      return true;
    }
  });
  const [page, setPage] = useState('generator');
  const [userPlan, setUserPlan] = useState(() => {
    try {
      return localStorage.getItem('devforge_plan') || 'free';
    } catch {
      return 'free';
    }
  });
  const [generations, setGenerations] = useState(0);
  const { toasts, toast } = useToasts();

  useEffect(() => {
    try {
      localStorage.setItem('devforge_plan', userPlan);
    } catch {}
  }, [userPlan]);

  const handleEnter = () => {
    try {
      localStorage.setItem('devforge_visited', 'true');
    } catch {}
    setShowLanding(false);
  };

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') return;
    setUserPlan(planId);
    toast(`Upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan! 🎉`, 'success');
    setPage('generator');
  };

  const handleGenerate = () => {
    setGenerations((g) => g + 1);
  };

  const handleNavigate = (targetPage: string) => {
    setPage(targetPage);
  };

  if (showLanding) {
    return (
      <>
        <LandingPage onEnter={handleEnter} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  const NAV = [
    { id: 'generator', label: 'Templates', icon: 'layers' },
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'pricing', label: 'Pricing', icon: 'credit_card' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'admin', label: 'Admin', icon: 'shield' },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col relative">
      {/* Subtle 3D Background in app */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <CompactHeroScene />
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-[#07070a]/85 backdrop-blur-2xl border-b border-zinc-800/50 h-14 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center gap-0 h-full">
          {/* Logo */}
          <button
            onClick={() => setPage('generator')}
            className="flex items-center gap-2 mr-6 sm:mr-8"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs">
              ⬡
            </div>
            <span className="hidden sm:block font-bold text-sm bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              DevForge
            </span>
            <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Beta
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  page === n.id
                    ? 'text-white bg-zinc-700/50'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/30'
                }`}
              >
                <Icon name={n.icon} size={13} />
                {n.label}
                {n.id === 'admin' && (
                  <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-red-500/10 text-red-400">
                    Admin
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <button
              onClick={() => setShowLanding(true)}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              ← Home
            </button>
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${
                userPlan === 'free'
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/30'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}
            >
              <Icon name="crown" size={11} />
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
            </div>
            {userPlan === 'free' && (
              <button
                onClick={() => setPage('pricing')}
                className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col relative z-10">
        <main className="flex-1 py-8 sm:py-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {page === 'generator' && (
              <GeneratorView
                userPlan={userPlan}
                generations={generations}
                onGenerate={handleGenerate}
                toast={toast}
              />
            )}
            {page === 'pricing' && (
              <PricingPage userPlan={userPlan} onUpgrade={handleUpgrade} />
            )}
            {page === 'dashboard' && (
              <Dashboard userPlan={userPlan} generations={generations} onNavigate={handleNavigate} />
            )}
            {page === 'admin' && <AdminPanel toast={toast} />}
            {page === 'settings' && <SettingsPage userPlan={userPlan} toast={toast} />}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 py-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                DevForge
              </span>
              <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Beta
              </span>
            </div>
            <div className="text-xs text-zinc-600">
              AI Website Generator — 50+ premium templates · Production-ready code
            </div>
            <div className="flex gap-4">
              {['GitHub', 'Twitter', 'Discord', 'Docs'].map((l) => (
                <a key={l} href="#" className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;
