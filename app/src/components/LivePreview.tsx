import { useRef, useEffect, useCallback, useState } from 'react';
import type { Template } from '@/types';

interface LivePreviewProps {
  template: Template;
}

/* ─── Canvas Animation Hook ─── */
function useCanvasAnimation(drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    let raf: number;
    let last = 0;
    let time = 0;

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);

    const loop = (ts: number) => {
      if (!running) return;
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      time += dt;
      const rect = canvas.getBoundingClientRect();
      drawFn(ctx, rect.width, rect.height, time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [drawFn]);

  return canvasRef;
}

/* ─── Particle Field ─── */
function ParticleField({ color, count = 40, speed = 0.5 }: { color: string; count?: number; speed?: number }) {
  const drawFn = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < count; i++) {
      const x = (Math.sin(t * speed + i * 1.3) * 0.5 + 0.5) * w;
      const y = ((t * speed * 22 + i * (h / count)) % h);
      const size = Math.sin(t * 1.5 + i) * 2 + 3;
      const alpha = Math.sin(t * 2 + i) * 0.3 + 0.55;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [color, count, speed]);

  const canvasRef = useCanvasAnimation(drawFn);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── Rotating 3D Object (CSS) ─── */
function Rotating3DObject({ type, color, accent }: { type: string; color: string; accent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const rot = { x: 15, y: 0 };
    const tick = () => {
      rot.y += 0.5;
      rot.x += 0.2;
      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (type === 'cube') {
    const faces = [
      'rotateY(0deg) translateZ(70px)',
      'rotateY(90deg) translateZ(70px)',
      'rotateY(180deg) translateZ(70px)',
      'rotateY(-90deg) translateZ(70px)',
      'rotateX(90deg) translateZ(70px)',
      'rotateX(-90deg) translateZ(70px)',
    ];
    return (
      <div className="mx-auto" style={{ perspective: '800px', width: 140, height: 140 }}>
        <div ref={containerRef} className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
          {faces.map((f, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center text-3xl text-white/90"
              style={{
                width: 140, height: 140,
                background: `linear-gradient(135deg, ${color}99, ${accent}55)`,
                border: `1px solid ${accent}88`,
                boxShadow: `inset 0 0 20px ${color}22`,
                transform: f,
              }}
            >⬡</div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'sphere') {
    return (
      <div className="mx-auto relative" style={{ width: 180, height: 180 }}>
        <div
          ref={containerRef}
          className="absolute rounded-full"
          style={{
            width: 160, height: 160, top: 10, left: 10,
            background: `radial-gradient(circle at 35% 30%, ${accent}, ${color} 65%, ${color}22)`,
            boxShadow: `0 0 50px ${accent}66, 0 0 100px ${color}22`,
          }}
        />
      </div>
    );
  }

  if (type === 'crystal') {
    const faces = [0, 60, 120, 180, 240, 300];
    return (
      <div className="mx-auto relative" style={{ perspective: '900px', width: 160, height: 180 }}>
        <div className="absolute left-1/2 top-1/2" style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}>
          <div ref={containerRef} style={{ transformStyle: 'preserve-3d' }}>
            {faces.map((deg) => (
              <div
                key={deg}
                className="absolute opacity-75"
                style={{
                  width: 60, height: 140, left: -30, top: -70,
                  background: `linear-gradient(180deg, ${color}cc, ${accent}cc, ${color}66)`,
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  transform: `rotateY(${deg}deg) translateZ(32px)`,
                  filter: `drop-shadow(0 0 8px ${accent})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ perspective: '800px', width: 160, height: 160 }}>
      <div
        ref={containerRef}
        className="rounded-full"
        style={{
          width: 160, height: 160,
          border: `28px solid ${accent}`,
          boxShadow: `0 0 40px ${accent}55, 0 0 80px ${color}22`,
        }}
      />
    </div>
  );
}

/* ─── Preview Components ─── */
function DeveloperPreview({ template }: { template: Template }) {
  const c = template.preview.colors;
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full overflow-hidden font-mono" style={{ background: c.bg }}>
      <ParticleField color={c.c1} />
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 p-2 rounded-md mb-4 bg-black/70 border" style={{ borderColor: `${c.c1}30` }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] block" />
          <span className="text-[10px] ml-2 opacity-80" style={{ color: c.c1 }}>
            ~ {template.name.toLowerCase().replace(/\s/g, '_')} — zsh
          </span>
        </div>
        <div className="flex-1 flex items-center gap-8">
          <div className="flex-1">
            <div className="text-[10px] mb-2 opacity-70" style={{ color: c.c1 }}>
              {'>'} init {template.name.toLowerCase()}.sh{cursor ? '█' : ' '}
            </div>
            <div className="text-2xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span style={{ color: c.c1 }}>const</span> engineer={'{'}
              <div className="pl-5 text-lg" style={{ color: '#86efac' }}>
                name: <span style={{ color: '#fbbf24' }}>&quot;{template.preview.headline}&quot;</span>
              </div>
              {'}'}
            </div>
            <p className="text-[11px] text-white/40 mb-3 max-w-[280px]">{template.preview.sub}</p>
            <div className="flex flex-wrap gap-1.5">
              {template.tags.slice(0, 4).map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: `${c.c1}18`, color: c.c1, border: `1px solid ${c.c1}40` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <Rotating3DObject type="cube" color={c.c1} accent={c.c2} />
        </div>
      </div>
    </div>
  );
}

function LuxuryPreview({ template }: { template: Template }) {
  const c = template.preview.colors;
  return (
    <div className="relative h-full overflow-hidden" style={{ background: c.bg }}>
      <ParticleField color={c.c1} count={20} speed={0.15} />
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[70px] pointer-events-none" style={{ background: `radial-gradient(circle, ${c.c1}20, transparent 65%)` }} />
      <div className="relative z-10 p-10 h-full flex items-center gap-10">
        <div className="flex-1">
          <div className="text-[9px] font-bold tracking-[0.35em] mb-4" style={{ color: c.c1, fontFamily: 'Space Grotesk, sans-serif' }}>
            ◆ {template.tagline.toUpperCase().split(' ').slice(0, 3).join(' ')} ◆
          </div>
          <h1 className="text-4xl font-light text-white mb-4 leading-[1.05] tracking-tight" style={{ fontFamily: 'Syne, serif' }}>
            {template.preview.headline.split(' ').map((w, i) => (
              <span key={i} className="block" style={{ color: i % 3 === 1 ? c.c1 : '#fff', fontStyle: i % 3 === 1 ? 'italic' : 'normal' }}>
                {w}
              </span>
            ))}
          </h1>
          <p className="text-xs text-white/40 max-w-[240px] leading-relaxed mb-7">{template.preview.sub}</p>
          <div className="inline-flex px-5 py-2.5 text-[10px] font-bold tracking-[0.22em] cursor-pointer border" style={{ borderColor: c.c1, color: c.c1, fontFamily: 'Space Grotesk, sans-serif' }}>
            DISCOVER →
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Rotating3DObject type="sphere" color={c.c1} accent={c.c2} />
        </div>
      </div>
    </div>
  );
}

function AIPreview({ template }: { template: Template }) {
  const c = template.preview.colors;
  return (
    <div className="relative h-full overflow-hidden flex items-center justify-center" style={{ background: c.bg }}>
      <ParticleField color={c.c1} count={30} speed={0.3} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, transparent 25%, ${c.bg} 75%)` }} />
      <div className="relative z-10 text-center p-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mb-5 border" style={{ background: `${c.c1}12`, borderColor: `${c.c1}38`, color: c.c1 }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse block" style={{ background: c.c1 }} />
          {template.tags[0].toUpperCase()} · LIVE
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 max-w-md" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.1 }}>
          {template.preview.headline.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] bg-clip-text text-transparent" style={{ '--c1': c.c1, '--c2': c.c2 } as React.CSSProperties}>
            {template.preview.headline.split(' ').slice(-1)[0]}
          </span>
        </h1>
        <p className="text-sm text-white/40 max-w-sm mb-6 mx-auto">{template.preview.sub}</p>
        <div className="flex justify-center gap-7 mb-5">
          {[
            { v: '99.8%', l: 'ACCURACY' },
            { v: '<10ms', l: 'LATENCY' },
            { v: '∞', l: 'SCALE' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-lg font-bold" style={{ color: c.c1, fontFamily: 'JetBrains Mono, monospace' }}>{s.v}</div>
              <div className="text-[8px] text-white/30 tracking-[0.2em] mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="inline-block px-6 py-2.5 text-xs font-bold rounded-lg cursor-pointer" style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`, color: '#000', boxShadow: `0 0 24px ${c.c1}55`, fontFamily: 'Space Grotesk, sans-serif' }}>
          Try the Demo →
        </div>
      </div>
    </div>
  );
}

function GenericPreview({ template }: { template: Template }) {
  const c = template.preview.colors;
  const isDark = template.preview.style === 'dark';
  return (
    <div className="relative h-full overflow-hidden" style={{ background: c.bg }}>
      <ParticleField color={c.c1} count={18} speed={0.2} />
      <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full blur-[60px] pointer-events-none" style={{ background: `radial-gradient(circle, ${c.c1}22, transparent 65%)` }} />
      <div className="relative z-10 p-8 h-full flex items-center gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold mb-4 border" style={{ background: `${c.c1}12`, borderColor: `${c.c1}38`, color: c.c1 }}>
            <span className="w-1 h-1 rounded-full block" style={{ background: c.c1 }} />
            {template.tags[0]}
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: isDark ? '#fff' : '#0a0a14', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.1 }}>
            {template.preview.headline.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] bg-clip-text text-transparent" style={{ '--c1': c.c1, '--c2': c.c2 } as React.CSSProperties}>
              {template.preview.headline.split(' ').slice(-1)[0]}
            </span>
          </h1>
          <p className="text-xs leading-relaxed mb-5 max-w-sm" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>
            {template.preview.sub}
          </p>
          <div className="flex gap-2">
            <div className="inline-block px-5 py-2.5 text-xs font-bold rounded-lg cursor-pointer" style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`, color: '#fff', boxShadow: `0 4px 18px ${c.c1}44` }}>
              Get Started →
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Rotating3DObject type="sphere" color={c.c1} accent={c.c2} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main LivePreview Component ─── */
export function LivePreview({ template }: LivePreviewProps) {
  if (!template) return null;

  const renderPreview = () => {
    const cat = template.category;
    if (cat === 'developer') return <DeveloperPreview template={template} />;
    if (cat === 'luxury') return <LuxuryPreview template={template} />;
    if (cat === 'ai_startup') return <AIPreview template={template} />;
    return <GenericPreview template={template} />;
  };

  const slug = template.name.toLowerCase().replace(/\s+/g, '') + '.io';

  return (
    <div className="h-full rounded-2xl overflow-hidden border border-zinc-700/30 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-zinc-800/60 border-b border-zinc-700/30">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <div className="flex-1 bg-zinc-700/40 rounded px-3 py-1 text-[11px] text-zinc-500 font-mono truncate">
          {slug}
        </div>
        <span
          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ml-auto ${
            template.tier === 'premium'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : template.tier === 'pro'
              ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {template.tier === 'premium' ? '★ PREMIUM' : template.tier === 'pro' ? 'PRO' : 'STARTER'}
        </span>
      </div>
      <div className="h-[calc(100%-44px)] relative overflow-hidden">
        {renderPreview()}
      </div>
    </div>
  );
}


