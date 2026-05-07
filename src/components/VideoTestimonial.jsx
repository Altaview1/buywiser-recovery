import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function VideoTestimonial() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setIsPlaying(false), 120000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  if (isPlaying) {
    return (
      <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-black w-full relative" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src="https://drive.google.com/file/d/146aNUL6nGwMmZcsSVwsFEtShqigNH9VG/preview"
          title="Cody & Frank Testimonial"
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="relative block w-full group cursor-pointer rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-black hover:shadow-xl transition-shadow"
    >
      <img
        src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/b15e55a9b_codiandfrank.png"
        alt="Cody & Frank Testimonial"
        className="w-full h-auto block"
      />
      {/* Blur patch over last name "Cohen" in thumbnail */}
      <div className="absolute rounded" style={{ bottom: "8%", left: "2%", width: "30%", height: "18%", backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.45)" }} />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white transition-colors flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>
    </button>
  );
}