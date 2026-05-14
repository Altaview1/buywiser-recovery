export default function VideoTestimonial() {
  return (
    <div style={{ width: "100%", borderRadius: "16px", overflow: "hidden", background: "#000" }}>
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/ZKUbVLVpzMw?si=F_zqvWOQmJ0NKifh"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{ display: "block" }}
      />
    </div>
  );
}