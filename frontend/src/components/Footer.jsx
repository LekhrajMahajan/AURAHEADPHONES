import React from 'react';
import { Globe } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#0A0A0A] text-white px-6 py-16 md:py-24 md:px-16 relative z-20">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/10 pb-16 md:pb-20">
        <div className="flex-1">
          <h2 className="text-[2rem] md:text-[3.5rem] font-medium leading-[1.1] mb-12 md:mb-20 max-w-2xl text-white/90">
            Listen anywhere with total clarity and control
          </h2>
          <div className="flex items-center gap-6 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">
            <span className="w-6 md:w-10 h-[1px] bg-gray-600"></span>
            <span>For Inquiries</span>
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end text-left md:text-right gap-3 md:gap-4">
           <a href="#" className="text-xl md:text-3xl font-medium hover:text-white/60 transition-colors">support@auraheadphones.com</a>
           <a href="#" className="text-xl md:text-3xl font-medium hover:text-white/60 transition-colors">1-800-AURA-SND</a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-10 text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold gap-8">
        <div>©2026 AURAHEADPHONES. ALL RIGHTS RESERVED</div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <div className="flex items-center gap-3">
             DESIGNED BY <span className="text-white">Lekhraj Mahajan</span> <Globe className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
