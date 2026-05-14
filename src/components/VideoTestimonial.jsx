import { useState } from "react";
import { Play } from "lucide-react";

const VIDEO_ID = "ZKUbVLVpzMw";
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;

export default function VideoTestimonial() {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        borderRadius: "16px",
        background: "#000",
      }}
    >
      {!playing ? (
        <>
          <img
            src={THUMBNAIL}
            alt="Veteran Testimonial — Cody & Frank"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => setPlaying(true)}
          />
          <button
            onClick={() => setPlaying(true)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(220, 38, 38, 0.92)",
              border: "3px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
            aria-label="Play video"
          >
            <Play style={{ width: 28, height: 28, color: "white", marginLeft: 4 }} />
          </button>
        </>
      ) : (
        <iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
          title="Veteran Testimonial — Cody & Frank"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}