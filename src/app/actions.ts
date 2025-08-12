'use server';

import { suggestServices, type SuggestServicesInput } from '@/ai/flows/suggest-services';

export async function getAISuggestions(prompt: string): Promise<string[]> {
  if (!prompt) {
    return [];
  }
  
  try {
    const input: SuggestServicesInput = { prompt };
    const result = await suggestServices(input);
    return result.suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return [];
  }
}
