import { useEffect, useState } from "react";

const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = animatedScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative w-[100px] h-[100px] transition-transform duration-300 hover:scale-110">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90 filter drop-shadow-lg"
      >
        {/* Background circle with glow */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="#1a1f3d"
          strokeWidth={stroke}
          fill="transparent"
          className="opacity-50"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="circleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6b8cff" />
            <stop offset="50%" stopColor="#c77dff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Progress circle with gradient and glow */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="url(#circleGrad)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold text-lg bg-gradient-to-r from-[#6b8cff] via-[#c77dff] to-[#8b5cf6] bg-clip-text text-transparent">
          {animatedScore}
        </span>
        <span className="text-xs text-[#a0b4ec] opacity-60">/100</span>
      </div>
    </div>
  );
};

export default ScoreCircle