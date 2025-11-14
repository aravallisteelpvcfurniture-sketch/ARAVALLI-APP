'use server';

import {
  estimateFurnitureCost,
  EstimateFurnitureCostInput,
} from '@/ai/flows/real-time-cost-estimation';
import {
  suggestDesignImprovements,
  SuggestDesignImprovementsInput,
} from '@/ai/flows/design-improvement-suggestions';
import { generateTodaysFestivalPosterFlow } from '@/ai/flows/generate-poster-flow';

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

export async function generateTodaysFestivalPoster() {
  try {
    // This flow now intelligently determines the festival and generates a poster.
    const result = await generateTodaysFestivalPosterFlow();
    return result;
  } catch (error) {
    console.error('Error in generateTodaysFestivalPoster action:', error);
    // It's better to re-throw the error to let the client-side catch it
    // and display a user-friendly message.
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    throw new Error(errorMessage);
  }
}
