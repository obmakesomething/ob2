import Anthropic from '@anthropic-ai/sdk';
import type { AIAnalysis, GitCommit } from '@/types';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn('Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file.');
}

const client = new Anthropic({
  apiKey: apiKey || 'placeholder',
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

export async function analyzeCommit(commit: GitCommit): Promise<AIAnalysis> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analyze this git commit and extract:
1. Relevant tags (technology, feature area, etc.)
2. Priority level (low/medium/high/urgent)
3. Context description
4. Estimated duration in minutes (if applicable)

Commit:
SHA: ${commit.sha}
Message: ${commit.message}
Author: ${commit.author}
Files changed: ${commit.files_changed.join(', ')}

Respond in JSON format:
{
  "tags": ["tag1", "tag2"],
  "priority": "medium",
  "context": "Brief description",
  "estimated_duration": 30
}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      // Extract JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    // Fallback
    return {
      tags: ['unclassified'],
      priority: 'medium',
      context: commit.message,
    };
  } catch (error) {
    console.error('Error analyzing commit:', error);
    return {
      tags: ['error'],
      priority: 'medium',
      context: commit.message,
    };
  }
}

export async function analyzeTaskInput(input: string): Promise<{
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  context: string;
  project?: string;
  estimated_duration?: number;
}> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analyze this task input and extract:
1. A brief description (1-2 sentences)
2. Priority level (low/medium/high/urgent)
3. Relevant tags (technology, category, etc. - max 5)
4. Context/category (e.g., "Development", "Bug Fix", "Feature", "Documentation")
5. Project name (if identifiable)
6. Estimated duration in minutes

Task input: "${input}"

Respond in JSON format:
{
  "description": "Brief description",
  "priority": "medium",
  "tags": ["tag1", "tag2"],
  "context": "Category",
  "project": "Project name or null",
  "estimated_duration": 30
}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    // Fallback
    return {
      description: input,
      priority: 'medium',
      tags: ['unclassified'],
      context: 'General',
    };
  } catch (error) {
    console.error('Error analyzing task input:', error);
    return {
      description: input,
      priority: 'medium',
      tags: ['error'],
      context: 'General',
    };
  }
}

export async function generateReview(
  tasks: any[],
  period: 'weekly' | 'monthly',
  startDate: string,
  endDate: string
): Promise<{ summary: string; insights: string[] }> {
  try {
    const taskSummary = tasks
      .map(
        (t) =>
          `- ${t.title} (${t.status}, priority: ${t.priority}, tags: ${t.tags.join(', ')})`
      )
      .join('\n');

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Generate a ${period} review for the following tasks completed between ${startDate} and ${endDate}:

${taskSummary}

Provide:
1. A comprehensive summary (2-3 paragraphs)
2. Key insights (3-5 bullet points)

Respond in JSON format:
{
  "summary": "...",
  "insights": ["insight1", "insight2", "insight3"]
}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      summary: 'Review generation failed',
      insights: [],
    };
  } catch (error) {
    console.error('Error generating review:', error);
    return {
      summary: 'Error generating review',
      insights: [],
    };
  }
}
