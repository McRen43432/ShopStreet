import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Check, Shield, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../constants';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/95 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            layoutId={`product-${product.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl bg-anthracite border border-white/10 overflow-hidden flex flex-col lg:flex-row max-h-[95vh] md:max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 bg-ink/50 backdrop-blur-md rounded-full text-white hover:text-neon transition-colors"
            >
              <X size={24} />
            </button>

            {/* Image Section */}
            <div className="h-64 sm:h-80 lg:h-auto lg:w-1/2 relative overflow-hidden bg-ink shrink-0">
              {product.image ? (
                <motion.img
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/5 text-xs uppercase font-black">Изображение отсутствует</div>
              )}
              {product.old_price && product.old_price > product.price && (
                <div className="absolute top-8 left-8 bg-red-500 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                  SALE -{Math.round((1 - product.price / product.old_price) * 100)}%
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="lg:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-black text-neon uppercase tracking-[0.3em]">{product.category}</span>
                  <div className="w-8 h-px bg-white/20" />
                  {product.isNew && <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">NEW DROP</span>}
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 leading-none">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-4 mb-10">
                  <span className="text-3xl font-black tracking-tighter text-white">
                    {product.price} ₸
                  </span>
                  {product.old_price && product.old_price > product.price && (
                    <span className="text-xl text-white/30 line-through font-bold tracking-tighter">
                      {product.old_price} ₸
                    </span>
                  )}
                </div>

                <div className="space-y-8 mb-12">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Описание</h4>
                    <p className="text-white/70 leading-relaxed text-sm">
                      {product.description || 'Высокотехнологичная экипировка Streetplayer, созданная для тех, кто не признает компромиссов. Каждая деталь спроектирована для максимальной эффективности.'}
                    </p>
                  </div>

                  {product.tech && product.tech.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Технологии</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {product.tech.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-bold text-white/60">
                            <Check size={14} className="text-neon" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 py-8 border-y border-white/5">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield size={20} className="text-white/20" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Гарантия качества</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Truck size={20} className="text-white/20" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Быстрая доставка</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <RotateCcw size={20} className="text-white/20" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">30 дней на возврат</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full bg-neon text-ink py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3 group"
                >
                  <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  Добавить в корзину
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
