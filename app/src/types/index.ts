export interface TemplatePreview {
  style: 'dark' | 'light';
  headline: string;
  sub: string;
  colors: {
    bg: string;
    c1: string;
    c2: string;
    c3: string;
  };
}

export interface TemplatePalette {
  bg: string;
  accent: string;
  accent2: string;
  text: string;
}

export interface Model3D {
  url: string;
  poster: string;
  label: string;
}

export interface Template {
  id: string;
  category: string;
  name: string;
  tagline: string;
  badge: string;
  badgeType: string;
  plan: 'free' | 'pro' | 'premium';
  tags: string[];
  palette: TemplatePalette;
  preview: TemplatePreview;
  description: string;
  features: string[];
  tier?: 'starter' | 'pro' | 'premium';
  image?: string;
  model3D?: Model3D;
  disabled?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  count: number;
}

export interface TierConfig {
  id: string;
  label: string;
  description: string;
  color: string;
  glow: string;
  icon: string;
  requiredPlan: string;
}

export interface PlanFeature {
  label: string;
  ok: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  badge: string;
  color: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  popular: boolean;
}

export interface Toast {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'info' | 'warn';
}

export interface GeneratedFiles {
  [path: string]: string;
}

export interface GeneratedProject {
  template: Template;
  files: GeneratedFiles;
}
