import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  settings?: {
    hero_title?: string;
    hero_subtitle?: string;
  };
  onNavigate: (view: any) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onNavigate }) => {
  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center h-screen min-h-screen -mt-20 md:-mt-24">
      
      {/* --- ВОТ ЭТОТ БЛОК МЫ ЗАМЕНИЛИ --- */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width:768px)" srcSet="https://i.pinimg.com/736x/4f/6f/40/4f6f400c3fc3871386adcb9fcf6ec9f1.jpg" />
          <source media="(min-width:1024px)" srcSet="https://i.pinimg.com/736x/4f/6f/40/4f6f400c3fc3871386adcb9fcf6ec9f1.jpg" />
          <img 
            src="https://i.pinimg.com/736x/4f/6f/40/4f6f400c3fc3871386adcb9fcf6ec9f1.jpg" 
            // blur-[3px] делает фото размытым, как в том примере
            className="absolute inset-0 w-full h-full object-cover brightness-[0.55] saturate-110 contrast-105 blur-[3px]" 
            alt="Athlete training"
            referrerPolicy="no-referrer"
            loading="lazy"
            style={{ objectPosition: 'center' }}
          />
        </picture>
        {/* Дополнительный слой затемнения и матового размытия (glass effect) */}
        <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px]" />
        {/* Мягкий градиент снизу вверх для глубины */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      </div>
      {/* ---------------------------------- */}

      {/* Content */}
      <div className="relative z-20 container-fluid max-w-4xl px-6 py-4 md:py-8 transform -translate-y-10 md:-translate-y-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center"
        >
          {/* Badge */}
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-block py-1.5 px-3 bg-neon/20 border border-neon/40 text-neon text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase mb-6 md:mb-8 rounded-lg backdrop-blur-sm"
          >
            Новая коллекция: Apex Series
          </motion.span>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] mb-6 md:mb-8 max-w-4xl uppercase"
          >
            {settings?.hero_title || 'СОЗДАНО ДЛЯ РЕЗУЛЬТАТА'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs md:text-base lg:text-lg text-white/80 mb-8 md:mb-10 max-w-2xl leading-relaxed font-medium mx-auto"
          >
            {settings?.hero_subtitle || 'Высокотехнологичная компрессионная экипировка для тех, кто выходит за рамки возможного. Никаких отвлечений. Только прогресс.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          >
            <button 
              onClick={() => onNavigate('catalog')}
              className="bg-neon text-ink px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-black uppercase tracking-wider hover:bg-white transition-all duration-300 flex items-center justify-center md:justify-start gap-2 group rounded-lg"
            >
              Смотреть каталог <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('discounts')}
              className="border-2 border-white/30 hover:border-white hover:bg-white/5 px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 rounded-lg"
            >
              Скидки и акции
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5 hover:border-white transition-colors">
          <div className="w-0.5 h-1.5 bg-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};