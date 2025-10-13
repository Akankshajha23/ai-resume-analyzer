
import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : []
  );

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider
      value={{ activeItems, toggleItem, isItemActive }}
    >
      <div className={`space-y-3 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(id);
  
  return (
    <div 
      className={`
        overflow-hidden rounded-xl bg-[#14141f] 
        transition-all duration-300
        ${isActive ? 'shadow-[0_0_20px_rgba(107,140,255,0.15)]' : 'shadow-[inset_0_0_12px_0_rgba(107,140,255,0.15)]'}
        hover:shadow-[0_0_25px_rgba(107,140,255,0.2)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  const defaultIcon = (
    <svg
      className={`w-4 h-4 transition-transform duration-300 ease-out ${isActive ? 'rotate-180' : ''}`}
      fill="none"
      stroke="url(#iconGradient)"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b8cff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const handleClick = () => {
    toggleItem(itemId);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full px-5 py-4 text-left
        focus:outline-none
        transition-all duration-300 
        flex items-center justify-between 
        cursor-pointer
        group
        ${isActive ? 'bg-gradient-to-r from-[#6b8cff08] to-[#8b5cf608]' : ''}
        hover:bg-gradient-to-r hover:from-[#6b8cff0a] hover:to-[#8b5cf60a]
        ${className}
      `}
    >
      <div className="flex items-center space-x-3 flex-1">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="flex-1 text-sm font-medium text-[#a0b4ec] group-hover:text-[#c0d0ff] transition-colors duration-200">
          {children}
        </div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className={`px-5 pb-4 pt-1 text-sm text-[#8a9ab8] leading-relaxed border-t border-[#1a1f3d] ${className}`}>
        {children}
      </div>
    </div>
  );
};