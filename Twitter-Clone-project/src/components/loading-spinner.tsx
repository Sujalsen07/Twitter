import React from "react";
import { Loader2 } from "lucide-react"; // from lucide-react, matches your other icons

interface LoadingSpinnerProps {
  size?: number; // control the spinner size
  color?: string; // optional color override
  text?: string; // optional loading text
  fullscreen?: boolean; // whether to show it as a fullscreen overlay
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 28,
  color = "#1d9bf0",
  text = "Loading...",
  fullscreen = false,
}) => {
  const Spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        size={size}
        style={{ color }}
        className="animate-spin text-[#1d9bf0]"
      />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        {Spinner}
      </div>
    );
  }

  return Spinner;
};

export default LoadingSpinner;
