'use server';

/**
 * @fileOverview Suggests design improvements based on the current furniture customization selections.
 *
 * - suggestDesignImprovements - A function that handles the suggestion of design improvements.
 * - SuggestDesignImprovementsInput - The input type for the suggestDesignImprovements function.
 * - SuggestDesignImprovementsOutput - The return type for the suggestDesignImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDesignImprovementsInputSchema = z.object({
  material: z.string().describe('The material selected for the furniture.'),
  dimensions: z
    .object({
      length: z.number().describe('The length of the furniture.'),
      width: z.number().describe('The width of the furniture.'),
      height: z.number().describe('The height of the furniture.'),
    })
    .describe('The dimensions of the furniture.'),
  features: z
    .array(z.string())
    .describe('The features included in the furniture design (e.g., drawers, shelves, doors).'),
});
export type SuggestDesignImprovementsInput = z.infer<typeof SuggestDesignImprovementsInputSchema>;

const SuggestDesignImprovementsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of design improvement suggestions.'),
  reasoning: z.string().describe('The reasoning behind the design improvement suggestions.'),
});
export type SuggestDesignImprovementsOutput = z.infer<typeof SuggestDesignImprovementsOutputSchema>;

export async function suggestDesignImprovements(
  input: SuggestDesignImprovementsInput
): Promise<SuggestDesignImprovementsOutput> {
  return suggestDesignImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDesignImprovementsPrompt',
  input: {schema: SuggestDesignImprovementsInputSchema},
  output: {schema: SuggestDesignImprovementsOutputSchema},
  prompt: `You are an AI assistant that provides design improvement suggestions for furniture.

  Based on the current furniture customization selections, provide design improvements to optimize the design for aesthetics, structural integrity, or cost-effectiveness.

Current Customization:
Material: {{{material}}}
Dimensions: Length: {{{dimensions.length}}}, Width: {{{dimensions.width}}}, Height: {{{dimensions.height}}}
Features: {{#each features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide suggestions and the reasoning behind them.

Output should contain an array of suggestions and a reasoning field.`,
});

const suggestDesignImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestDesignImprovementsFlow',
    inputSchema: SuggestDesignImprovementsInputSchema,
    outputSchema: SuggestDesignImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
