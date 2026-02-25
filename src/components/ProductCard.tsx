import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../constants';
import { Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onClick?: (p: Product) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick, compact = false }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image Container - Компактнее */}
      <div 
        className={`relative overflow-hidden bg-anthracite mb-2 md:mb-3 rounded-md transition-all cursor-pointer ${compact ? 'aspect-[2.5/3]' : 'aspect-[3/4]'}`}
        onClick={() => onClick?.(product)}
      >
        {product.image ? (
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 text-[7px] uppercase font-black">Нет фото</div>
        )}
        
        {/* Badges - Компактнее */}
        <div className="absolute top-1 left-1 md:top-1.5 md:left-1.5 flex flex-col gap-0.5">
          {product.isNew && (
            <span className="bg-neon/90 text-ink text-[6px] md:text-[7px] font-black px-1 md:px-1.5 py-0.5 uppercase tracking-tighter rounded-xs">NEW</span>
          )}
          {product.old_price && product.old_price > product.price && (
            <span className="bg-red-500/90 text-white text-[6px] md:text-[7px] font-black px-1 md:px-1.5 py-0.5 rounded-xs">
              -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
            </span>
          )}
        </div>

        {/* Quick Actions - Desktop Hover только */}
        {!compact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-2 gap-1.5 hidden md:flex"
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(product);
              }}
              className="flex-1 bg-white/90 hover:bg-white text-ink py-1.5 rounded font-bold text-[8px] uppercase tracking-wider flex items-center justify-center gap-0.5 transition-all"
            >
              <Eye size={12} /> Просмотр
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 bg-neon hover:bg-white text-ink py-1.5 rounded font-bold text-[8px] uppercase tracking-wider flex items-center justify-center gap-0.5 transition-all"
            >
              <Plus size={12} /> В корзину
            </button>
          </motion.div>
        )}
      </div>

      {/* Info Section - Компактнее */}
      <div className="flex flex-col flex-grow">
        {!compact && (
          <p className="text-[7px] md:text-[8px] font-bold text-white/35 uppercase tracking-wider mb-0.5">{product.category}</p>
        )}
        
        <h3 
          className="text-[8px] md:text-[9px] font-bold tracking-tight group-hover:text-neon transition-colors uppercase line-clamp-2 mb-1.5 text-white flex-grow cursor-pointer"
          onClick={() => onClick?.(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1.5 md:mb-2">
          <p className="text-[9px] md:text-xs font-black text-neon">
            {product.price.toLocaleString()} ₸
          </p>
          {product.old_price && product.old_price > product.price && (
            <span className="text-[6px] md:text-[7px] text-white/25 line-through font-semibold">
              {product.old_price.toLocaleString()} ₸
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {compact ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-neon text-ink py-1 md:py-1.5 rounded font-bold text-[7px] md:text-[8px] uppercase tracking-wider hover:bg-white transition-all duration-300 flex items-center justify-center gap-0.5"
          >
            <Plus size={10} /> В корзину
          </button>
        ) : (
          <div className="md:hidden">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full bg-neon text-ink py-1.5 rounded font-bold text-[8px] uppercase tracking-wider hover:bg-white transition-all duration-300 flex items-center justify-center gap-0.5"
            >
              <Plus size={12} /> В корзину
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
