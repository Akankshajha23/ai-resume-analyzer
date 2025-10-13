import React from "react";
import { motion } from "framer-motion";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const level =
    score > 69 ? "good" : score > 49 ? "average" : "poor";

  // Themed colors
  const colorMap = {
    good: {
      glow: "from-[#6b8cff]/30 to-[#8b5cf6]/10",
      text: "text-[#6b8cff]",
      ring: "ring-[#6b8cff]/40",
    },
    average: {
      glow: "from-[#c77dff]/30 to-[#8b5cf6]/10",
      text: "text-[#c77dff]",
      ring: "ring-[#c77dff]/40",
    },
    poor: {
      glow: "from-[#ff6b9d]/30 to-[#c77dff]/10",
      text: "text-[#ff6b9d]",
      ring: "ring-[#ff6b9d]/40",
    },
  };

  const subtitle =
    level === "good"
      ? "Excellent Performance"
      : level === "average"
      ? "Good Start — Room to Grow"
      : "Needs Improvement";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl p-6 shadow-lg backdrop-blur-md bg-[#0f0f1a]/70 ring-1 ${colorMap[level].ring}`}
    >
      {/* Glow background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorMap[level].glow} blur-3xl opacity-40`}
      />

      {/* Score Circle */}
      <div className="relative z-10 flex flex-col items-center justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="#1a1f3d"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="60"
              stroke="url(#grad)"
              strokeWidth="10"
              fill="none"
              strokeDasharray="377"
              strokeDashoffset={377 - (score / 100) * 377}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 377 }}
              animate={{ strokeDashoffset: 377 - (score / 100) * 377 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#6b8cff" />
                <stop offset="100%" stopColor="#c77dff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white">{score}</p>
            <p className="text-xs text-gray-400">/100</p>
          </div>
        </div>
        <p
          className={`mt-4 text-xl font-semibold ${colorMap[level].text}`}
        >
          {subtitle}
        </p>
      </div>

      {/* Suggestions */}
      <div className="relative z-10 space-y-4">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-start gap-3"
          >
            <span
              className={`flex-shrink-0 w-5 h-5 mt-1 rounded-full ${
                suggestion.type === "good"
                  ? "bg-[#6b8cff]/20 text-[#6b8cff]"
                  : "bg-[#c77dff]/20 text-[#c77dff]"
              } flex items-center justify-center text-sm`}
            >
              {suggestion.type === "good" ? "✓" : "!"}
            </span>
            <p
              className={`text-sm ${
                suggestion.type === "good"
                  ? "text-[#6b8cff]"
                  : "text-[#c77dff]"
              }`}
            >
              {suggestion.tip}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom note */}
      <p className="relative z-10 mt-6 text-gray-400 text-sm italic">
        Keep refining your resume to increase your ATS compatibility.
      </p>
    </motion.div>
  );
};

export default ATS;
