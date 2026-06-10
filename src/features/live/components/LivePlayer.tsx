import React from "react";

interface LivePlayerProps {
  youtubeUrl: string;
}

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  // If already embed URL
  if (url.includes("youtube.com/embed/")) {
    // Make sure we append autoplay and mute so it can autoplay if possible, or just standard parameters
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has("autoplay")) urlObj.searchParams.set("autoplay", "1");
    return urlObj.toString();
  }
  
  let videoId = "";
  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  } else {
    // Sometimes it's /live/VIDEO_ID
    const liveMatch = url.match(/youtube\.com\/live\/([\w-]+)/);
    if (liveMatch) videoId = liveMatch[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  
  return null;
}

export default function LivePlayer({ youtubeUrl }: LivePlayerProps) {
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-3xl flex items-center justify-center border-2 border-slate-100">
        <p className="text-slate-400 font-medium">URL de YouTube no válida</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-lg border-2 border-violet-100 relative">
      <iframe
        src={embedUrl}
        title="Live Stream"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
