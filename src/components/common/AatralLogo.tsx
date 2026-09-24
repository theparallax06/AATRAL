import React from 'react';
import aatralLogo from '../../assets/aatral-logo.png';

interface AatralLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
}

export const AatralLogo: React.FC<AatralLogoProps> = ({
  size = 'md',
  variant = 'default',
  showText = true,
}) => {
  const dimensions = {
    sm: { img: 'h-7', text: 'text-base' },
    md: { img: 'h-9', text: 'text-lg' },
    lg: { img: 'h-11', text: 'text-2xl' },
    xl: { img: 'h-14', text: 'text-3xl' },
  }[size];

  const textColor = {
    default: 'text-[#062B3A]',
    white: 'text-white',
    dark: 'text-slate-900',
  }[variant];

  const subTextColor = {
    default: 'text-[#35C6B0]',
    white: 'text-purple-200',
    dark: 'text-[#35C6B0]',
  }[variant];

  return (
    <div className="flex items-center gap-2.5 select-none group">
      <img
        src={aatralLogo}
        alt="Aatral Logo"
        className={`${dimensions.img} w-auto object-contain transition-transform group-hover:scale-105`}
      />
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight flex items-center ${dimensions.text} ${textColor}`}>
            AAT<span className={`font-bold ${subTextColor}`}>RAL</span>
          </div>
          <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-400 -mt-1">
            Fair Worker Cooperative
          </span>
        </div>
      )}
    </div>
  );
};
