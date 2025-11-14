'use server';

/**
 * @fileOverview Generates a poster for a given text prompt.
 *
 * - generatePosterFlow - A flow that generates a poster from a text prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePosterInputSchema = z.object({
    prompt: z.string().describe('A descriptive prompt for the poster to be generated.'),
});
export type GeneratePosterInput = z.infer<typeof GeneratePosterInputSchema>;

const GeneratePosterOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated poster image.'),
});
export type GeneratePosterOutput = z.infer<typeof GeneratePosterOutputSchema>;


export const generatePosterFlow = ai.defineFlow(
  {
    name: 'generatePosterFlow',
    inputSchema: GeneratePosterInputSchema,
    outputSchema: GeneratePosterOutputSchema,
  },
  async ({ prompt }) => {

    const imagePrompt = `Create a beautiful, vibrant, and high-quality festival poster. The poster should be celebratory and visually appealing, with a modern design. The theme is: "${prompt}". Do not include any text unless specifically asked to.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
