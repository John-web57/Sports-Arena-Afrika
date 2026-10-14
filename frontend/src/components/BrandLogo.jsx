import React from 'react';

/**
 * BrandLogo represents Option 2 (Dark Circular Badge):
 * - Circular midnight black medallion disc with concentric red & white borders
 * - African continent silhouette with red East Africa horn & dynamic speed streaks
 * - Bold athletic typography "SPORTS ARENA AFRIKA"
 * - Classic soccer ball base with circular news & analysis arc
 */
export default function BrandLogo({ size = 'default', showText = true, className = '' }) {
  // Dimension presets
  const sizeMap = {
    sm: { icon: 'w-9 h-9', text: 'text-sm', sub: 'text-[9px]' },
    default: { icon: 'w-11 h-11 sm:w-14 sm:h-14', text: 'text-sm sm:text-lg', sub: 'text-[9px] sm:text-[10px]' },
    lg: { icon: 'w-20 h-20', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-28 h-28', text: 'text-2xl sm:text-3xl', sub: 'text-sm' }
  };

  const current = sizeMap[size] || sizeMap.default;

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Option 2: Circular Medallion Emblem */}
      <div className={`relative ${current.icon} flex-shrink-0 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(225,6,0,0.55)] border border-[#E10600]/40 shadow-[0_4px_15px_rgba(0,0,0,0.8)]`}>
        <img
          src="/images/logo.png"
          alt="Sports Arena Afrika Logo"
          className="w-full h-full object-cover select-none pointer-events-none"
          onError={(e) => {
            // Fallback to jpg if png isn't cached
            e.currentTarget.src = '/images/logo.jpg';
          }}
        />
      </div>

      {/* Typography with Arena Red and Afrika Silver / Pure White */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className={`font-black tracking-tight text-white flex items-center gap-1 font-['Montserrat'] uppercase ${current.text}`}>
            <span>SPORTS</span>
            <span className="text-[#E10600] font-black">ARENA</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`font-black tracking-[0.28em] text-[#B3B3B3] uppercase font-['Montserrat'] ${current.sub}`}>
              AFRIKA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] inline-block animate-pulse"></span>
          </div>
        </div>
      )}
    </div>
  );
}

