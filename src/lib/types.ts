import type { EstimateFurnitureCostOutput } from "@/ai/flows/real-time-cost-estimation";
import type { SuggestDesignImprovementsOutput } from "@/ai/flows/design-improvement-suggestions";
import type { LucideIcon } from 'lucide-react';

export type FurnitureConfig = {
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: string[];
};

export type Cost = EstimateFurnitureCostOutput;
export type Suggestions = SuggestDesignImprovementsOutput;

export type MaterialOption = {
  id: string;
  name: string;
};

export type FeatureOption = {
  id: string;
  name: string;
  icon: LucideIcon;
};
