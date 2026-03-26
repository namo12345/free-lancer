"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoPitchProps {
  existingUrl?: string;
  onUpload: (file: File) => Promise<void>;
}

export function VideoPitch({ existingUrl, onUpload }: VideoPitchProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(existingUrl || "");
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        // Upload
        setUploading(true);
        const file = new File([blob], "video-pitch.webm", { type: "video/webm" });
        await onUpload(file);
        setUploading(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      // Auto-stop after 2 minutes
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 120000);
    } catch {
      alert("Camera access denied. Please allow camera and microphone.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("Video must be under 50MB");
      return;
    }
    setVideoUrl(URL.createObjectURL(file));
    setUploading(true);
    onUpload(file).finally(() => setUploading(false));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Video Pitch (max 2 min)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videoUrl ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} src={videoUrl} controls className="w-full h-full" />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center">
            <video ref={videoRef} className={isRecording ? "w-full h-full object-cover" : "hidden"} muted />
            {!isRecording && (
              <p className="text-sm text-muted-foreground">Record or upload a 30-second intro</p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {!isRecording ? (
            <>
              <Button variant="outline" onClick={startRecording} disabled={uploading}>
                Record Video
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" disabled={uploading} type="button" onClick={(e) => { e.preventDefault(); (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement)?.click(); }}>
                  Upload Video
                </Button>
                <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </>
          ) : (
            <Button variant="destructive" onClick={stopRecording}>
              Stop Recording
            </Button>
          )}
          {uploading && <span className="text-sm text-muted-foreground self-center">Uploading...</span>}
        </div>
      </CardContent>
    </Card>
  );
}
