import { useState } from "react";
import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score, index }: { title: string, score: number, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getScoreColor = (score: number) => {
    if (score > 70) return 'from-[#6b8cff] to-[#6b8cff]';
    if (score > 49) return 'from-[#c77dff] to-[#c77dff]';
    return 'from-[#ff6b9d] to-[#ff6b9d]';
  };

  return (
    <div 
      className="group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <div className={`
        flex flex-row items-center justify-between px-5 py-4 
        transition-all duration-300
        border-t border-[#1a1f3d]
        ${isHovered ? 'bg-gradient-to-r from-[#6b8cff08] to-[#8b5cf608]' : ''}
      `}>
        <div className='flex flex-row gap-3 items-center'>
          <div className={`
            w-2 h-2 rounded-full 
            bg-gradient-to-br ${getScoreColor(score)}
            transition-all duration-300
            ${isHovered ? 'scale-150 shadow-lg' : ''}
          `} />
          <p className='text-base font-medium text-[#a0b4ec] group-hover:text-[#c0d0ff] transition-colors duration-200'>
            {title}
          </p>
          <ScoreBadge score={score}/>
        </div>
        <div className='flex items-center gap-2'>
          <span className={`
            text-xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent
            transition-all duration-300
            ${isHovered ? 'scale-110' : ''}
          `}>
            {score}
          </span>
          <span className='text-sm text-[#8a9ab8]'>/100</span>
        </div>
      </div>
      
      {/* Animated progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1f3d]">
        <div 
          className={`h-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-1000 ease-out`}
          style={{ 
            width: isHovered ? `${score}%` : '0%',
            boxShadow: isHovered ? `0 0 10px ${score > 70 ? '#6b8cff' : score > 49 ? '#c77dff' : '#ff6b9d'}` : 'none'
          }}
        />
      </div>
    </div>
  );
};

// Summary Component
const Summary = ({ feedback }: { feedback: Feedback }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='
      bg-[#0f0f1a] rounded-2xl w-full overflow-hidden
      shadow-[inset_0_0_12px_0_rgba(107,140,255,0.15)]
      hover:shadow-[0_0_30px_rgba(107,140,255,0.2)]
      transition-all duration-500
    '>
      {/* Header Section */}
      <div className='flex flex-row items-center p-6 gap-6 bg-gradient-to-br from-[#14141f] to-[#0f0f1a]'>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6b8cff] to-[#8b5cf6] rounded-full blur-xl opacity-20 animate-pulse" />
          <ScoreGauge score={feedback.overallScore}/>
        </div>

        <div className='flex flex-col gap-2 flex-1'>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-[#6b8cff] via-[#c77dff] to-[#8b5cf6] bg-clip-text text-transparent'>
            Your Resume Score
          </h2>
          <p className='text-sm text-[#8a9ab8] leading-relaxed'>
            Comprehensive analysis based on industry standards and best practices
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg bg-[#14141f] hover:bg-[#1a1f3d] transition-all duration-200 group"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="url(#btnGradient)" 
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="btnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b8cff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Categories Section */}
      <div className={`
        transition-all duration-500 ease-in-out overflow-hidden
        ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <Category title='Tone & Style' score={feedback.toneAndStyle.score} index={0}/>
        <Category title='Content' score={feedback.content.score} index={1}/>
        <Category title='Structure' score={feedback.structure.score} index={2}/>
        <Category title='Skills' score={feedback.skills.score} index={3}/>
      </div>

      {/* Footer with stats */}
      <div className={`
        grid grid-cols-4 gap-4 p-4 border-t border-[#1a1f3d] bg-[#14141f]
        transition-all duration-300
        ${isExpanded ? 'opacity-100' : 'opacity-60'}
      `}>
        {[
          { label: 'Tone', score: feedback.toneAndStyle.score },
          { label: 'Content', score: feedback.content.score },
          { label: 'Structure', score: feedback.structure.score },
          { label: 'Skills', score: feedback.skills.score }
        ].map((item, i) => (
          <div key={i} className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="text-lg font-bold bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] bg-clip-text text-transparent">
              {item.score}
            </div>
            <div className="text-xs text-[#8a9ab8]">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary