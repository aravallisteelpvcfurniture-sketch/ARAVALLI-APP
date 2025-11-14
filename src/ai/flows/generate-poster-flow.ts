'use server';

/**
 * @fileOverview Generates a poster image from a text prompt.
 *
 * - generatePosterFlow - A function that handles the poster generation.
 * - GeneratePosterOutput - The return type for the generatePosterFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePosterOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated poster image.'),
});
export type GeneratePosterOutput = z.infer<typeof GeneratePosterOutputSchema>;

export const generatePosterFlow = ai.defineFlow(
  {
    name: 'generatePosterFlow',
    inputSchema: z.string(),
    outputSchema: GeneratePosterOutputSchema,
  },
  async (prompt) => {
    // Enhance the prompt for better poster generation
    const enhancedPrompt = `Create a visually stunning, high-quality poster for a festival or occasion. The poster should be vibrant, well-composed, and suitable for sharing. The user's request is: "${prompt}". Focus on a clean design with clear text if any is implied. The style should be modern and celebratory.`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: enhancedPrompt,
      config: {
        // You can adjust parameters like aspect ratio if needed
      }
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
