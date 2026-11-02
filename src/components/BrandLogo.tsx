import React, { useState } from 'react';

interface BrandLogoProps {
  variant?: 'primary' | 'monogram' | 'horizontal' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Fallback SVG Insignia if image fails
  const SvgFallback = ({ s = 40 }: { s?: number }) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
    >
      <defs>
        <linearGradient id="dvGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD76A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F5E6B3" />
        </linearGradient>
      </defs>
      {/* Outer bottle cap */}
      <rect x="36" y="8" width="28" height="12" rx="3" fill="#111" stroke="url(#dvGoldGrad)" strokeWidth="2" />
      <rect x="42" y="20" width="16" height="8" fill="url(#dvGoldGrad)" />
      {/* Bottle body */}
      <rect x="22" y="28" width="56" height="60" rx="6" fill="#080808" stroke="url(#dvGoldGrad)" strokeWidth="2.5" />
      {/* Letter V */}
      <path d="M35 40 L50 72 L65 40 H58 L50 60 L42 40 Z" fill="url(#dvGoldGrad)" />
      {/* Laurel leaves */}
      <circle cx="56" cy="48" r="2" fill="#FFD76A" />
      <circle cx="59" cy="53" r="2" fill="#FFD76A" />
      <circle cx="60" cy="59" r="2" fill="#FFD76A" />
    </svg>
  );

  // Horizontal Logo (Navbar, Invoices)
  if (variant === 'horizontal') {
    const heightMap = { sm: 'h-8 sm:h-9', md: 'h-10 sm:h-11', lg: 'h-14', xl: 'h-18' };
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {!imageError ? (
          <img
            src="/assets/logos/Logo2.png"
            alt="D’ Victor Fragancias"
            className={`${heightMap[size]} w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center gap-2.5">
            <SvgFallback s={size === 'sm' ? 32 : 40} />
            <div className="flex flex-col text-left">
              <span className="font-serif tracking-[0.2em] text-[#FAF7F0] font-bold text-base leading-none uppercase">
                D’ Victor
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-sans mt-1">
                Fragancias
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Monogram / Bottle Emblem only
  if (variant === 'monogram') {
    const sizeMap = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16', xl: 'h-24 w-24' };
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {!imageError ? (
          <img
            src="/assets/logos/Logo.png"
            alt="D’ Victor Monograma"
            className={`${sizeMap[size]} object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]`}
            onError={() => setImageError(true)}
          />
        ) : (
          <SvgFallback s={size === 'sm' ? 32 : size === 'lg' ? 64 : 44} />
        )}
      </div>
    );
  }

  // Primary Vertical / Formal Emblem Lockup
  const heightMap = { sm: 'h-20', md: 'h-28', lg: 'h-40', xl: 'h-52' };
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {!imageError ? (
        <img
          src="/assets/logos/Logo.png"
          alt="D’ Victor Fragancias"
          className={`${heightMap[size]} w-auto object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.25)]`}
          onError={() => setImageError(true)}
        />
      ) : (
        <>
          <SvgFallback s={size === 'sm' ? 40 : size === 'lg' ? 70 : 54} />
          <div className="mt-3 flex flex-col items-center">
            <h1 className="font-serif tracking-[0.25em] text-[#FAF7F0] font-semibold text-lg md:text-xl uppercase">
              D’ Victor
            </h1>
            {showSubtitle && (
              <span className="text-[10px] tracking-[0.32em] text-[#D4AF37] uppercase font-sans font-medium mt-0.5">
                Fragancias
              </span>
            )}
            <span className="text-[8px] tracking-[0.35em] text-[#B8B8B8] uppercase font-sans mt-0.5">
              Santo Domingo
            </span>
          </div>
        </>
      )}
    </div>
  );
};
