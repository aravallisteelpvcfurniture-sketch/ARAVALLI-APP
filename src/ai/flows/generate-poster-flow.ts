'use server';

/**
 * @fileOverview Generates a poster for the next upcoming major Hindu festival.
 *
 * - generateTodaysFestivalPosterFlow - A flow that determines the next festival and generates a poster for it.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the output schema for the entire flow
const FestivalPosterOutputSchema = z.object({
  festivalName: z.string().describe('The name of the festival detected.'),
  imageUrl: z.string().describe('The data URI of the generated poster image.'),
});

// Define the output schema for the festival detection prompt
const FestivalNameOutputSchema = z.object({
  festivalName: z.string().describe("The name of the next major upcoming Hindu festival. Example: 'Diwali', 'Holi', 'Navratri'."),
});

// 1. Define a prompt to determine the next festival
const detectFestivalPrompt = ai.definePrompt({
  name: 'detectFestivalPrompt',
  output: { schema: FestivalNameOutputSchema },
  prompt: `Based on today's date, what is the next major upcoming Hindu festival? Provide only the name of the festival.`,
});

// 2. Define the main flow
export const generateTodaysFestivalPosterFlow = ai.defineFlow(
  {
    name: 'generateTodaysFestivalPosterFlow',
    outputSchema: FestivalPosterOutputSchema,
  },
  async () => {
    // Step 1: Call the LLM to determine the festival name
    const { output: festivalOutput } = await detectFestivalPrompt();
    if (!festivalOutput?.festivalName) {
      throw new Error('Could not determine the next festival.');
    }
    const festivalName = festivalOutput.festivalName;

    // Step 2: Use the festival name to generate an image
    const imagePrompt = `Create a beautiful, vibrant, and high-quality festival poster for ${festivalName}. The poster should be celebratory and visually appealing, with a modern design. Include text that says "Happy ${festivalName}!".`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: imagePrompt,
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    // Step 3: Return the festival name and the image URL
    return {
      festivalName: festivalName,
      imageUrl: media.url,
    };
  }
);
