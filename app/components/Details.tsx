import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  let badgeColor = '';
  let badgeTextColor = '';
  let icon = '';

  if (score > 69) {
    badgeColor = 'bg-[#1a1f3d]';
    badgeTextColor = 'text-[#6b8cff]';
    icon = '✓';
  } else if (score > 39) {
    badgeColor = 'bg-[#2d1f3d]';
    badgeTextColor = 'text-[#c77dff]';
    icon = '!';
  } else {
    badgeColor = 'bg-[#3d1a2d]';
    badgeTextColor = 'text-[#ff6b9d]';
    icon = '!';
  }

  return (
    <div
      className={`
        flex flex-row gap-1.5 items-center px-3 py-1 rounded-full
        ${badgeColor} ${badgeTextColor}
        shadow-[inset_0_0_8px_0_rgba(107,140,255,0.15)]
        text-xs font-semibold
        transition-all duration-300 hover:scale-105
      `}
    >
      <span className="text-sm">{icon}</span>
      <span>{score}/100</span>
    </div>
  );
};

// CategoryHeader Component
const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-3 items-center">
      <p className="text-lg font-semibold text-[#a0b4ec] group-hover:text-[#c0d0ff] transition-colors duration-200">
        {title}
      </p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

// CategoryContent Component
const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  const goodTips = tips.filter(t => t.type === "good");
  const improveTips = tips.filter(t => t.type === "improve");

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Quick Summary Grid */}
      <div className="bg-[#0f0f1a] w-full rounded-xl px-5 py-4 grid grid-cols-2 gap-3 shadow-[inset_0_0_8px_0_rgba(107,140,255,0.1)]">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-start group hover:translate-x-1 transition-transform duration-200" key={index}>
            <span className={`text-sm mt-0.5 ${tip.type === "good" ? 'text-[#6b8cff]' : 'text-[#c77dff]'}`}>
              {tip.type === "good" ? '✓' : '!'}
            </span>
            <p className="text-sm text-[#a0b4ec] group-hover:text-[#c0d0ff] transition-colors duration-200">
              {tip.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Tips */}
      <div className="flex flex-col gap-3 w-full">
        {goodTips.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#6b8cff] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b8cff]"></span>
              Strengths
            </h4>
            {goodTips.map((tip, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-xl p-4 bg-gradient-to-br from-[#1a1f3d] to-[#14141f] border border-[#2a3f5f] hover:border-[#6b8cff] transition-all duration-300 group hover:shadow-[0_0_15px_rgba(107,140,255,0.1)]"
              >
                <div className="flex flex-row gap-2 items-center">
                  <span className="text-[#6b8cff]">✓</span>
                  <p className="text-sm font-semibold text-[#6b8cff]">{tip.tip}</p>
                </div>
                <p className="text-sm text-[#8a9ab8] leading-relaxed pl-5">{tip.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {improveTips.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#c77dff] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c77dff]"></span>
              Areas to Improve
            </h4>
            {improveTips.map((tip, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-xl p-4 bg-gradient-to-br from-[#2d1f3d] to-[#14141f] border border-[#3d2f4f] hover:border-[#c77dff] transition-all duration-300 group hover:shadow-[0_0_15px_rgba(199,125,255,0.1)]"
              >
                <div className="flex flex-row gap-2 items-center">
                  <span className="text-[#c77dff]">!</span>
                  <p className="text-sm font-semibold text-[#c77dff]">{tip.tip}</p>
                </div>
                <p className="text-sm text-[#8a9ab8] leading-relaxed pl-5">{tip.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Details Component
interface Feedback {
  toneAndStyle: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  content: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  structure: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  skills: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
}

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion defaultOpen="tone-style">
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader title="Tone & Style" categoryScore={feedback.toneAndStyle.score} />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader title="Content" categoryScore={feedback.content.score} />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader title="Structure" categoryScore={feedback.structure.score} />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader title="Skills" categoryScore={feedback.skills.score} />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;