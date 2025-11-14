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
  generatePosterFlow,
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

export async function generatePoster(
  prompt: string
): Promise<GeneratePosterOutput | null> {
  try {
    // The input to the flow is an object, not just a string
    const result = await generatePosterFlow({ prompt });
    return result;
  } catch (error) {
    console.error('Error generating poster in action:', error);
    // You might want to cast the error to get more details
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error(`Full Error: ${errorMessage}`);
    return null;
  }
}
