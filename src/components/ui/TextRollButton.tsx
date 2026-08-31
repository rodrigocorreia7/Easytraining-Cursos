'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TextRollButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'green' | 'yellow' | 'blue' | 'whatsapp' | 'white' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export const TextRollButton: React.FC<TextRollButtonProps> = ({
  text,
  onClick,
  variant = 'green',
  className = '',
  size = 'md',
  href,
  target,
  rel,
  type = 'button',
  ariaLabel
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'whatsapp':
        return 'bg-[#075E54] hover:bg-[#054c44] text-white font-bold';
      case 'yellow':
        return 'bg-[#FFB800] hover:bg-[#e6a600] text-slate-800 font-bold';
      case 'blue':
        return 'bg-[#0B4F9C] hover:bg-[#083b75] text-white font-bold';
      case 'dark':
        return 'bg-slate-800 hover:bg-slate-900 text-white font-bold';
      case 'white':
        return 'bg-white hover:bg-slate-50 text-slate-800 shadow-md font-bold';
      case 'green':
      default:
        return 'bg-[#00B060] hover:bg-[#009652] text-white font-bold';
    }
  };

  const getArrowStyles = () => {
    switch (variant) {
      case 'whatsapp':
        return 'bg-white text-[#075E54]';
      case 'yellow':
        return 'bg-slate-800 text-[#FFB800]';
      case 'blue':
        return 'bg-white text-[#0B4F9C]';
      case 'dark':
        return 'bg-white text-slate-800';
      case 'white':
        return 'bg-[#00B060] text-white';
      case 'green':
      default:
        return 'bg-white text-[#00B060]';
    }
  };

  const getSizePadding = () => {
    switch (size) {
      case 'sm':
        return 'pl-4 pr-1.5 py-1.5 text-[12px] gap-2';
      case 'lg':
        return 'pl-6 sm:pl-7 pr-2.5 py-2.5 sm:py-3 text-[15px] sm:text-[16px] gap-4';
      case 'md':
      default:
        return 'pl-5 sm:pl-6 pr-2 py-2 text-[13px] sm:text-[14px] gap-3 sm:gap-3.5';
    }
  };

  const buttonClasses = `group relative inline-flex items-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] rounded-full font-medium shadow-sm active:scale-95 ${getVariantStyles()} ${getSizePadding()} ${className}`;

  const content = (
    <>
      <div className="h-[20px] overflow-hidden flex flex-col justify-start">
        <div className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
          <span className="h-[20px] flex items-center leading-none whitespace-nowrap">{text}</span>
          <span className="h-[20px] flex items-center leading-none whitespace-nowrap">{text}</span>
        </div>
      </div>
      <span
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 ${getArrowStyles()}`}
      >
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
        aria-label={ariaLabel || text}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      aria-label={ariaLabel || text}
    >
      {content}
    </button>
  );
};
