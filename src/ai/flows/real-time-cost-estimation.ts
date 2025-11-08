'use server';

/**
 * @fileOverview Provides real-time cost estimation for furniture based on selected materials and dimensions.
 *
 * - estimateFurnitureCost - A function that estimates the cost of the furniture.
 * - EstimateFurnitureCostInput - The input type for the estimateFurnitureCost function.
 * - EstimateFurnitureCostOutput - The return type for the estimateFurnitureCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateFurnitureCostInputSchema = z.object({
  material: z.string().describe('The type of material selected for the furniture (e.g., steel, PVC).'),
  dimensions: z
    .object({
      length: z.number().describe('The length of the furniture in centimeters.'),
      width: z.number().describe('The width of the furniture in centimeters.'),
      height: z.number().describe('The height of the furniture in centimeters.'),
    })
    .describe('The dimensions of the furniture.'),
  features: z
    .array(z.string())
    .optional()
    .describe('Additional features included in the furniture (e.g., drawers, shelves, doors).'),
});
export type EstimateFurnitureCostInput = z.infer<typeof EstimateFurnitureCostInputSchema>;

const EstimateFurnitureCostOutputSchema = z.object({
  estimatedCost: z.number().describe('The estimated cost of the furniture in USD.'),
  currency: z.string().describe('The currency of the estimated cost (USD).'),
  breakdown: z
    .record(z.string(), z.number())
    .optional()
    .describe('A detailed breakdown of the cost estimation, including material, labor, and features costs.'),
});
export type EstimateFurnitureCostOutput = z.infer<typeof EstimateFurnitureCostOutputSchema>;

export async function estimateFurnitureCost(input: EstimateFurnitureCostInput): Promise<EstimateFurnitureCostOutput> {
  return estimateFurnitureCostFlow(input);
}

const estimateCostPrompt = ai.definePrompt({
  name: 'estimateCostPrompt',
  input: {schema: EstimateFurnitureCostInputSchema},
  output: {schema: EstimateFurnitureCostOutputSchema},
  prompt: `You are an expert furniture cost estimator.

You will receive the material, dimensions, and features of the furniture. Estimate the cost of the furniture based on real-time material pricing and availability.

Material: {{{material}}}
Dimensions: Length: {{{dimensions.length}}} cm, Width: {{{dimensions.width}}} cm, Height: {{{dimensions.height}}} cm
Features: {{#if features}}{{#each features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

Consider the current market rates for materials and labor.

Output the estimated cost in USD and include a breakdown of the costs if possible.`,
});

const estimateFurnitureCostFlow = ai.defineFlow(
  {
    name: 'estimateFurnitureCostFlow',
    inputSchema: EstimateFurnitureCostInputSchema,
    outputSchema: EstimateFurnitureCostOutputSchema,
  },
  async input => {
    const {output} = await estimateCostPrompt(input);
    return output!;
  }
);
