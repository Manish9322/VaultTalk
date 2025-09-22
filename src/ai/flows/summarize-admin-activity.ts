// Summarize Admin Activity
'use server';
/**
 * @fileOverview Summarizes user activity over the past 24 hours for administrators.
 *
 * - summarizeAdminActivity - A function that returns a summary of user activity.
 * - SummarizeAdminActivityInput - The input type for the summarizeAdminActivity function.
 * - SummarizeAdminActivityOutput - The return type for the summarizeAdminActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAdminActivityInputSchema = z.object({
  activityLog: z
    .string()
    .describe(
      'A log of user activities including timestamps, user IDs, and action descriptions.'
    ),
});
export type SummarizeAdminActivityInput = z.infer<
  typeof SummarizeAdminActivityInputSchema
>;

const SummarizeAdminActivityOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of user activity over the past 24 hours, highlighting any unusual patterns or potential issues.'
    ),
});
export type SummarizeAdminActivityOutput = z.infer<
  typeof SummarizeAdminActivityOutputSchema
>;

export async function summarizeAdminActivity(
  input: SummarizeAdminActivityInput
): Promise<SummarizeAdminActivityOutput> {
  return summarizeAdminActivityFlow(input);
}

const summarizeAdminActivityPrompt = ai.definePrompt({
  name: 'summarizeAdminActivityPrompt',
  input: {schema: SummarizeAdminActivityInputSchema},
  output: {schema: SummarizeAdminActivityOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing user activity logs for system administrators.
  Your goal is to identify any unusual patterns or potential issues that may require attention.
  Focus on summarizing activities from the past 24 hours.

  Here is the activity log:
  {{activityLog}}`,
});

const summarizeAdminActivityFlow = ai.defineFlow(
  {
    name: 'summarizeAdminActivityFlow',
    inputSchema: SummarizeAdminActivityInputSchema,
    outputSchema: SummarizeAdminActivityOutputSchema,
  },
  async input => {
    const {output} = await summarizeAdminActivityPrompt(input);
    return output!;
  }
);
