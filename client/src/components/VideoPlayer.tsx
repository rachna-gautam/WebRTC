import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, muted = false }: { stream: MediaStream | null; muted?: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);
  
    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        height={200}
        width={200}
        className="w-full h-full rounded-lg object-cover"
      />
    );
  };
  


  export default VideoPlayer