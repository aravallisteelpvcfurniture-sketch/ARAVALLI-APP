'use server';

/**
 * @fileOverview Generates a poster based on the current day's festival or a generic greeting.
 *
 * - generateDailyPosterFlow - A flow that determines the day's occasion and generates a poster.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePosterOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated poster image.'),
});
export type GeneratePosterOutput = z.infer<typeof GeneratePosterOutputSchema>;

const determineOccasionPrompt = ai.definePrompt({
  name: 'determineOccasionPrompt',
  system:
    "You are an expert on Indian festivals and important global events. Your task is to determine the occasion for today's date. Today's date is: " +
    new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) +
    '. First, check if there is a major Indian festival today (like Diwali, Holi, Eid, Navratri, etc.). If yes, respond with the name of the festival (e.g., "Happy Diwali"). If not, check if it is a major internationally recognized day (e.g., "World Environment Day"). If yes, respond with that occasion. If it is a normal day, respond with either "Good Morning" or a short, positive "Subh Vichar" (Good Thought) like "Inspirational Quote" or "Positive Affirmation". Respond with ONLY the name of the occasion and nothing else.',
  output: {
    schema: z.string(),
  },
});

export const generateDailyPosterFlow = ai.defineFlow(
  {
    name: 'generateDailyPosterFlow',
    outputSchema: GeneratePosterOutputSchema,
  },
  async () => {
    // Step 1: Determine the occasion for today.
    const occasionResponse = await determineOccasionPrompt();
    const occasion = occasionResponse.text;

    // Step 2: Create a descriptive prompt for the image generation model.
    const imagePrompt = `Create a beautiful, vibrant, and high-quality poster. The poster should be visually appealing, with a modern design reflecting Indian culture. The theme is: "${occasion}". Do not include any text unless it's integral to the cultural symbol or if the theme is a quote. The image should be visually rich and artistic.`;

    // Step 3: Generate the image.
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

    // Step 4: Return the image URL.
    return {
      imageUrl: media.url,
    };
  }
);
