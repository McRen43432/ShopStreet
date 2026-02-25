import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: { product: Product; quantity: number }[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    const phoneNumber = "87082090312";
    const itemsList = items.map(item => `${item.product.name} (x${item.quantity})`).join(', ');
    const message = `Здравствуйте! Хочу заказать: ${itemsList}. \n\nИтого: ${total} ₸`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-ink border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-neon" />
                <h2 className="text-lg font-black tracking-tighter uppercase">Ваша корзина</h2>
                <span className="text-xs text-white/40 font-bold">({items.length})</span>
              </div>
              <button onClick={onClose} className="hover:text-neon transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-white/10 mb-4" />
                  <p className="text-white/40 font-medium mb-6">Ваша корзина пуста</p>
                  <button 
                    onClick={onClose}
                    className="bg-white text-ink px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-neon transition-colors"
                  >
                    Начать покупки
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 group">
                    <div className="w-24 aspect-[3/4] bg-anthracite overflow-hidden">
                      {item.product.image ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-[8px] uppercase font-black">Нет фото</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-xs font-bold uppercase tracking-tight">{item.product.name}</h3>
                        <button onClick={() => onRemove(item.product.id)} className="text-white/40 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/40 uppercase font-bold mb-auto">{item.product.category}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-white/10 rounded-sm">
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:text-neon transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:text-neon transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-black">{item.product.price * item.quantity} ₸</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-anthracite/50 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Итого</span>
                  <span className="text-xl font-black">{total} ₸</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-neon text-ink py-4 text-xs font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 group"
                >
                  Оформить заказ <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-white/30 mt-4 uppercase tracking-tighter">
                  Бесплатная доставка от 10 000 ₸ • Безопасная оплата
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
