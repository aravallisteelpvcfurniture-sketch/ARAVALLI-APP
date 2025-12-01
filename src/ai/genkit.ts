import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {googleCloudStorage} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [googleAI(), googleCloudStorage()],
  model: 'googleai/gemini-2.5-flash',
});
