import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getUserId(
  ctx: QueryCtx | MutationCtx,
): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

export function missingEnvVariableUrl(envVarName: string, whereToGet: string) {
  const deployment = deploymentName();
  if (!deployment) return `Missing ${envVarName} in environment variables.`;
  return (
    `\n  Missing ${envVarName} in environment variables.\n\n` +
    `  Get it from ${whereToGet} .\n  Paste it on the Convex dashboard:\n` +
    `  https://dashboard.convex.dev/d/${deployment}/settings?var=${envVarName}`
  );
}

export function deploymentName() {
  const url = process.env.CONVEX_CLOUD_URL;
  if (!url) return undefined;
  const regex = new RegExp("https://(.+).convex.cloud");
  return regex.exec(url)?.[1];
}

export async function fetchYouTubeFeed(apiKey: string, channelId?: string): Promise<any[]> {
  // For now, return mock data
  // In production, implement actual YouTube API calls
  return [
    {
      id: "mock-video-1",
      title: "Sample YouTube Video 1",
      description: "This is a sample video description",
      thumbnailUrl: "https://via.placeholder.com/640x360",
      channelTitle: "Sample Channel",
      publishedAt: new Date().toISOString()
    },
    {
      id: "mock-video-2",
      title: "Sample YouTube Video 2",
      description: "Another sample video description",
      thumbnailUrl: "https://via.placeholder.com/640x360",
      channelTitle: "Sample Channel",
      publishedAt: new Date().toISOString()
    }
  ];
}

export function getYouTubeApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error(missingEnvVariableUrl("YOUTUBE_API_KEY", "Google Cloud Console"));
  }
  return apiKey;
}
