export default function VideoTestimonial() {
  return (
    <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden bg-black">
      <iframe
        className="absolute inset-0 w-full h-full"
        src="https://www.youtube.com/embed/ZKUbVLVpzMw?si=F_zqvWOQmJ0NKifh&enablejsapi=1"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}