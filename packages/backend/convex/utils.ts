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
  try {
    // If no channel ID is provided, we can search for videos from the authenticated user's channel
    // or use a default approach. For now, let's search for popular programming-related videos
    const searchUrl = channelId 
      ? `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`
      : `https://www.googleapis.com/youtube/v3/search?part=snippet&q=programming&maxResults=10&order=date&type=video&key=${apiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchData.error?.message || 'Unknown error'}`);
    }

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Get video details for better metadata
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`;
    
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    
    if (!videosResponse.ok) {
      throw new Error(`YouTube API error: ${videosData.error?.message || 'Unknown error'}`);
    }

    return videosData.items.map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt
    }));
  } catch (error) {
    console.error('Error fetching YouTube feed:', error);
    // Fallback to mock data if API call fails
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
}

export function getYouTubeApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error(missingEnvVariableUrl("YOUTUBE_API_KEY", "Google Cloud Console"));
  }
  return apiKey;
}
