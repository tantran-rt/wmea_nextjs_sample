import {
  getMultipartUploadPresignedUrl,
  InitializeMultipartUploadId,
} from "@/app/test-collection/[slug]/action";
import {
  pushIntoCompletedParts,
  setPartNumber,
  setUploadId,
} from "@/redux/slices/drugTest";
import { fetchRetry } from "@/utils/fetchWithRetry";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { chunkStorage } from "@/utils/S3ChunkDB";
import { sendLogs } from "@/utils/sendAnalytics.utils";
import { base64ToBlob, blobToBase64WithoutPrefix } from "@/utils/utils";
import useGetDeviceInfo from "./useGetDeviceInfo";
import { Browser, CAMERA_RESOLUTION, MobilePlatform } from "@/types/constants";

const types = [
  { mimeType: "video/mp4", codec: "avc1.64001e, mp4a.40.2" },
  { mimeType: "video/webm", codec: "vp8,opus" },
];

export default function useMediaFunctionCapture() {
  const dispatch = useDispatch();
  const { browserName, osName } = useGetDeviceInfo();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<
    "acquiring" | "previewing" | "recording" | "recorded" | "stopped" | "denied"
  >("acquiring");
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const chunksRef = useRef<Blob[]>([]);
  const mediaCaptureRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const partNumberRef = useRef<number>(0);
  const uploadIdRef = useRef("");
  const completedPartsRef = useRef<any[]>([]);
  const filenameRef = useRef("");
  const isFinalChunkRef = useRef(false);
  const mimeTypeRef = useRef("");
  const codecRef = useRef("");

  const requestPermission = async (
    isDesktop: boolean,
    resolution: { width: number; height: number }
  ) => {
    try {
      setSelectedResolution(resolution);
      setIsDesktop(isDesktop);
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
        .then((stream) => {
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          sendLogs(
            `Camera settings on request permission: ${JSON.stringify(settings)}`
          );

          stream.getTracks().forEach((track) => track.stop());
          setStatus("previewing");
        })
        .catch((e) => {
          console.log(e, "error requesting permission");
          setStatus("denied");
        });
    } catch (e) {
      // If permissions API not supported, we'll fall back to getUserMedia
      console.log("Permissions API not supported");
    }
  };

  // Cleanup effect to ensure mediaRecorder is stopped when component unmounts
  useEffect(() => {
    // This effect doesn't do anything on mount, it only runs the cleanup function on unmount
    return () => {
      console.log(
        "useMediaFunctionsCapture unmounting - cleaning up media resources"
      );

      if (mediaCaptureRef.current) {
        console.log(
          "useMediaFunctionsCapture cleanup - stopping mediaRecorder"
        );
        const mediaRecorder = mediaCaptureRef.current;
        mediaRecorder.stream.getTracks().forEach((track) => {
          track.stop();
        });
        mediaRecorder.stop();
      }

      // Also stop any active streams
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopMediaRecorder = (isFinalChunk: boolean = false) => {
    try {
      isFinalChunkRef.current = isFinalChunk;
      if (mediaCaptureRef.current) {
        const mediaRecorder = mediaCaptureRef.current;
        mediaRecorder.stream.getTracks().forEach((track) => {
          track.stop();
        });
        mediaRecorder.stop();

        setStatus("recorded");
        console.log("stopped media capture and status set to recorded");
      }
    } catch (e) {
      setStatus("stopped");
      console.log("error stopping media recorder", e);
    }
  };

  const startMediaRecorder = async (filename: string) => {
    filenameRef.current = filename;
    setLoading(true);

    // Reset part number to ensure we start from 0
    partNumberRef.current = 0;
    completedPartsRef.current = [];
    chunksRef.current = [];
    isFinalChunkRef.current = false;

    // Small delay to give camera time to initialize properly
    // await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if the stream already has an audio track, if not, add one
    await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: isDesktop
          ? {
              width: { ideal: selectedResolution?.width },
              height: { ideal: selectedResolution?.height },
              facingMode: "user",
              aspectRatio:
                selectedResolution?.width / selectedResolution?.height,
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
        const videoTrack = mediaStream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        sendLogs(`Camera settings onUserMedia: ${JSON.stringify(settings)}`);
        sendLogs(`Video resolution: ${settings.width}x${settings.height}`);

        setStream(mediaStream);

        let test = "";
        for (const type of types) {
          const isSupported = MediaRecorder.isTypeSupported(type.mimeType);
          if (isSupported) {
            initiateMultipartUpload(filenameRef.current, type.mimeType);
            mimeTypeRef.current = type.mimeType;
            codecRef.current = type.codec;
            test = type.mimeType;
            break;
          }
        }

        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        mediaCaptureRef.current = new MediaRecorder(mediaStream, {
          mimeType: test,
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000,
        });
        return mediaCaptureRef.current;
      })
      .then((mediaRecorder) => {
        // Lower timeslice to 10000 for Safari
        if (
          browserName === Browser.Safari ||
          browserName === Browser.MobileSafari ||
          osName === MobilePlatform.iOS
        ) {
          mediaRecorder?.start(10000);
        } else {
          mediaRecorder?.start(30000);
        }
        setStatus("recording");
        mediaRecorder.ondataavailable = handleDataAvailableForMediaCapture;
      })
      .catch((e) => {
        console.log("error starting media recorder", e);
        // Set status to denied to trigger permission error handling
        setStatus("denied");
        throw new Error("Failed to start media recorder: " + e.message);
      })
      .finally(() => setLoading(false));
  };

  // Initialize S3 multipart upload
  const initiateMultipartUpload = async (
    fileName: string,
    blobType: string
  ) => {
    try {
      const response = await InitializeMultipartUploadId(fileName, blobType);
      const uploadId = response as string;
      uploadIdRef.current = uploadId;
      dispatch(setUploadId(uploadId));
      sendLogs(
        `InitializeMultipartUploadId ${uploadId}\nfilename: ${fileName}`
      );
      return response;
    } catch (e) {
      console.log(e, "initialize multipart error");
    }
  };

  const checkBlobSize = (data: Blob, isFinal: boolean) => {
    // If there are accumulated chunks, combine them with current data
    if (data.size === 0) {
      return null;
    }
    if (chunksRef.current.length) {
      const blob = new Blob([...chunksRef.current, data]);
      console.log(blob.size, "blob size");
      // Return combined blob if it's final chunk or size >= 5MB
      if (isFinal || blob.size >= 5242880) {
        chunksRef.current = [];
        return blob;
      }
      // Keep accumulating if combined blob is still too small
      chunksRef.current = [blob];
      return null;
    }

    // For final chunk, return directly
    if (isFinal) {
      return data;
    }

    // For chunks larger than 5MB, return directly
    if (data.size >= 5242880) {
      return data;
    }

    // Accumulate small chunks
    chunksRef.current.push(data);
    return null;
  };

  // Upload a part of the video
  const uploadPart = async (
    chunk: Blob,
    key: string,
    partNumber: number,
    contentType: string
  ): Promise<boolean> => {
    try {
      const presignedUrl = await getMultipartUploadPresignedUrl(
        uploadIdRef.current,
        key,
        partNumber,
        contentType
      );

      const startTime = performance.now();
      const response = await fetchRetry(presignedUrl, 1000, 2, {
        method: "PUT",
        headers: {
          "Content-Type": mimeTypeRef.current.split(";")[0],
        },
        body: chunk,
        signal: AbortSignal.timeout(20000),
      });
      const endTime = performance.now();
      const latencyMs = endTime - startTime;
      sendLogs(`Network request latency: ${latencyMs.toFixed(2)} ms`);

      if (response.ok) {
        const etag = response.headers.get("ETag");

        await chunkStorage.updateChunk(filenameRef.current, partNumber, {
          uploadId: uploadIdRef.current,
          uploadCompleted: true,
          etag: etag ?? "",
        });
        if (!etag) {
          sendLogs(`No ETag received for part ${partNumber}`);
          throw new Error(`No ETag received for part ${partNumber}`);
        }

        // Check if this part number already exists in completedPartsRef
        const existingPartIndex = completedPartsRef.current.findIndex(
          (part) => part.PartNumber === partNumber
        );

        if (existingPartIndex >= 0) {
          sendLogs(
            `Part ${partNumber} already exists in completed parts. Replacing.`
          );
          // Replace the existing part
          completedPartsRef.current[existingPartIndex] = {
            ETag: etag,
            PartNumber: partNumber,
          };
        } else {
          // Add new part
          completedPartsRef.current.push({
            ETag: etag,
            PartNumber: partNumber,
          });
        }
        sendLogs(`Part ${partNumber} uploaded successfully with ETag: ${etag}`);
        dispatch(
          pushIntoCompletedParts({
            ETag: etag,
            PartNumber: partNumber,
          })
        );

        return true;
      }

      sendLogs(`Uploading chunk ${partNumber} failed ${response}`);

      return false;
    } catch (err) {
      // console.error(`Failed to upload part ${partNumber}:`, err);
      sendLogs(`Failed to upload part ${partNumber}: ${err}`);
      return false;
    }
  };

  // Modify handleDataAvailableForMediaCapture to include retry mechanism
  const handleDataAvailableForMediaCapture = async (data: BlobEvent) => {
    try {
      if (!data.data || data.data.size === 0) {
        return;
      }

      console.log(
        `Processing chunk: size=${data.data.size}, partNumber=${partNumberRef.current}, isFinal=${isFinalChunkRef.current}`
      );

      const blob = checkBlobSize(data.data, isFinalChunkRef.current);
      if (blob) {
        // Increment part number before using it
        partNumberRef.current += 1;
        const currentPartNumber = partNumberRef.current;

        console.log(
          `Uploading part ${currentPartNumber} of size ${blob.size} bytes`
        );
        dispatch(setPartNumber(currentPartNumber));

        // Immediate retry mechanism
        let uploadSuccess = false;
        let retryCount = 0;
        const maxUploadRetries = 2;
        const mimeType = mimeTypeRef.current || "video/mp4";
        const base64Chunk = await blobToBase64WithoutPrefix(blob);

        await chunkStorage.saveChunk({
          base64Chunk: base64Chunk,
          partNumber: currentPartNumber,
          uploadId: uploadIdRef.current,
          filename: filenameRef.current,
          uploadCompleted: false,
          etag: "",
          type: mimeType,
        });

        while (!uploadSuccess && retryCount < maxUploadRetries) {
          try {
            uploadSuccess = await uploadPart(
              blob,
              filenameRef.current,
              currentPartNumber,
              mimeType
            );

            if (uploadSuccess) {
              break;
            }

            retryCount++;
            if (retryCount === maxUploadRetries) {
              sendLogs(
                `Chunk ${currentPartNumber} after ${maxUploadRetries} failed attempts -> update retryCount`
              );
              await chunkStorage.updateChunk(
                filenameRef.current,
                currentPartNumber,
                {
                  uploadId: uploadIdRef.current,
                  uploadCompleted: false,
                  etag: "",
                  retryCount: retryCount,
                }
              );
            } else {
              // Wait before next retry with exponential backoff
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * Math.pow(2, retryCount))
              );
            }
          } catch (error) {
            retryCount++;
            console.error(
              `Upload attempt ${retryCount} failed for part ${currentPartNumber}:`,
              error
            );
          }
        }
      }
    } catch (e) {
      console.error("Error in handleDataAvailableForMediaCapture:", e);
    } finally {
      if (
        mediaCaptureRef.current &&
        isFinalChunkRef.current &&
        data.data.size > 0
      ) {
        mediaCaptureRef.current.ondataavailable = null;
      }
    }
  };

  const verifyFailedParts = async () => {
    sendLogs("Checking for failed S3 parts...");
    const pendingTestCheck = await chunkStorage.checkDatabaseAndObjectStore();
    if (!pendingTestCheck) {
      sendLogs("Database and S3Chunk store check failed");
      return;
    }

    const failedChunks = await chunkStorage.retrieveFailedChunks(
      filenameRef.current,
      2
    );
    if (!failedChunks.length) {
      sendLogs("No S3 failed chunks found!");
      return;
    }

    const sortedChunks = [...failedChunks].sort(
      (a, b) => a.partNumber - b.partNumber
    );

    const mimeType = mimeTypeRef.current || "video/mp4";
    sendLogs(
      `Found ${failedChunks.length} failed parts: ${JSON.stringify(
        failedChunks.map((c) => c.partNumber)
      )}, retrying upload...`
    );
    for (const chunkItem of sortedChunks) {
      try {
        const base64SChunk = chunkItem.base64Chunk;
        const cleanedBase64SChunk = base64SChunk.includes(",")
          ? base64SChunk.split(",")[1]
          : base64SChunk;

        const chunk = await base64ToBlob(cleanedBase64SChunk);
        console.log(`Reupload part ${chunkItem.partNumber} to S3...`);
        await uploadPart(
          chunk,
          filenameRef.current,
          chunkItem.partNumber,
          mimeType
        );
      } catch (error) {
        console.error(
          `S3 part ${chunkItem.partNumber} reupload failed: ${error}`
        );
      }
    }
  };

  return {
    mediaCaptureRef,
    record: startMediaRecorder,
    stop: stopMediaRecorder,
    requestPermission,
    loading,
    stream,
    status,
    verifyFailedS3Parts: verifyFailedParts,
  };
}
