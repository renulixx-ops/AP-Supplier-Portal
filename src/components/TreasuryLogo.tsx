import React from 'react';

interface TreasuryLogoProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'emerald';
  showText?: boolean;
  tagline?: string;
}

/**
 * Modern minimalist Treasury Logo
 * Symbolizes connected financial liquidity, balanced capital flow,
 * visibility, and real-time treasury management.
 */
export const TreasuryLogo: React.FC<TreasuryLogoProps> = ({
  className = '',
  size = 32,
  variant = 'dark',
  showText = true,
  tagline,
}) => {
  const isDark = variant === 'dark';
  const isEmerald = variant === 'emerald';

  const markBg = isDark
    ? 'bg-[#101312] text-white border border-white/10'
    : isEmerald
    ? 'bg-[#183426] text-[#49D892] border border-[#49D892]/20'
    : 'bg-white text-[#101312] border border-slate-200 shadow-xs';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Financial Vector Mark */}
      <div
        style={{ width: size, height: size }}
        className={`relative rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 ${markBg}`}
      >
        <svg
          width={Math.round(size * 0.62)}
          height={Math.round(size * 0.62)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dual Interlocking Fluid Channels representing Inflow / Outflow & Liquidity Balance */}
          <path
            d="M3 6.5C3 4.567 4.567 3 6.5 3H10.5C12.433 3 14 4.567 14 6.5C14 8.433 12.433 10 10.5 10H7C4.79086 10 3 11.7909 3 14V17.5C3 19.433 4.567 21 6.5 21H10.5"
            stroke={isEmerald ? '#49D892' : isDark ? '#49D892' : '#183426'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M21 17.5C21 19.433 19.433 21 17.5 21H13.5C11.567 21 10 19.433 10 17.5C10 15.567 11.567 14 13.5 14H17C19.2091 14 21 12.2091 21 10V6.5C21 4.567 19.433 3 17.5 3H13.5"
            stroke={isDark ? '#FFFFFF' : '#101312'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Core Liquidity Pivot Node */}
          <circle
            cx="12"
            cy="12"
            r="2"
            fill={isEmerald ? '#49D892' : isDark ? '#49D892' : '#183426'}
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-[#101312]">
              TREASURY
            </span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
              OS
            </span>
          </div>
          {tagline && (
            <span className="text-[10px] text-slate-500 font-medium tracking-tight">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
