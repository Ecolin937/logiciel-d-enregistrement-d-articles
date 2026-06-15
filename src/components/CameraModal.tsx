import React, { useState, useEffect, useRef } from "react";
import { X, Camera, SwitchCamera } from "lucide-react";

interface CameraModalProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setError("");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode }
        });
        
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Camera error:", err);
          setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [facingMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Compress and get data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      
      stopCamera();
      onCapture(dataUrl);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10002] bg-[#141414] flex flex-col items-center justify-center font-sans">
      <div className="w-full bg-[#141414] text-white p-4 flex justify-between items-center absolute top-0 left-0 z-10">
        <button onClick={handleClose} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700">
          <X className="w-6 h-6" />
        </button>
        <div className="font-mono text-sm font-bold tracking-widest uppercase">
          Appareil Photo
        </div>
        <button 
          onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
          className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700"
        >
          <SwitchCamera className="w-6 h-6" />
        </button>
      </div>

      {error ? (
        <div className="text-red-500 font-mono text-sm p-8 text-center bg-red-950 border border-red-800 m-4">
          ⚠ {error}
        </div>
      ) : (
        <div className="relative w-full max-w-lg aspect-[3/4] sm:aspect-video bg-black flex items-center justify-center overflow-hidden border-y-2 border-neutral-800">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <div className="w-full p-8 flex justify-center absolute bottom-0 left-0">
        <button
          onClick={handleCapture}
          disabled={!!error}
          className="w-20 h-20 bg-white rounded-full border-4 border-neutral-300 flex items-center justify-center shadow-[0_0_0_4px_#white] hover:scale-105 active:scale-95 transition-all outline-none"
        >
          <div className="w-16 h-16 border-2 border-neutral-300 rounded-full bg-white flex items-center justify-center">
             <div className="w-14 h-14 bg-red-600 rounded-full"></div>
          </div>
        </button>
      </div>
    </div>
  );
}
