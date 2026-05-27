import React, { useEffect, useState } from 'react';

interface RingProps {
  percentage: number;
  color: string;
  radius: number;
  strokeWidth: number;
  label?: string;
  value?: string;
  subValue?: string;
  trackColor?: string;
}

export function Ring({ percentage, color, radius, strokeWidth, label, value, subValue, trackColor = "#333" }: RingProps) {
  const [offset, setOffset] = useState(0);
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    // Animate to percentage on mount
    const p = Math.min(Math.max(percentage, 0), 100);
    const dashoffset = circumference - (p / 100) * circumference;
    // slight delay for effect
    const timeout = setTimeout(() => {
      setOffset(dashoffset);
    }, 100);
    return () => clearTimeout(timeout);
  }, [percentage, circumference]);

  // Initial state is full circumference (empty ring)
  const initialOffset = circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Fill indicator */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset || initialOffset, transition: 'stroke-dashoffset 0.8s ease-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {(label || value || subValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {label && <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>}
          {value && <span className="text-2xl font-bold text-white leading-none my-1">{value}</span>}
          {subValue && <span className="text-xs text-gray-400">{subValue}</span>}
        </div>
      )}
    </div>
  );
}
