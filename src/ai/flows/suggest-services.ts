'use server';
/**
 * @fileOverview Provides service suggestions based on a text prompt.
 *
 * - suggestServices - A function that suggests car wash services based on a text prompt.
 * - SuggestServicesInput - The input type for the suggestServices function.
 * - SuggestServicesOutput - The return type for the suggestServices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestServicesInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the customer request.'),
});
export type SuggestServicesInput = z.infer<typeof SuggestServicesInputSchema>;

const SuggestServicesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested car wash services.'),
});
export type SuggestServicesOutput = z.infer<typeof SuggestServicesOutputSchema>;

export async function suggestServices(input: SuggestServicesInput): Promise<SuggestServicesOutput> {
  return suggestServicesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestServicesPrompt',
  input: {schema: SuggestServicesInputSchema},
  output: {schema: SuggestServicesOutputSchema},
  prompt: `You are a helpful car wash service assistant. Based on the customer request, suggest relevant car wash services.

Request: {{{prompt}}}

Output the suggestions as a JSON array of strings.

Example:
["Whole Wash", "Inside Only", "Spray Only"]`,
});

const suggestServicesFlow = ai.defineFlow(
  {
    name: 'suggestServicesFlow',
    inputSchema: SuggestServicesInputSchema,
    outputSchema: SuggestServicesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
