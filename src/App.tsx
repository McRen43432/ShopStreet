/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { TrustBar } from './components/TrustBar';
import { Cart } from './components/Cart';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductModal } from './components/ProductModal';
import { NewsModal } from './components/NewsModal';
import { PRODUCTS, BLOG_POSTS, Product, BlogPost } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Twitter, Youtube, Facebook, ArrowRight, MessageCircle } from 'lucide-react';

type View = 'home' | 'login' | 'admin' | 'catalog' | 'discounts' | 'news';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{email: string, name: string, role: string} | null>(null);
  const [users, setUsers] = useState<{email: string, name: string, role: string}[]>([]);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<BlogPost | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<any>({});

  // Инициализация данных при первом запуске
  useEffect(() => {
    const savedUsers = localStorage.getItem('streetplayer_users');
    const savedCurrent = localStorage.getItem('streetplayer_current');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrent) {
      const current = JSON.parse(savedCurrent);
      setCurrentUser(current);
      setIsAuthorized(true);
      setRole(current.role);
    }
    
    // Запускаем локальную загрузку данных
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // АВТОНОМНАЯ ЗАГРУЗКА (БЕЗ API)
  const fetchData = async () => {
    try {
      // Пытаемся взять данные из localStorage
      const localProducts = localStorage.getItem('sp_products');
      const localNews = localStorage.getItem('sp_news');
      const localSettings = localStorage.getItem('sp_settings');

      // Если в памяти пусто — берем данные из файла constants.ts, иначе из памяти
      const finalProducts = localProducts ? JSON.parse(localProducts) : PRODUCTS;
      const finalNews = localNews ? JSON.parse(localNews) : BLOG_POSTS;
      const finalSettings = localSettings ? JSON.parse(localSettings) : {};

      setProducts(finalProducts);
      setNews(finalNews);
      setSettings(finalSettings);

      // Сохраняем начальные данные в память, если их там не было
      if (!localProducts) localStorage.setItem('sp_products', JSON.stringify(PRODUCTS));
      if (!localNews) localStorage.setItem('sp_news', JSON.stringify(BLOG_POSTS));
    } catch (err) {
      console.error('Ошибка локальной загрузки:', err);
    }
  };

  const handleLogin = (role: string, name: string, email: string) => {
    const user = { email, name, role };
    setIsAuthorized(true);
    setRole(role);
    setCurrentUser(user);
    
    setUsers(prev => {
      const exists = prev.find(u => u.email === email);
      if (!exists) {
        const newUsers = [...prev, user];
        localStorage.setItem('streetplayer_users', JSON.stringify(newUsers));
        return newUsers;
      }
      return prev;
    });
    
    localStorage.setItem('streetplayer_current', JSON.stringify(user));
    
    if (role === 'admin') {
      setView('admin');
    } else {
      setView('home');
    }
  };

  const handleSwitchUser = (user: {email: string, name: string, role: string}) => {
    setCurrentUser(user);
    setIsAuthorized(true);
    setRole(user.role);
    localStorage.setItem('streetplayer_current', JSON.stringify(user));
    if (user.role === 'admin') {
      setView('admin');
    } else {
      setView('home');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setRole(null);
    setCurrentUser(null);
    localStorage.removeItem('streetplayer_current');
    setView('home');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setView('catalog');
  };

  // АВТОНОМНОЕ УДАЛЕНИЕ ТОВАРА
  const deleteProduct = async (id: string | number) => {
    try {
      const updatedProducts = products.filter(p => String(p.id) !== String(id));
      setProducts(updatedProducts);
      localStorage.setItem('sp_products', JSON.stringify(updatedProducts));
      return true;
    } catch (err) {
      console.error('Ошибка удаления товара:', err);
      return false;
    }
  };

  // АВТОНОМНОЕ УДАЛЕНИЕ НОВОСТЕЙ
  const deleteNews = async (id: string | number) => {
    try {
      const updatedNews = news.filter(n => String(n.id) !== String(id));
      setNews(updatedNews);
      localStorage.setItem('sp_news', JSON.stringify(updatedNews));
      return true;
    } catch (err) {
      console.error('Ошибка удаления новости:', err);
      return false;
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(p => p.status !== 'hidden' && (!selectedCategory || p.category === selectedCategory));

  const discountProducts = filteredProducts.filter(p => p.old_price && p.old_price > p.price);

  const renderContent = () => {
    if (view === 'login') {
      return <Login onLogin={handleLogin} onBack={() => setView('home')} />;
    }

    if (view === 'admin') {
      if (!isAuthorized || role !== 'admin') {
        return <Login onLogin={handleLogin} onBack={() => setView('home')} />;
      }
      return (
        <AdminDashboard 
          onLogout={handleLogout} 
          onRefresh={fetchData} 
          onDeleteProduct={deleteProduct}
          onDeleteNews={deleteNews}
          onNavigate={setView}
          products={products}
          news={news}
        />
      );
    }

    if (view === 'home') {
      return (
        <>
          <Hero settings={settings} onNavigate={setView} />
          <CategoryGrid onNavigate={(v) => setView(v)} onCategorySelect={handleCategorySelect} products={products} />

          <section id="trending" className="py-12 md:py-18 lg:py-20 px-6">
            <div className="container-fluid">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-12 mb-8 md:mb-10">
                <h2 className="heading-large">
                  В Тренде <br /> <span className="text-neon">Сейчас</span>
                </h2>
                <button 
                  onClick={() => setView('catalog')}
                  className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-neon transition-colors group whitespace-nowrap"
                >
                  Весь каталог <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid-products-trending">
                {filteredProducts.slice(0, 12).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    compact
                    onAddToCart={addToCart}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 lg:py-28 bg-anthracite/20 border-y border-white/5">
            <div className="container-fluid">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden">
                  <img 
                    src="https://i.pinimg.com/736x/c7/52/2d/c7522d3b07a95033c1b9c16d20207569.jpg" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    alt="Streetplayer Lab"
                  />
                  <div className="absolute inset-0 border-2 lg:border-4 border-neon/20 pointer-events-none" />
                </div>

                <div className="space-y-6 lg:space-y-8">
                  <div>
                    <span className="text-neon text-[11px] font-black tracking-[0.4em] uppercase block mb-4">Философия Бренда</span>
                    <h2 className="heading-large mb-6">Эстетика Встречает Производительность</h2>
                  </div>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium">
                    Мы верим, что одежда — это не просто ткань. Это инструмент, который меняет ваше восприятие себя.
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-3xl lg:text-4xl font-black tracking-tighter mb-1">100%</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Компрессия</p>
                    </div>
                    <div>
                      <p className="text-3xl lg:text-4xl font-black tracking-tighter mb-1">0%</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Отвлечений</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-20 lg:py-24 px-6">
            <div className="container-fluid">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-12 mb-8 md:mb-12">
                <h2 className="heading-large">
                  Streetplayer <br /> <span className="text-neon">Lab News</span>
                </h2>
                <button 
                  onClick={() => setView('news')}
                  className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-neon transition-colors group whitespace-nowrap"
                >
                  Все новости <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {news.slice(0, 2).map((post) => (
                  <motion.div 
                    key={post.id}
                    className="group cursor-pointer"
                    onClick={() => setView('news')}
                  >
                    <div className="aspect-video overflow-hidden mb-4 relative bg-anthracite/50">
                      <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={post.title} />
                      <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur px-3 py-1 text-[10px] font-black uppercase border border-white/10">
                        {post.date}
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase mb-3 group-hover:text-neon transition-colors">{post.title}</h3>
                    <p className="text-white/50 text-xs md:text-sm line-clamp-2">{post.excerpt}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      );
    }

    if (view === 'catalog') {
      return (
        <section className="py-16 md:py-24 px-6">
          <div className="container-fluid">
            <div className="mb-10">
              <h1 className="heading-hero mb-4">{selectedCategory || 'Каталог'}</h1>
              <div className="flex justify-between items-center">
                <p className="text-white/50 uppercase font-bold tracking-widest text-[11px]">Найдено {filteredProducts.length} товаров</p>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory(null)} className="text-neon text-xs font-black uppercase tracking-widest">← Все категории</button>
                )}
              </div>
            </div>
            
            <div className="grid-products-catalog">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  compact
                  onAddToCart={addToCart}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (view === 'discounts') {
      return (
        <section className="py-16 md:py-24 px-6">
          <div className="container-fluid">
            <h1 className="heading-hero mb-4 text-red-500">Sale</h1>
            <div className="grid-products-catalog">
              {discountProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact onAddToCart={addToCart} onClick={() => setSelectedProduct(product)} />
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (view === 'news') {
      return (
        <section className="py-16 md:py-24 px-6">
          <div className="container-fluid">
            <h1 className="heading-hero mb-12">Новости</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {news.map((post) => (
                <div key={post.id} className="group">
                  <div className="aspect-video overflow-hidden mb-6 relative">
                    <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={post.title} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black uppercase mb-3 group-hover:text-neon">{post.title}</h2>
                  <button onClick={() => setSelectedNews(post)} className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-neon">
                    Читать полностью <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      {view !== 'admin' && (
        <Navbar 
          cartCount={cartItems.length} 
          onOpenCart={() => setIsCartOpen(true)} 
          onNavigate={(v: View) => setView(v)}
          onSearch={setSearchQuery}
          isAuthorized={isAuthorized}
          role={role}
          currentUser={currentUser}
          users={users}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-grow pt-16">
        {renderContent()}
      </main>

      {view !== 'admin' && (
        <footer className="bg-ink border-t border-white/5 py-12 px-6">
          <div className="container-fluid">
            <div className="mb-10">
              <div className="text-2xl font-black tracking-tighter mb-3">
                <span className="text-neon">STREETPLAYER</span>
              </div>
              <p className="text-white/50 text-xs max-w-sm mb-4">Экипировка для атлетов нового поколения.</p>
              <div className="flex gap-2">
                <a href="https://www.instagram.com/streetplayer.store" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:bg-neon hover:text-ink transition-all"><Instagram size={16} /></a>
                <a href="https://wa.me/87082090312" target="_blank" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all"><MessageCircle size={16} /></a>
              </div>
            </div>

            <TrustBar />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-white/5">
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/80">Категории</h4>
                <ul className="space-y-1.5 text-[10px] font-bold text-white/50 uppercase">
                  <li><button onClick={() => setView('catalog')} className="hover:text-neon">Мужское</button></li>
                  <li><button onClick={() => setView('catalog')} className="hover:text-neon">Женское</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/80">Инфо</h4>
                <ul className="space-y-1.5 text-[10px] font-bold text-white/50 uppercase">
                  <li><a href="#" className="hover:text-neon">Доставка</a></li>
                  <li><a href="#" className="hover:text-neon">Возврат</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/80">Аккаунт</h4>
                <div className="space-y-1.5 text-[10px] font-bold uppercase">
                  {isAuthorized ? (
                    <button onClick={handleLogout} className="text-red-500">Выйти</button>
                  ) : (
                    <button onClick={() => setView('login')} className="text-white/50">Вход</button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
              <p>© 2026 STREETPLAYER. LABORATORY DIVISION.</p>
              <p>System Operational</p>
            </div>
          </div>
        </footer>
      )}

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      <NewsModal post={selectedNews} onClose={() => setSelectedNews(null)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
    </div>
  );
}