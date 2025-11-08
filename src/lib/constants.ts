import type { MaterialOption, FeatureOption, FurnitureConfig } from './types';
import { DoorOpen, Layers, PanelBottom } from 'lucide-react';

export const MATERIALS: MaterialOption[] = [
  { id: 'steel', name: 'Steel' },
  { id: 'pvc', name: 'PVC' },
  { id: 'wood', name: 'Wood' },
];

export const FEATURES: FeatureOption[] = [
  { id: 'drawers', name: 'Drawers', icon: PanelBottom },
  { id: 'shelves', name: 'Shelves', icon: Layers },
  { id: 'doors', name: 'Doors', icon: DoorOpen },
];

export const DEFAULT_CONFIG: FurnitureConfig = {
  material: 'steel',
  dimensions: {
    length: 120,
    width: 60,
    height: 75,
  },
  features: ['drawers'],
};
