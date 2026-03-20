import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { ACCORDION_DATA } from '../utils/data';

const FeatureAccordion = () => {
  const [activeItem, setActiveItem] = useState('anc');
  const activeData = ACCORDION_DATA.find(item => item.id === activeItem) || ACCORDION_DATA[0];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="border-b border-[#D6D5D0] pb-6 mb-10">
         <h4 className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">The Aura Advantage</h4>
      </div>
      
      <div className="w-full h-[40vh] md:h-[65vh] mb-12 overflow-hidden rounded-[20px] md:rounded-[40px] shadow-lg bg-[#F5F5F5]">
         <img 
           key={activeData.img} 
           src={activeData.img} 
           alt={activeData.title} 
           className="w-full h-full object-cover animate-[fade-in_0.5s_ease-out] mix-blend-multiply"
         />
      </div>

      <div className="flex flex-col">
        {ACCORDION_DATA.map((item) => (
          <div key={item.id} className="border-b border-[#D6D5D0]">
            <button 
              className="w-full py-6 md:py-8 flex justify-between items-center text-left group cursor-pointer"
              onClick={() => setActiveItem(item.id === activeItem ? null : item.id)}
            >
              <span className={`text-3xl md:text-[3.5rem] font-semibold transition-colors duration-300 tracking-tight ${activeItem === item.id ? 'text-[#1A1A1A]' : 'text-[#A8B0BB] group-hover:text-[#888D96]'}`}>
                {item.title}
              </span>
              <span className={`transition-transform duration-500 flex-shrink-0 ${activeItem === item.id ? 'text-[#1A1A1A]' : 'text-[#A8B0BB]'}`}>
                {activeItem === item.id ? <Minus className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} /> : <Plus className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />}
              </span>
            </button>
            <div 
              className={`grid transition-all duration-500 ease-in-out ${
                activeItem === item.id ? 'grid-rows-[1fr] opacity-100 pb-8 md:pb-10' : 'grid-rows-[0fr] opacity-0 pb-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-gray-500 text-base md:text-lg leading-relaxed md:w-4/5">{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureAccordion;