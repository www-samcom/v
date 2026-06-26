import { Icon } from './Icon';
import { TIERS, canAccessTier } from '@/data';
import type { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  onSelect: (t: Template) => void;
  userPlan: string;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export function TemplateCard({ template, onSelect, userPlan, hovered, onHover, onLeave }: TemplateCardProps) {
  const tier = template.tier || 'starter';
  const tierConfig = TIERS[tier];
  const locked = !canAccessTier(userPlan, tier);
  const isPremium = tier === 'premium';

  return (
    <div
      className={`group relative bg-zinc-800/40 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isPremium
          ? 'border-amber-500/30 shadow-lg shadow-amber-500/5 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10'
          : 'border-zinc-700/30 hover:border-zinc-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30'
      } ${locked ? 'opacity-80' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => !locked && onSelect(template)}
    >
      {/* Premium crown badge */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-[10px] font-extrabold text-black uppercase tracking-wider shadow-lg shadow-amber-500/40 animate-bounce-slow">
          <Icon name="crown" size={10} />
          Premium
        </div>
      )}

      {/* Preview Area */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {isPremium && template.model3D ? (
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-amber-500/5 via-transparent to-transparent">
            <model-viewer
              src={template.model3D.url}
              poster={template.model3D.poster}
              alt={`3D ${template.model3D.label}`}
              auto-rotate
              auto-rotate-delay="0"
              rotation-per-second="20deg"
              camera-controls
              disable-zoom
              interaction-prompt="none"
              shadow-intensity="1"
              exposure="0.9"
              class="w-full h-full"
              style={{ background: 'transparent' }}
            />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(245,158,11,0.12)_100%)]" />
          </div>
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${template.id}/800/500`;
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, transparent 50%, ${template.palette.bg}cc)`,
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, ${tierConfig.color}, ${template.palette.accent})`,
              }}
            />
          </div>
        )}

        {/* Lock overlay */}
        {locked && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-2.5 backdrop-blur-md z-10 ${
              isPremium ? 'bg-[radial-gradient(ellipse_at_center,rgba(45,30,5,0.85),rgba(7,7,10,0.92))]' : 'bg-[#07070a]/78'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isPremium
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/40'
                  : 'bg-zinc-800'
              }`}
            >
              <Icon name="lock" size={20} className={isPremium ? 'text-black' : 'text-zinc-400'} />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-white mb-0.5">{tierConfig.label} Tier</div>
              <div className="text-xs text-zinc-400">
                Upgrade to {tier === 'pro' ? 'Pro' : 'Premium'} to unlock
              </div>
            </div>
          </div>
        )}

        {/* Hover CTA */}
        {hovered && !locked && (
          <div className="absolute inset-0 z-10 flex items-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all">
              <Icon name="eye" size={12} /> Use This Template
            </button>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-1.5 mb-1">
              <span className="text-sm font-bold">{template.name}</span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  tier === 'premium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : tier === 'pro'
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {tier === 'premium' && <Icon name="crown" size={9} />}
                {tier === 'pro' && <Icon name="layers" size={9} />}
                {tier === 'starter' && <Icon name="zap" size={9} />}
                {tierConfig.label}
              </span>
            </div>
            <div className="text-xs text-zinc-400 leading-snug">{template.tagline}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-700/40 text-zinc-400 border border-zinc-700/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
