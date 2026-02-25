import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  onNavigate?: (view: 'catalog') => void;
  onCategorySelect?: (category: string) => void;
  products?: any[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate, onCategorySelect, products = [] }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'Мужское', image: 'https://i.pinimg.com/1200x/95/bb/f0/95bbf0349de28c623a2c11b144b8a967.jpg', count: `${products.filter(p => p.category === 'Мужское').length} товаров` },
    { name: 'Женское', image: 'https://i.pinimg.com/736x/39/bc/9f/39bc9f8e1b91eda0c433958542786e5d.jpg', count: `${products.filter(p => p.category === 'Женское').length} товаров` },
    { name: 'Аксессуары', image: 'https://i.pinimg.com/1200x/32/c3/88/32c38823cd5ced755232e32614436f1f.jpg', count: `${products.filter(p => p.category === 'Аксессуары').length} товаров` },
  ];

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else if (onNavigate) {
      onNavigate('catalog');
    } else {
      scrollToSection('trending');
    }
  };

  return (
    <section id="categories" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Наши <br /> <span className="text-neon">Коллекции</span></h2>
          <p className="text-white/40 max-w-md">Разработано для конкретных видов тренировок. Выбери свою дисциплину.</p>
        </div>
        <button 
          onClick={() => onNavigate ? onNavigate('catalog') : scrollToSection('trending')}
          className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-neon transition-colors group"
        >
          Смотреть весь каталог <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            onClick={() => handleCategoryClick(cat.name)}
            className="group relative aspect-[4/5] overflow-hidden cursor-pointer"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute bottom-8 left-8">
              <p className="text-[10px] font-bold text-neon uppercase tracking-[0.3em] mb-2">{cat.count}</p>
              <h3 className="text-3xl font-black tracking-tighter uppercase">{cat.name}</h3>
            </div>
            
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
