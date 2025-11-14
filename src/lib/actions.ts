'use server';

import {
  estimateFurnitureCost,
  EstimateFurnitureCostInput,
} from '@/ai/flows/real-time-cost-estimation';
import {
  suggestDesignImprovements,
  SuggestDesignImprovementsInput,
} from '@/ai/flows/design-improvement-suggestions';
import {
  generateDailyPosterFlow,
  GeneratePosterOutput,
} from '@/ai/flows/generate-poster-flow';

export async function getCost(config: EstimateFurnitureCostInput) {
  try {
    const cost = await estimateFurnitureCost(config);
    return cost;
  } catch (error) {
    console.error('Error getting cost estimation:', error);
    return null;
  }
}

export async function getSuggestions(config: SuggestDesignImprovementsInput) {
  try {
    const suggestions = await suggestDesignImprovements(config);
    return suggestions;
  } catch (error) {
    console.error('Error getting design suggestions:', error);
    return null;
  }
}

export async function generateTodaysFestivalPoster(): Promise<GeneratePosterOutput> {
  try {
    const result = await generateDailyPosterFlow();
    return result;
  } catch (error) {
    console.error('Error in generateTodaysFestivalPoster action:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error(`Full Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}
