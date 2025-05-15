import React from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  className = "",
}) => {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
      style={{
        background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
          ((value - min) / (max - min)) * 100
        }%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
      }}
    />
  );
};
