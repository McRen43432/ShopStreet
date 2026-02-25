import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { BlogPost } from '../constants';

interface NewsModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      {post && (
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
            layoutId={`post-${post.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-anthracite border border-white/10 max-h-[95vh] md:max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="fixed top-4 right-4 md:top-6 md:right-6 z-20 p-2 bg-ink/50 backdrop-blur-md rounded-full text-white hover:text-neon transition-colors"
            >
              <X size={24} />
            </button>

            {/* Image Section */}
            <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden bg-ink w-full">
              {post.image ? (
                <motion.img
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/5 text-xs uppercase font-black">Изображение отсутствует</div>
              )}
              <div className="absolute top-8 left-8 bg-neon text-ink text-xs font-black px-3 py-1 uppercase tracking-widest">
                {post.date}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8 leading-none">
                  {post.title}
                </h2>

                <div className="space-y-6">
                  <div>
                    <p className="text-white/70 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                      {post.content || post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <button
                    onClick={onClose}
                    className="bg-neon text-ink px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};