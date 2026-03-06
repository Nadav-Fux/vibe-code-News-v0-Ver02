export const PLATFORMS = {
  linkedin: {
    name: 'LinkedIn',
    charLimit: 3000,
    color: 'oklch(0.55 0.15 250)',
    icon: 'Linkedin',
    hashtagStyle: 'professional',
  },
  twitter: {
    name: 'X / Twitter',
    charLimit: 280,
    color: 'oklch(0.60 0.02 260)',
    icon: 'Twitter',
    hashtagStyle: 'trending',
  },
  facebook: {
    name: 'Facebook',
    charLimit: 63206,
    color: 'oklch(0.50 0.18 260)',
    icon: 'Facebook',
    hashtagStyle: 'casual',
  },
  tiktok: {
    name: 'TikTok',
    charLimit: 2200,
    color: 'oklch(0.70 0.25 340)',
    icon: 'Music',
    hashtagStyle: 'viral',
  },
  blog: {
    name: 'Blog Post',
    charLimit: 50000,
    color: 'oklch(0.65 0.15 145)',
    icon: 'FileText',
    hashtagStyle: 'seo',
  },
  newsletter: {
    name: 'Newsletter',
    charLimit: 10000,
    color: 'oklch(0.65 0.18 60)',
    icon: 'Mail',
    hashtagStyle: 'minimal',
  },
} as const;

export type PlatformKey = keyof typeof PLATFORMS;

export type PlatformConfig = (typeof PLATFORMS)[PlatformKey];

/**
 * Builds a platform-specific system prompt for content generation.
 *
 * @param platform  - Target social/content platform
 * @param topic     - The subject the user wants content about
 * @param tone      - Writing tone (professional, creative, casual, etc.)
 * @param depth     - Content depth (brief, medium, deep)
 * @param sourceContext - Optional reference material to incorporate
 * @returns A fully-formed prompt string ready for the LLM
 */
export function getPromptForPlatform(
  platform: PlatformKey,
  topic: string,
  tone: string,
  depth: string,
  sourceContext?: string,
): string {
  const platformConfig = PLATFORMS[platform];

  const basePrompt = `Create content for ${platformConfig.name} about: "${topic}".
Tone: ${tone}. Depth: ${depth}.
Character limit: ${platformConfig.charLimit} characters maximum.`;

  const sourceSection = sourceContext
    ? `\n\nUse the following source material as reference:\n${sourceContext}`
    : '';

  const platformSpecific: Record<PlatformKey, string> = {
    linkedin: `${basePrompt}
Write a professional LinkedIn post. Include 3-5 relevant hashtags at the end. Use line breaks for readability. Start with a hook. End with a call to action.${sourceSection}`,

    twitter: `${basePrompt}
Write a concise tweet (max 280 chars). Make it punchy and shareable. Include 1-2 hashtags. If the content needs more space, format as a thread with numbered tweets.${sourceSection}`,

    facebook: `${basePrompt}
Write an engaging Facebook post. Use a conversational, friendly tone. Include emojis sparingly. Add a question to encourage comments.${sourceSection}`,

    tiktok: `${basePrompt}
Write a TikTok video script with timestamps. Format:
[0:00-0:03] Hook - grab attention
[0:03-0:15] Setup - context
[0:15-0:45] Main content
[0:45-0:60] CTA
Include trending hashtags.${sourceSection}`,

    blog: `${basePrompt}
Write a comprehensive blog article. Include:
- Engaging title
- Introduction with hook
- 3-5 main sections with ## headings
- Examples and data points
- Conclusion with key takeaways
- SEO-friendly structure${sourceSection}`,

    newsletter: `${basePrompt}
Write a newsletter email. Include:
- Subject line (compelling, under 60 chars)
- Preview text (under 90 chars)
- Opening greeting
- 2-3 key sections
- Clear CTA button text
- Friendly sign-off${sourceSection}`,
  };

  return platformSpecific[platform];
}
