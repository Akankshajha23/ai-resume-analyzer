import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = animatedScore / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

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
    <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
      <div className="relative w-44 h-24">
        <svg viewBox="0 0 100 50" className="w-full h-full filter drop-shadow-lg">
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#c77dff" />
              <stop offset="100%" stopColor="#6b8cff" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#1a1f3d"
            strokeWidth="10"
            strokeLinecap="round"
            className="opacity-50"
          />

          {/* Foreground arc with gradient */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            filter="url(#gaugeGlow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#6b8cff] via-[#c77dff] to-[#8b5cf6] bg-clip-text text-transparent">
            {animatedScore}
          </div>
          <div className="text-xs text-[#a0b4ec] opacity-60">/100</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge