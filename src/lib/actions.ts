"use server";

import {
  estimateFurnitureCost,
  EstimateFurnitureCostInput,
} from "@/ai/flows/real-time-cost-estimation";
import {
  suggestDesignImprovements,
  SuggestDesignImprovementsInput,
} from "@/ai/flows/design-improvement-suggestions";

export async function getCost(config: EstimateFurnitureCostInput) {
  try {
    const cost = await estimateFurnitureCost(config);
    return cost;
  } catch (error) {
    console.error("Error getting cost estimation:", error);
    return null;
  }
}

export async function getSuggestions(config: SuggestDesignImprovementsInput) {
  try {
    const suggestions = await suggestDesignImprovements(config);
    return suggestions;
  } catch (error) {
    console.error("Error getting design suggestions:", error);
    return null;
  }
}
