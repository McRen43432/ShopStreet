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

  // Check auth on mount
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
      if (current.role === 'admin') {
        setView('admin');
      }
    }
    fetchData();
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const fetchData = async () => {
    try {
      const [prodRes, newsRes, settingsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/news'),
        fetch('/api/settings')
      ]);
      
      const prodData = await prodRes.json();
      const newsData = await newsRes.json();
      const settingsData = await settingsRes.json();
      
      setProducts(prodData);
      setNews(newsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleLogin = (role: string, name: string, email: string) => {
    const user = { email, name, role };
    setIsAuthorized(true);
    setRole(role);
    setCurrentUser(user);
    
    // Add to users list if not exists
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

  const deleteProduct = async (id: string | number) => {
    console.log('App: deleteProduct called with ID:', id);
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete product');
      }
      
      console.log('App: Product deleted successfully on server, updating local state');
      setProducts(prev => prev.filter(p => {
        const match = p.id === id || String(p.id) === String(id);
        return !match;
      }));
      return true;
    } catch (err) {
      console.error('App: Error deleting product:', err);
      return false;
    }
  };

  const deleteNews = async (id: string | number) => {
    console.log('App: deleteNews called with ID:', id);
    try {
      const response = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete news');
      }
      
      console.log('App: News deleted successfully on server, updating local state');
      setNews(prev => prev.filter(n => {
        const match = n.id === id || String(n.id) === String(id);
        return !match;
      }));
      return true;
    } catch (err) {
      console.error('App: Error deleting news:', err);
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
      if (!isAuthorized) {
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

          {/* Featured Products */}
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

              {/* Grid: 3 cols mobile, 4 tablet, 5-6 desktop - compact for trending */}
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

          {/* Brand Story / Mission */}
          <section className="py-16 md:py-24 lg:py-28 bg-anthracite/20 border-y border-white/5">
            <div className="container-fluid">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Image */}
                <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden">
                  <img 
                    src="https://i.pinimg.com/736x/c7/52/2d/c7522d3b07a95033c1b9c16d20207569.jpg" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    alt="Streetplayer Lab"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 border-2 lg:border-4 border-neon/20 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="space-y-6 lg:space-y-8">
                  <div>
                    <span className="text-neon text-[11px] font-black tracking-[0.4em] uppercase block mb-4">Философия Бренда</span>
                    <h2 className="heading-large mb-6">
                      Эстетика Встречает Производительность
                    </h2>
                  </div>

                  <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium">
                    Мы верим, что одежда — это не просто ткань. Это инструмент, который меняет ваше восприятие себя. 
                    В Лаборатории Streetplayer мы объединяем передовые текстильные технологии с агрессивным дизайном, 
                    чтобы вы могли сосредоточиться только на одном — на своем результате.
                  </p>

                  {/* Stats Grid */}
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

          {/* Latest News */}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                    onClick={() => setView('news')}
                  >
                    <div className="aspect-video overflow-hidden mb-4 relative bg-anthracite/50">
                      <img 
                        src={post.image} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-ink/80 backdrop-blur px-2.5 md:px-3 py-1 text-[9px] md:text-[10px] font-black tracking-widest uppercase border border-white/10">
                        {post.date}
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-black tracking-tighter uppercase mb-3 group-hover:text-neon transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-xs md:text-sm leading-relaxed line-clamp-2 font-medium">
                      {post.excerpt}
                    </p>
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
            <div className="mb-10 md:mb-12">
              <h1 className="heading-hero mb-4">
                {selectedCategory ? `${selectedCategory}` : 'Каталог'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-white/50 uppercase font-bold tracking-widest text-[11px]">
                  Найдено {filteredProducts.length} товаров
                </p>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-neon text-xs font-black uppercase tracking-widest hover:text-white transition-colors text-left sm:text-right"
                  >
                    ← Показать все категории
                  </button>
                )}
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-white/20 text-2xl font-black uppercase">Ничего не найдено</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-6 text-neon text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </section>
      );
    }

    if (view === 'discounts') {
      return (
        <section className="py-16 md:py-24 px-6">
          <div className="container-fluid">
            <div className="mb-10 md:mb-12">
              <h1 className="heading-hero mb-4 text-red-500">Sale</h1>
              <p className="text-white/50 uppercase font-bold tracking-widest text-[11px]">
                Лучшие предложения сезона
              </p>
            </div>
            
            <div className="grid-products-catalog">
              {discountProducts.length > 0 ? (
                discountProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    compact
                    onAddToCart={addToCart}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))
              ) : (
                <div className="col-span-full py-24 text-center">
                  <p className="text-white/20 text-2xl font-black uppercase">Нет товаров со скидками</p>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (view === 'news') {
      return (
        <section className="py-16 md:py-24 px-6">
          <div className="container-fluid">
            <div className="mb-10 md:mb-12">
              <h1 className="heading-hero mb-4">Новости</h1>
              <p className="text-white/50 uppercase font-bold tracking-widest text-[11px]">
                Лаборатория Streetplayer: Исследования и релизы
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
              {news.map((post) => (
                <div key={post.id} className="group">
                  <div className="aspect-video overflow-hidden mb-4 md:mb-6 relative">
                    <img 
                      src={post.image} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-ink/80 backdrop-blur px-2.5 md:px-3 py-1 text-[9px] md:text-[10px] font-black tracking-widest uppercase border border-white/10">
                      {post.date}
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase mb-3 group-hover:text-neon transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-4 font-medium line-clamp-2">
                    {post.excerpt}
                  </p>
                  <button 
                    onClick={() => setSelectedNews(post)}
                    className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:text-neon transition-colors group/btn"
                  >
                    Читать полностью <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null;
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
      
      <main className="flex-grow pt-16 md:pt-20 lg:pt-16">
        {renderContent()}
      </main>

      {view !== 'admin' && (
        <footer className="bg-ink border-t border-white/5 py-10 md:py-12 lg:py-16 px-6">
          <div className="container-fluid">
            {/* Brand Section - Compact */}
            <div className="mb-8 md:mb-10">
              <div className="text-xl md:text-2xl font-black tracking-tighter mb-3">
                <span className="text-neon">STREETPLAYER</span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed max-w-sm mb-4 font-medium">
                Мы создаем экипировку для атлетов нового поколения. Технологии, эстетика и производительность.
              </p>
              <div className="flex gap-2">
                <a href="https://www.instagram.com/streetplayer.store?igsh=MXdkNnBkc2RtaHBtOA%3D%3D&utm_source=qr" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:bg-neon hover:text-ink hover:border-neon transition-all" title="Instagram"><Instagram size={16} /></a>
              <a href="https://wa.me/87082090312" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all" title="WhatsApp"><MessageCircle size={16} /></a>
             </div>
            </div>

            {/* Trust Bar */}
            <div className="mb-8 md:mb-10">
              <TrustBar />
            </div>

            {/* Footer Links Grid - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-white/5">
              {/* Categories */}
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/80">Категории</h4>
                <ul className="space-y-1.5 text-[10px] font-bold text-white/50 uppercase tracking-wide">
                  <li><button onClick={() => setView('catalog')} className="hover:text-neon transition-colors">Мужское</button></li>
                  <li><button onClick={() => setView('catalog')} className="hover:text-neon transition-colors">Женское</button></li>
                  <li><button onClick={() => setView('catalog')} className="hover:text-neon transition-colors">Аксессуары</button></li>
                  <li><button onClick={() => setView('catalog')} className="hover:text-neon transition-colors">Новинки</button></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/80">Поддержка</h4>
                <ul className="space-y-1.5 text-[10px] font-bold text-white/50 uppercase tracking-wide">
                  <li><a href="#" className="hover:text-neon transition-colors">Помощь</a></li>
                  <li><a href="#" className="hover:text-neon transition-colors">Доставка</a></li>
                  <li><a href="#" className="hover:text-neon transition-colors">Возврат</a></li>
                  <li><a href="#" className="hover:text-neon transition-colors">Контакты</a></li>
                </ul>
              </div>

              {/* Account */}
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/80">Аккаунт</h4>
                <div className="space-y-1.5 text-[10px] font-bold">
                  {isAuthorized ? (
                    <div className="flex flex-col gap-1.5">
                      <button 
                        onClick={() => {
                          const role = localStorage.getItem('aesthetix_role');
                          if (role === 'admin') setView('admin');
                        }} 
                        className="text-white/50 hover:text-neon transition-colors text-left uppercase tracking-wide"
                      >
                        {localStorage.getItem('aesthetix_role') === 'admin' ? 'Панель' : 'Кабинет'}
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-400 transition-colors text-left uppercase tracking-wide"
                      >
                        Выйти
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setView('login')} 
                      className="text-white/50 hover:text-neon transition-colors uppercase tracking-wide"
                    >
                      Вход
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-[8px] font-bold text-white/20 uppercase tracking-widest">
              <p>© 2025 STREETPLAYER. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
              <div className="flex gap-4 text-center md:text-right">
                <a href="#" className="hover:text-neon transition-colors">Политика конфиденциальности</a>
                <a href="#" className="hover:text-neon transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      )}

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart} 
      />

      <NewsModal 
        post={selectedNews} 
        onClose={() => setSelectedNews(null)} 
      />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </div>
  );
}
