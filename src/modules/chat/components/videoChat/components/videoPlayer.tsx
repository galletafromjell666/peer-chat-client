import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  isBigFrame: boolean;
  stream: MediaStream;
  label: string;
}
function VideoPlayer({ label, stream, isBigFrame }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`video_container ${isBigFrame ? "big_frame" : "small_frame"}`}
    >
      <p>{label}</p>
      <video
        autoPlay
        playsInline
        ref={videoRef}
        id={`video-${isBigFrame ? "big_frame" : "small_frame"}`}
      />
    </div>
  );
}

export default VideoPlayer;
