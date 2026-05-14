export default function VideoTestimonial() {
  return (
    <div style={{ width: "100%", borderRadius: "16px", overflow: "hidden", background: "#000" }}>
      <iframe
        src="https://www.youtube.com/embed/ZKUbVLVpzMw?rel=0&modestbranding=1"
        title="Veteran Testimonial — Cody & Frank"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        width="100%"
        height="315px"
        style={{ border: "none", display: "block" }}
        allowFullScreen
      />
    </div>
  );
}