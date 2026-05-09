import React from 'react';
import logo from '../assets/logo.png';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F9F7F2]">
      <div className="relative flex items-center justify-center">
        
        {/* The "Flower Bloom" Animated Background Layers */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Petal Layer 1 */}
          <div className="absolute w-32 h-32 md:w-48 md:h-48 border border-[#A33B26]/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-bloom-slow" />
          {/* Petal Layer 2 */}
          <div className="absolute w-32 h-32 md:w-48 md:h-48 border border-[#C5A059]/30 rounded-[70%_30%_50%_50%/30%_60%_40%_70%] animate-bloom-fast" />
          {/* Petal Layer 3 */}
          <div className="absolute w-32 h-32 md:w-48 md:h-48 border border-[#A33B26]/10 rounded-[50%] animate-ping duration-[2000ms]" />
        </div>

        {/* The Logo: Scaling up and fading in quickly */}
        <div className="relative z-10 animate-logo-reveal">
          <img 
            src={logo} 
            alt="Somagoam Logo" 
            className="h-24 md:h-32 w-auto object-contain"
          />
        </div>
      </div>

      <style jsx="true">{`
        @keyframes bloom-slow {
          0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(180deg) scale(1.5); opacity: 0; }
        }

        @keyframes bloom-fast {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: rotate(-180deg) scale(1.8); opacity: 0; }
        }

        @keyframes logo-reveal {
          0% { transform: scale(0.8); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }

        .animate-bloom-slow {
          animation: bloom-slow 2s ease-out infinite;
        }

        .animate-bloom-fast {
          animation: bloom-fast 1.5s ease-in-out infinite;
        }

        .animate-logo-reveal {
          animation: logo-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}