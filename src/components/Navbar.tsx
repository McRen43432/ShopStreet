import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User, Search, ChevronRight, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  onNavigate,
  onSearch,
  isAuthorized,
  role,
  currentUser,
  users,
  onSwitchUser,
  onLogout
}: { 
  cartCount: number, 
  onOpenCart: () => void, 
  onNavigate: (view: any) => void,
  onSearch: (query: string) => void,
  isAuthorized: boolean,
  role: string | null,
  currentUser: {email: string, name: string, role: string} | null,
  users: {email: string, name: string, role: string}[],
  onSwitchUser: (user: {email: string, name: string, role: string}) => void,
  onLogout: () => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileOpen && !(e.target as Element).closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Add class to body for CSS-based blocking
      document.body.classList.add('menu-open');
      // Block scroll on body and html
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      // Block touchmove on mobile
      const preventDefault = (e: Event) => e.preventDefault();
      document.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventDefault);
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (id: string, type: 'view' | 'scroll') => {
    if (type === 'view') {
      onNavigate(id);
    } else {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearch(e.target.value);
    if (e.target.value) {
      onNavigate('catalog');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 overflow-visible ${isMobileMenuOpen ? 'transition-none bg-black backdrop-blur-none py-2.5 md:py-3.5' : `transition-all duration-300 backdrop-blur-md lg:backdrop-blur-md ${isScrolled ? 'bg-ink/85 lg:bg-ink/60 border-b border-white/5 py-2.5 md:py-3.5' : 'bg-ink lg:bg-black/30 py-4 md:py-5 lg:py-5'}`}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white">
            <Menu size={24} />
          </button>
          <button onClick={() => onNavigate('home')} className="text-xl sm:text-2xl font-black tracking-tighter flex items-center gap-1">
            <span className="text-neon">STREETPLAYER</span>
          </button>
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] uppercase">
            <button onClick={() => handleNavClick('community', 'scroll')} className="hover:text-neon transition-colors">ГЛАВНАЯ СТРАНИЦА</button>
            <button onClick={() => handleNavClick('catalog', 'view')} className="hover:text-neon transition-colors">КАТАЛОГ</button>
            <button onClick={() => handleNavClick('discounts', 'view')} className="hover:text-red-500 transition-colors">СКИДКИ И АКЦИИ</button>
            <button onClick={() => handleNavClick('news', 'view')} className="hover:text-neon transition-colors">НОВОСТИ</button>
            {isAuthorized && role === 'admin' && (
              <button onClick={() => handleNavClick('admin', 'view')} className="hover:text-neon transition-colors">АДМИН ПАНЕЛЬ</button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-32 sm:w-48 md:w-64' : 'w-10'}`}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="absolute left-2 hover:text-neon transition-colors z-10"
            >
              <Search size={20} />
            </button>
            <input 
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="ПОИСК..."
              className={`w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[10px] font-bold tracking-widest focus:outline-none focus:border-neon transition-all ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
          </div>
          {isAuthorized && role === 'admin' ? (
            <button 
              onClick={() => onNavigate('admin')}
              className="hidden sm:flex items-center gap-2 bg-neon/10 text-neon px-3 py-1.5 rounded-sm border border-neon/20 hover:bg-neon hover:text-ink transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <LayoutDashboard size={14} />
              Админ
            </button>
          ) : (
              <div className="relative profile-dropdown">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="hidden sm:flex items-center gap-2 hover:text-neon transition-colors"
              >
                <User size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">{currentUser?.name}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-ink border border-white/10 rounded-sm shadow-lg z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs font-bold">{currentUser?.name}</p>
                    <p className="text-[10px] text-white/40">{currentUser?.email}</p>
                  </div>
                  {users.filter(u => u.email !== currentUser?.email).length > 0 && (
                    <div className="border-b border-white/10">
                      <p className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">Переключить аккаунт</p>
                      {users.filter(u => u.email !== currentUser?.email).map(user => (
                        <button
                          key={user.email}
                          onClick={() => {
                            onSwitchUser(user);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors"
                        >
                          {user.name} ({user.role})
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors text-neon"
                  >
                    + Добавить аккаунт
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors text-red-500"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={onOpenCart} className="relative group flex items-center gap-2">
            <ShoppingBag size={22} className="group-hover:text-neon transition-colors" />
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-neon text-ink text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Fixed Backdrop - Черный фон полностью */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000000',
                zIndex: 40,
                pointerEvents: 'auto'
              }}
            />
            {/* Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                backgroundColor: '#000000',
                position: 'fixed',
                left: 0,
                top: '4rem',
                bottom: 0,
                width: '100%',
                maxWidth: '28rem',
                zIndex: 50
              }}
              className="p-6 flex flex-col overflow-visible border-r border-white/5"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg md:text-xl font-black tracking-tighter text-neon">Меню</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Main Navigation */}
              <div className="flex flex-col gap-2 mb-8">
                <button onClick={() => handleNavClick('community', 'scroll')} className="flex items-center justify-between group text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <span className="text-sm md:text-base font-bold uppercase tracking-wide">ГЛАВНАЯ СТРАНИЦА</span>
                  <ChevronRight className="text-neon opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </button>
                <button onClick={() => handleNavClick('catalog', 'view')} className="flex items-center justify-between group text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <span className="text-sm md:text-base font-bold uppercase tracking-wide">КАТАЛОГ</span>
                  <ChevronRight className="text-neon opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </button>
                <button onClick={() => handleNavClick('discounts', 'view')} className="flex items-center justify-between group text-left px-4 py-3 rounded-lg hover:bg-red-500/10 transition-all duration-200">
                  <span className="text-sm md:text-base font-bold uppercase tracking-wide text-red-500">СКИДКИ И АКЦИИ</span>
                  <ChevronRight className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </button>
                <button onClick={() => handleNavClick('news', 'view')} className="flex items-center justify-between group text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <span className="text-sm md:text-base font-bold uppercase tracking-wide">НОВОСТИ</span>
                  <ChevronRight className="text-neon opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </button>
                {isAuthorized && role === 'admin' && (
                  <button onClick={() => handleNavClick('admin', 'view')} className="flex items-center justify-between group text-left px-4 py-3 rounded-lg hover:bg-neon/10 transition-all duration-200">
                    <span className="text-sm md:text-base font-bold uppercase tracking-wide text-neon">АДМИН ПАНЕЛЬ</span>
                    <ChevronRight className="text-neon opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0 mb-8" />

              {/* Footer Section */}
              <div className="mt-auto space-y-4">
                {/* Account Section */}
                {isAuthorized ? (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white font-bold text-xs mb-0.5">{currentUser?.name}</p>
                    <p className="text-[10px] text-white/50 mb-3">{currentUser?.email}</p>
                    
                    {users.filter(u => u.email !== currentUser?.email).length > 0 && (
                      <div className="mb-3 pb-3 border-b border-white/10">
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Переключить аккаунт</p>
                        {users.filter(u => u.email !== currentUser?.email).map(user => (
                          <button
                            key={user.email}
                            onClick={() => {
                              onSwitchUser(user);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-white/10 transition-colors"
                          >
                            {user.name}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }} 
                        className="flex-1 px-3 py-2 text-xs font-bold bg-neon/20 text-neon hover:bg-neon/30 rounded transition-colors uppercase tracking-wider"
                      >
                        + Аккаунт
                      </button>
                      <button 
                        onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} 
                        className="flex-1 px-3 py-2 text-xs font-bold bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded transition-colors uppercase tracking-wider"
                      >
                        Выйти
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }} 
                    className="w-full px-4 py-3 bg-neon text-ink font-bold rounded-lg hover:bg-white transition-colors uppercase tracking-wider text-xs"
                  >
                    Войти
                  </button>
                )}

                {/* Footer Links removed per spec */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
