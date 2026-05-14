export default function VideoTestimonial() {
  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden" }}>
      <iframe
        src="https://www.youtube.com/embed/ZKUbVLVpzMw"
        title="Veteran Testimonial — Cody & Frank"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        width="100%"
        height="500px"
        style={{ border: "none", display: "block" }}
      />
    </div>
  );
}