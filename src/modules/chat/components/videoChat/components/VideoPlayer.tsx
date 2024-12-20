import { useEffect, useRef } from "react";
import { usePreferredAudioOutput } from "@common/store";
import { Typography } from "antd";
import isEmpty from "lodash/isEmpty";

interface VideoPlayerProps {
  isBigFrame: boolean;
  stream: MediaStream;
  label: string;
  muted?: boolean;
}

const { Text } = Typography;

function VideoPlayer({ label, stream, isBigFrame, muted }: VideoPlayerProps) {
  const preferredAudioOutput = usePreferredAudioOutput();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (muted || isEmpty(preferredAudioOutput) || isEmpty(videoRef?.current))
      return;
    console.log("Changing video audio output device: ", preferredAudioOutput);
    videoRef.current.setSinkId(preferredAudioOutput);
  }, [preferredAudioOutput, muted]);

  return (
    <div
      className={`video_container ${isBigFrame ? "big_frame" : "small_frame"}`}
    >
      <Text>{label}</Text>
      <video
        muted={!!muted}
        autoPlay
        playsInline
        ref={videoRef}
        id={`video-${isBigFrame ? "big_frame" : "small_frame"}`}
      />
    </div>
  );
}

export default VideoPlayer;
