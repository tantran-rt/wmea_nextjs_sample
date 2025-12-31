import { Browser, CAMERA_RESOLUTION } from "@/types/constants";
import { sendLogs } from "@/utils/sendAnalytics.utils";
import { useEffect, useRef, useState } from "react";

export default function useMediaFunctions() {
  const [mimeType, setMimeType] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const types = ["video/mp4", "video/webm"];
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    for (const type of types) {
      const isSupported = MediaRecorder.isTypeSupported(type);
      if (isSupported) {
        console.log(type, "is supported recorder format");
        if (type === "video/mp4") {
          setMimeType("video/mp4; codecs=avc1.64001e, mp4a.40.2");
        } else {
          // "video/webm;codecs=vp8,opus"
          setMimeType("video/webm; codecs=vp8,opus");
        }
        break;
      }
    }
  }, []);

  // Cleanup effect to ensure mediaRecorder is stopped when component unmounts
  useEffect(() => {
    // This effect doesn't do anything on mount, it only runs the cleanup function on unmount
    return () => {
      console.log("useMediaFunctions unmounting - cleaning up media resources");

      if (mediaRecorderRef.current) {
        console.log("useMediaFunctions cleanup - stopping mediaRecorder");
        const mediaRecorder = mediaRecorderRef.current;
        mediaRecorder.stream.getTracks().forEach((track) => {
          track.stop();
        });
        mediaRecorder.stop();
        intervalRef.current && clearInterval(intervalRef?.current);
      }

      // Also stop any active streams
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopMediaRecorder = () => {
    console.log("stopped");
    if (mediaRecorderRef.current) {
      const mediaRecorder = mediaRecorderRef.current;
      mediaRecorder.stream.getTracks().forEach((track) => {
        track.stop();
      });
      mediaRecorder.stop();
      // mediaRecorder.ondataavailable = null;
      intervalRef.current && clearInterval(intervalRef?.current);
    }
  };
  const onAIError = () => {
    console.log("AI Error");
    if (mediaRecorderRef.current) {
      const mediaRecorder = mediaRecorderRef.current;
      mediaRecorder.ondataavailable = null;
      intervalRef.current && clearInterval(intervalRef?.current);
    }
  };

  const startMediaRecorder = async (
    isDesktop: boolean,
    resolution: { width: number; height: number }
  ) => {
    setLoading(true);

    // Small delay to give camera time to initialize properly
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Check if the stream already has an audio track, if not, add one
    await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: isDesktop
          ? {
              width: { ideal: resolution.width },
              height: { ideal: resolution.height },
              facingMode: "user",
              aspectRatio: resolution.width / resolution.height,
            }
          : {
              width: { ideal: CAMERA_RESOLUTION.MOBILE.WIDTH },
              height: { ideal: CAMERA_RESOLUTION.MOBILE.HEIGHT },
              facingMode: "user",
              aspectRatio:
                CAMERA_RESOLUTION.MOBILE.WIDTH /
                CAMERA_RESOLUTION.MOBILE.HEIGHT,
            },
      })
      .then((mediaStream) => {
        setStream(mediaStream);
        let test = "";
        for (const type of types) {
          const isSupported = MediaRecorder.isTypeSupported(type);
          if (isSupported) {
            if (type === "video/mp4") {
              test = "video/mp4; codecs=avc1.64001e, mp4a.40.2";
            } else {
              test = "video/webm; codecs=vp8,opus";
            }
            break;
          }
        }

        console.log("mimeType", test);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        mediaRecorderRef.current = new MediaRecorder(mediaStream, {
          mimeType: test,
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000,
        });
        return mediaRecorderRef.current;
      })
      .then((mediaRecorder) => {
        mediaRecorder?.start();
        intervalRef.current = setInterval(() => {
          sendLogs(mediaRecorder.state, " start Beam blob recording");
          mediaRecorder.stop();
          mediaRecorder.start();
        }, 30000);
      })
      .catch((error) => {
        sendLogs(`Camera access failed ${error}`);
      })
      .finally(() => setLoading(false));
  };

  const handleRequestData = () => {
    if (mediaRecorderRef.current) {
      console.log("request data");
      const mediaRecorder = mediaRecorderRef.current;
      intervalRef.current && clearInterval(intervalRef?.current);
      mediaRecorder.stop();
      mediaRecorder.start();
      intervalRef.current = setInterval(() => {
        sendLogs(mediaRecorder.state, "new blob recording");
        mediaRecorder.stop();
        mediaRecorder.start();
      }, 30000);
    }
  };

  const updateCameraResolution = async (width: number, height: number) => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      console.error("No video track found.");
      return;
    }

    const newConstraints = {
      width: { ideal: width },
      height: { ideal: height },
      facingMode: "user",
      aspectRatio: width / height,
    };

    try {
      await videoTrack.applyConstraints(newConstraints);
      console.log(
        `Resolution updated to: ${JSON.stringify(
          newConstraints.width
        )} x ${JSON.stringify(newConstraints.height)}`
      );
    } catch (err) {
      console.error("Failed to apply constraints:", err);
    }
  };

  return {
    mediaRecorderRef,
    videoRef,
    mimeType,
    startMediaRecorder,
    stopMediaRecorder,
    handleRequestData,
    onAIError,
    loading,
    stream,
    updateCameraResolution,
  };
}
// const handleDownload = (recordedChunks: any) => {
//     const blob = new Blob([recordedChunks], { type: "video/webm" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "recording.webm";
//     a.click();
//     URL.revokeObjectURL(url);
//   };
