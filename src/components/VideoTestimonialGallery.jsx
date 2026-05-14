import { useState } from "react";

const TESTIMONIAL_VIDEOS = [
  {
    id: 1,
    title: "Navy Veterans Cody & Frank — GAP Benefit Story",
    youtubeId: "ZKUbVLVpzMw",
    description: "Navy Veterans Cody & Frank received $9,500 in GAP Benefits"
  },
  {
    id: 2,
    title: "Veteran Homebuyer Testimonial",
    youtubeId: "9tw35VOpfJs",
    description: "Hear from a veteran about their experience with Buywiser"
  }
];

export default function VideoTestimonialGallery() {
  const [selectedVideoId, setSelectedVideoId] = useState(TESTIMONIAL_VIDEOS[0].youtubeId);
  
  const selectedVideo = TESTIMONIAL_VIDEOS.find(v => v.youtubeId === selectedVideoId);

  return (
    <div className="space-y-4">
      {/* Main Video Player */}
      <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${selectedVideoId}?enablejsapi=1`}
          title={selectedVideo?.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* Video Title */}
      {selectedVideo && (
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">{selectedVideo.title}</p>
          <p className="text-xs text-slate-400 mt-1">{selectedVideo.description}</p>
        </div>
      )}

      {/* Video Thumbnails Grid */}
      {TESTIMONIAL_VIDEOS.length > 1 && (
        <div className="grid grid-cols-2 gap-3">
          {TESTIMONIAL_VIDEOS.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideoId(video.youtubeId)}
              className={`relative pb-[56.25%] rounded-lg overflow-hidden border-2 transition group ${
                selectedVideoId === video.youtubeId
                  ? "border-blue-600 shadow-lg"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img
                src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                  <span className="text-slate-900 font-bold">▶</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}