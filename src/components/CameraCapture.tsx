import { useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    setupCamera();

    return () => {
      // Clean up Camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#141414] flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full max-h-[70vh] object-contain bg-black shadow-lg" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-10 flex gap-8">
        <button onClick={onClose} className="p-5 bg-red-600 rounded-full text-white shadow-xl hover:bg-red-700 transition-all">
          <X className="w-8 h-8" />
        </button>
        <button onClick={takePhoto} className="p-5 bg-white rounded-full text-[#141414] shadow-xl hover:bg-gray-200 transition-all">
          <Camera className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
