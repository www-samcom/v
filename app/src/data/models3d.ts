import type { Model3D } from '@/types';

export const PREMIUM_3D_MODELS: Model3D[] = [
  {
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    poster: 'https://modelviewer.dev/assets/poster-astronaut.webp',
    label: 'Astronaut'
  },
  {
    url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    poster: 'https://modelviewer.dev/assets/poster-astronaut.webp',
    label: 'Neil Armstrong'
  },
  {
    url: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    poster: 'https://modelviewer.dev/assets/poster-astronaut.webp',
    label: 'Robot'
  },
  {
    url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    poster: '',
    label: 'Helmet'
  },
];

export const getModelForTemplate = (templateId: string): Model3D => {
  const hash = templateId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return PREMIUM_3D_MODELS[hash % PREMIUM_3D_MODELS.length];
};
