import React from 'react';
import { Activity } from 'lucide-react';

const AnimatedEqualizer = ({ scrollY }) => (
  <div className="w-24 md:w-32 h-[350px] md:h-[450px] border-4 border-white/60 rounded-[100px] p-6 flex items-end justify-center gap-2 relative shadow-lg bg-[#EAE8E3]/50 backdrop-blur-sm overflow-hidden">
    {[1, 2, 3, 4, 5].map((bar) => {
      const height = 20 + ((Math.sin(scrollY * 0.01 + bar) + 1) * 35); 
      return (
        <div key={bar} className="w-full bg-[#1A1A1A]/80 rounded-t-full rounded-b-sm transition-all duration-100 ease-out" style={{ height: `${height}%` }} />
      );
    })}
    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-[3px] border-[#1A1A1A]/20 flex items-center justify-center">
      <Activity className="w-4 h-4 text-[#1A1A1A]/50" />
    </div>
  </div>
);

export default AnimatedEqualizer;
