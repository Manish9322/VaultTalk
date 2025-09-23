// Moderate Content Flow
'use server';
/**
 * @fileOverview An AI flow to detect and redact sensitive information in chat messages.
 *
 * - moderateContent - A function that analyzes message text for sensitive content.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  text: z.string().describe('The chat message text to analyze.'),
});
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  isSensitive: z
    .boolean()
    .describe(
      'Whether or not the message contains sensitive information like API keys, credit card numbers, or passwords.'
    ),
  redactedText: z
    .string()
    .describe(
      'The message text with sensitive information redacted. If not sensitive, this will be the same as the original text.'
    ),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(
  input: ModerateContentInput
): Promise<ModerateContentOutput> {
  return moderateContentFlow(input);
}

const moderateContentPrompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  prompt: `You are a content moderation AI for a secure messaging platform.
  Your task is to analyze the following message for sensitive information.
  Sensitive information includes, but is not limited to:
  - API Keys
  - Credit Card Numbers
  - Social Security Numbers
  - Passwords
  - Private Keys

  If the message contains any such information, set 'isSensitive' to true and return a version of the message with the sensitive information replaced by '[REDACTED]'.
  If the message is clean, set 'isSensitive' to false and return the original message text in 'redactedText'.

  Message to analyze:
  "{{text}}"`,
});

const moderateContentFlow = ai.defineFlow(
  {
    name: 'moderateContentFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async input => {
    const {output} = await moderateContentPrompt(input);
    return output!;
  }
);
