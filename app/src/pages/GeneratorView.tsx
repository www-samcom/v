import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { TemplateGrid } from '@/components/TemplateGrid';
import { FileTree } from '@/components/FileTree';
import { CodeViewer } from '@/components/CodeViewer';
import { LivePreview } from '@/components/LivePreview';
import { canAccessTier, TIERS, generateTemplateFiles } from '@/data';
import type { Template, GeneratedFiles } from '@/types';
import JSZip from 'jszip';

interface GeneratorViewProps {
  userPlan: string;
  generations: number;
  onGenerate: () => void;
  toast: (msg: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
}

export function GeneratorView({ userPlan, generations, onGenerate, toast }: GeneratorViewProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Template | null>(null);
  const [projectName, setProjectName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ template: Template; files: GeneratedFiles } | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleSelectTemplate = (t: Template) => {
    if (!canAccessTier(userPlan, t.tier)) {
      const requiredPlan = t.tier === 'premium' ? 'Premium' : 'Pro';
      toast(`🔒 This is a ${TIERS[t.tier!].label} template. Upgrade to ${requiredPlan} to unlock.`, 'warn');
      return;
    }
    if (userPlan === 'free' && generations >= 5) {
      toast('Daily generation limit reached. Upgrade for unlimited.', 'warn');
      return;
    }
    setSelected(t);
    setProjectName(t.name);
    setStep(1);
  };

  const handleGenerate = async () => {
    if (!selected) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2200));
    const files = generateTemplateFiles(selected, projectName);
    setGenerated({ template: selected, files });
    setSelectedFile(Object.keys(files)[0]);
    setActiveTab('preview');
    setStep(2);
    setGenerating(false);
    onGenerate();
    toast(`✨ ${projectName} generated successfully!`, 'success');
  };

  const handleDownload = async () => {
    if (userPlan === 'free') {
      toast('ZIP download requires Pro plan', 'warn');
      return;
    }
    if (!generated) return;
    setDownloading(true);
    const zip = new JSZip();
    Object.entries(generated.files).forEach(([path, content]) => {
      zip.file(path, content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
    toast('Project downloaded!', 'success');
  };

  const reset = () => {
    setStep(0);
    setSelected(null);
    setGenerated(null);
    setProjectName('');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.div
          key="step0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Template</h1>
            <p className="text-zinc-400">
              Browse 50+ premium templates across 22 categories. Pick one to customize.
            </p>
          </div>
          <TemplateGrid onSelect={handleSelectTemplate} userPlan={userPlan} />
        </motion.div>
      )}

      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl"
        >
          <button
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg border border-zinc-700/30 transition-all mb-6"
          >
            <Icon name="arrow_left" size={13} /> Back to templates
          </button>

          {selected && (
            <>
              <div className="flex items-center gap-4 p-5 bg-zinc-800/40 border border-zinc-700/30 rounded-2xl mb-8">
                <div
                  className="w-13 h-13 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${selected.palette.accent}, ${selected.palette.accent2})`,
                    width: '52px',
                    height: '52px',
                  }}
                >
                  {selected.name[0]}
                </div>
                <div>
                  <div className="font-bold text-base mb-0.5">{selected.name}</div>
                  <div className="text-sm text-zinc-400">{selected.tagline}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selected.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-700/50 text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-5 mb-6">
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">
                  Included in this template
                </div>
                <div className="flex flex-col gap-2">
                  {selected.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm">
                      <span className="w-4.5 h-4.5 rounded flex items-center justify-center bg-emerald-500/10 flex-shrink-0">
                        <Icon name="check" size={10} className="text-emerald-400" />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !projectName.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
              >
                {generating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Generating your project...</span>
                  </>
                ) : (
                  <>
                    <Icon name="zap" size={15} /> Generate Project
                  </>
                )}
              </button>

              {generating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-zinc-800/40 border border-zinc-700/30 rounded-xl"
                >
                  <GeneratingProgress />
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      )}

      {step === 2 && generated && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{projectName}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Icon name="check" size={9} /> Generated
                </span>
              </div>
              <div className="text-sm text-zinc-400">
                {generated.template.name} template · {Object.keys(generated.files).length} files
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl border border-zinc-700/30 transition-all"
              >
                <Icon name="refresh" size={13} /> New Project
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl disabled:opacity-50 transition-all"
              >
                {downloading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Icon name="download" size={13} />{' '}
                    {userPlan === 'free' ? 'Upgrade to Download' : 'Download ZIP'}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-zinc-800/40 border border-zinc-700/30 rounded-lg w-fit mb-5">
            {[
              { id: 'preview' as const, label: 'Preview', icon: 'eye' },
              { id: 'code' as const, label: 'Code Explorer', icon: 'code' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === t.id
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon name={t.icon} size={12} /> {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'preview' ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-[620px]"
              >
                <LivePreview template={generated.template} />
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-[240px_1fr] h-[620px] bg-zinc-800/40 border border-zinc-700/30 rounded-2xl overflow-hidden"
              >
                <div className="border-r border-zinc-700/30 overflow-auto p-2.5">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 pb-2.5">
                    Explorer
                  </div>
                  <FileTree
                    files={generated.files}
                    selected={selectedFile}
                    onSelect={setSelectedFile}
                  />
                </div>
                <div className="overflow-hidden">
                  {selectedFile ? (
                    <CodeViewer files={generated.files} selected={selectedFile} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                      Select a file to view
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 p-4 bg-zinc-800/40 border border-zinc-700/30 rounded-xl">
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">
              Quick Start
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                `cd ${projectName.toLowerCase().replace(/\s+/g, '-')}`,
                'npm install',
                'npm run dev',
                'open http://localhost:3000',
              ].map((cmd, i) => (
                <div key={cmd} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-[9px] font-bold text-indigo-400 flex-shrink-0">
                    {i + 1}
                  </span>
                  <code className="text-xs text-emerald-400 font-mono">{cmd}</code>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GeneratingProgress() {
  const [phase, setPhase] = useState(0);
  const phases = [
    'Analyzing template architecture...',
    'Generating component structure...',
    'Building page layouts...',
    'Creating utility functions...',
    'Optimizing for production...',
    'Finalizing project files...',
  ];

  useState(() => {
    const interval = setInterval(() => setPhase((p) => Math.min(p + 1, phases.length - 1)), 340);
    return () => clearInterval(interval);
  });

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-3.5 h-3.5 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
        <span className="text-sm text-zinc-300">{phases[phase]}</span>
      </div>
      <div className="h-1 bg-zinc-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${((phase + 1) / phases.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
