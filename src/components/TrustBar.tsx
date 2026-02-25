import React, { useState } from 'react';
import { Tag, Truck, RotateCcw, Award, ChevronDown } from 'lucide-react';

export const TrustBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const items = [
    { icon: <Truck size={18} />, title: 'Доставка', desc: 'От 25 000 ₸' },
    { icon: <RotateCcw size={18} />, title: 'Возврат', desc: 'При браке' },
    { icon: <Tag size={18} />, title: 'Предзаказ', desc: '-15%' },
    { icon: <Award size={18} />, title: 'Качество', desc: 'Премиум' },
  ];

  return (
    <div className="border-y border-white/5 bg-anthracite/20">
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-5">
        {/* Desktop: Always visible */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 flex-1">
              <div className="text-white/60 hover:text-neon transition-colors flex-shrink-0">{item.icon}</div>
              <div className="text-left">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/60">{item.title}</p>
                <p className="text-[7px] text-white/30 uppercase font-bold">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Collapsible */}
        <div className="md:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between group py-1"
          >
            <div className="flex items-center gap-3 flex-1">
              {items.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="text-white/60 group-hover:text-neon transition-colors">{item.icon}</div>
                </div>
              ))}
            </div>
            <ChevronDown 
              size={18} 
              className={`text-white/40 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="mb-2 text-white/40">{item.icon}</div>
                  <h4 className="text-[8px] font-black uppercase tracking-widest mb-0.5">{item.title}</h4>
                  <p className="text-[7px] text-white/30 uppercase tracking-tighter font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
