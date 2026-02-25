import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Newspaper, 
  Tag, 
  ShoppingCart, 
  Plus, 
  LogOut, 
  ChevronRight,
  Upload,
  Save,
  Trash2,
  Edit,
  ClipboardList,
  Store,
  X
} from 'lucide-react';

import { Product, BlogPost } from '../constants';

interface AdminDashboardProps {
  onLogout: () => void;
  onRefresh: () => Promise<void>;
  onDeleteProduct?: (id: string | number) => Promise<boolean>;
  onDeleteNews?: (id: string | number) => Promise<boolean>;
  onNavigate?: (view: any) => void;
  products: Product[];
  news: BlogPost[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  onRefresh, 
  onDeleteProduct,
  onDeleteNews,
  onNavigate,
  products, 
  news 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'news' | 'promos' | 'orders'>('products');
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editingPromoPrice, setEditingPromoPrice] = useState<{price: string, old_price: string}>({price: '', old_price: ''});
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    old_price: '', 
    status: 'active', 
    category: 'Мужское', 
    image: '', 
    description: '',
    tech: [] as string[]
  });
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', image: '', date: new Date().toLocaleDateString('ru-RU') });
  const [heroSettings, setHeroSettings] = useState({ hero_title: '', hero_subtitle: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewProduct({...newProduct, image: base64});
    };
    reader.readAsDataURL(file);
  };

  const handleNewsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewNews({...newNews, image: base64});
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    setIsPublishing(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      setNewProduct({ 
        name: '', 
        price: '', 
        old_price: '', 
        status: 'active', 
        category: 'Мужское', 
        image: '', 
        description: '',
        tech: []
      });
      setEditingId(null);
      onRefresh();
      alert(editingId ? 'Товар обновлен!' : 'Товар успешно опубликован!');
      setActiveTab('products');
    } catch (err) {
      alert('Ошибка при сохранении');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      old_price: product.old_price?.toString() || '',
      status: product.status || 'active',
      category: product.category,
      image: product.image,
      description: product.description,
      tech: product.tech
    });
    setEditingId(product.id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProduct({ 
      name: '', 
      price: '', 
      old_price: '', 
      status: 'active', 
      category: 'Мужское', 
      image: '', 
      description: '',
      tech: []
    });
  };

  const handleDeleteProduct = async (id: string | number) => {
    console.log('AdminDashboard: handleDeleteProduct called with ID:', id);
    try {
      let success = false;
      if (onDeleteProduct) {
        console.log('AdminDashboard: Calling onDeleteProduct prop');
        success = await onDeleteProduct(id);
      } else {
        console.log('AdminDashboard: Performing direct fetch DELETE');
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        success = response.ok;
      }

      if (success) {
        alert('Товар успешно удален');
        await onRefresh();
      } else {
        throw new Error('Delete operation returned false or failed');
      }
    } catch (err) {
      console.error('AdminDashboard: Delete error:', err);
      alert('Ошибка при удалении товара. Проверьте консоль.');
    }
  };

  const handleAddNews = async () => {
    if (!newNews.title) return;
    setIsPublishing(true);
    try {
      const method = editingNewsId ? 'PUT' : 'POST';
      const url = editingNewsId ? `/api/news/${editingNewsId}` : '/api/news';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNews)
      });
      
      setNewNews({ title: '', excerpt: '', image: '', date: new Date().toLocaleDateString('ru-RU') });
      setEditingNewsId(null);
      onRefresh();
      alert(editingNewsId ? 'Новость обновлена!' : 'Новость опубликована!');
    } catch (err) {
      alert('Ошибка при сохранении новости');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEditNewsClick = (item: BlogPost) => {
    setNewNews({
      title: item.title,
      excerpt: item.excerpt,
      image: item.image,
      date: item.date
    });
    setEditingNewsId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelNewsEdit = () => {
    setEditingNewsId(null);
    setNewNews({ title: '', excerpt: '', image: '', date: new Date().toLocaleDateString('ru-RU') });
  };

  const handleDeleteNews = async (id: string | number) => {
    console.log('AdminDashboard: handleDeleteNews called with ID:', id);
    try {
      let success = false;
      if (onDeleteNews) {
        console.log('AdminDashboard: Calling onDeleteNews prop');
        success = await onDeleteNews(id);
      } else {
        console.log('AdminDashboard: Performing direct fetch DELETE for news');
        const response = await fetch(`/api/news/${id}`, { method: 'DELETE' });
        success = response.ok;
      }

      if (success) {
        alert('Публикация успешно удалена');
        await onRefresh();
      } else {
        throw new Error('Delete operation for news returned false or failed');
      }
    } catch (err) {
      console.error('AdminDashboard: Delete news error:', err);
      alert('Ошибка при удалении новости. Проверьте консоль.');
    }
  };

  const handleUpdateSettings = async (key: string, value: string) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    onRefresh();
    alert('Настройки обновлены!');
  };

  const tabs = [
    { id: 'products', label: 'Товары', icon: <Package size={18} /> },
    { id: 'news', label: 'Новости', icon: <Newspaper size={18} /> },
    { id: 'promos', label: 'Акции', icon: <Tag size={18} /> },
    { id: 'orders', label: 'Заказы', icon: <ClipboardList size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-ink flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-anthracite border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">
        <div className="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center lg:block">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="text-neon">ADMIN</span> PANEL
          </div>
          <button 
            onClick={onLogout}
            className="lg:hidden text-red-500 p-2"
          >
            <LogOut size={20} />
          </button>
        </div>

        <nav className="p-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar">
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all whitespace-nowrap"
            >
              <Store size={18} />
              В магазин
            </button>
          )}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-neon text-ink' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button 
            onClick={onLogout}
            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
              {editingId ? 'Редактирование товара' : tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              {editingId ? `ID: ${editingId}` : 'Управление контентом магазина'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {onNavigate && (
              <button 
                onClick={() => onNavigate('home')}
                className="border border-white/10 text-white px-4 md:px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Store size={16} /> <span className="hidden sm:inline">На сайт</span>
              </button>
            )}
            {activeTab === 'products' && !editingId && (
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-ink px-4 md:px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-neon transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Добавить товар</span>
              </button>
            )}
          </div>
        </header>

        <div className="bg-anthracite/30 border border-white/5 rounded-sm p-6 lg:p-8">
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Название товара</label>
                    <input 
                      type="text" 
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Напр: APEX COMPRESSION TOP" 
                      className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Цена (₸)</label>
                      <input 
                        type="number" 
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="5500" 
                        className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Старая цена (₸)</label>
                      <input 
                        type="number" 
                        value={newProduct.old_price}
                        onChange={e => setNewProduct({...newProduct, old_price: e.target.value})}
                        placeholder="7500" 
                        className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Категория</label>
                      <select 
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon appearance-none"
                      >
                        <option>Мужское</option>
                        <option>Женское</option>
                        <option>Аксессуары</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Статус</label>
                      <select 
                        value={newProduct.status}
                        onChange={e => setNewProduct({...newProduct, status: e.target.value})}
                        className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon appearance-none"
                      >
                        <option value="active">Активен</option>
                        <option value="hidden">Скрыт</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Загрузить фото или ссылка (URL)</label>
                    <div className="space-y-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-bold file:bg-neon file:text-ink hover:file:bg-white"
                      />
                      <p className="text-[9px] text-white/40">- ИЛИ -</p>
                      <input 
                        type="text" 
                        value={newProduct.image}
                        onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                        placeholder="https://picsum.photos/..." 
                        className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon" 
                      />
                    </div>
                    {newProduct.image && (
                      <img src={newProduct.image} alt="preview" className="w-32 h-40 object-cover rounded-sm" />
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Описание товара</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Введите подробное описание товара..." 
                      rows={6}
                      className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Технические характеристики (через запятую)</label>
                    <input 
                      type="text"
                      value={newProduct.tech.join(', ')}
                      placeholder="85% Нейлон, 15% Эластан, Бесшовная технология" 
                      onChange={e => setNewProduct({...newProduct, tech: e.target.value.split(',').map(s => s.trim())})}
                      className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon" 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                {editingId && (
                  <button 
                    onClick={handleCancelEdit}
                    className="border border-white/10 text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Отмена
                  </button>
                )}
                <button 
                  onClick={handleAddProduct}
                  disabled={isPublishing}
                  className="bg-neon text-ink px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isPublishing ? 'Сохранение...' : (editingId ? 'Сохранить изменения' : 'Опубликовать товар')}
                </button>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5">
                <h3 className="text-lg font-black tracking-tighter uppercase mb-6">Список товаров</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Фото</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Название</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Цена</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Категория</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Статус</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-bold uppercase tracking-tighter">
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            {product.image ? (
                              <img src={product.image} className="w-10 h-10 object-cover" alt="" />
                            ) : (
                              <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-[8px] text-white/20">NO IMG</div>
                            )}
                          </td>
                          <td className="py-4">{product.name}</td>
                          <td className="py-4">{product.price} ₸</td>
                          <td className="py-4">{product.category}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black ${
                              product.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/40'
                            }`}>
                              {product.status === 'active' ? 'АКТИВЕН' : 'СКРЫТ'}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEditClick(product);
                                }}
                                className="p-2 text-neon hover:bg-neon/10 rounded-full transition-all"
                                title="Редактировать"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteProduct(product.id);
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                title="Удалить"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Заголовок публикации</label>
                <input 
                  type="text" 
                  value={newNews.title}
                  onChange={e => setNewNews({...newNews, title: e.target.value})}
                  placeholder="Напр: НОВЫЙ ДРОП: STEALTH SERIES" 
                  className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Загрузить фото или ссылка (URL)</label>
                <div className="space-y-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleNewsImageUpload}
                    className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-bold file:bg-neon file:text-ink hover:file:bg-white"
                  />
                  <p className="text-[9px] text-white/40">- ИЛИ -</p>
                  <input 
                    type="text" 
                    value={newNews.image}
                    onChange={e => setNewNews({...newNews, image: e.target.value})}
                    placeholder="https://picsum.photos/..." 
                    className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon" 
                  />
                </div>
                {newNews.image && (
                  <img src={newNews.image} alt="preview" className="w-full h-32 object-cover rounded-sm" />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Текст публикации</label>
                <textarea 
                  rows={10} 
                  value={newNews.excerpt}
                  onChange={e => setNewNews({...newNews, excerpt: e.target.value})}
                  placeholder="Введите текст новости..." 
                  className="w-full bg-ink border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-neon resize-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                {editingNewsId && (
                  <button 
                    onClick={handleCancelNewsEdit}
                    className="border border-white/10 text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Отмена
                  </button>
                )}
                <button 
                  onClick={handleAddNews}
                  disabled={isPublishing}
                  className="bg-neon text-ink px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? 'Сохранение...' : (editingNewsId ? 'Сохранить изменения' : 'Опубликовать')}
                </button>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5">
                <h3 className="text-lg font-black tracking-tighter uppercase mb-6">Список новостей</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Дата</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Заголовок</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-bold uppercase tracking-tighter">
                      {news.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 text-white/40">{item.date}</td>
                          <td className="py-4">{item.title}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEditNewsClick(item);
                                }}
                                className="p-2 text-neon hover:bg-neon/10 rounded-full transition-all"
                                title="Редактировать"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteNews(item.id);
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                title="Удалить"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'promos' && (
            <div className="space-y-8">
              <h3 className="text-xl font-black tracking-tighter uppercase mb-8">Управление Скидками на Товары</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40">Товар</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40">Текущая цена</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40">Старая цена</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-white/10">
                        <td className="px-4 py-3 text-sm">{product.name}</td>
                        <td className="px-4 py-3 text-sm">{product.price} ₸</td>
                        <td className="px-4 py-3 text-sm text-yellow-400">{product.old_price ? `${product.old_price} ₸` : 'Нет'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {editingPromoId === product.id ? (
                              <div className="flex gap-2">
                                <input 
                                  type="number" 
                                  value={editingPromoPrice.price}
                                  onChange={e => setEditingPromoPrice({...editingPromoPrice, price: e.target.value})}
                                  placeholder="Новая цена" 
                                  className="w-32 bg-ink border border-white/10 px-2 py-1 text-sm focus:outline-none focus:border-neon"
                                />
                                <input 
                                  type="number" 
                                  value={editingPromoPrice.old_price}
                                  onChange={e => setEditingPromoPrice({...editingPromoPrice, old_price: e.target.value})}
                                  placeholder="Старая цена" 
                                  className="w-32 bg-ink border border-white/10 px-2 py-1 text-sm focus:outline-none focus:border-neon"
                                />
                                <button 
                                  onClick={async () => {
                                    try {
                                      await fetch(`/api/products/${product.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          ...product,
                                          price: parseInt(editingPromoPrice.price),
                                          old_price: editingPromoPrice.old_price ? parseInt(editingPromoPrice.old_price) : null
                                        })
                                      });
                                      setEditingPromoId(null);
                                      onRefresh();
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className="p-1 bg-neon text-ink rounded hover:bg-white transition-colors"
                                  title="Сохранить"
                                >
                                  <Save size={16} />
                                </button>
                                <button 
                                  onClick={() => setEditingPromoId(null)}
                                  className="p-1 text-white/50 hover:text-white transition-colors"
                                  title="Отмена"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setEditingPromoId(product.id);
                                  setEditingPromoPrice({price: product.price.toString(), old_price: product.old_price?.toString() || ''});
                                }}
                                className="p-2 text-neon hover:bg-neon/10 rounded-full transition-all"
                                title="Редактировать"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">ID</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Клиент</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Товар</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Сумма</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Статус</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold uppercase tracking-tighter">
                  {[
                    { id: '#8492', client: 'Ринат К.', item: 'Apex Top (M)', price: '5500 ₸', status: 'Оплачено' },
                    { id: '#8491', client: 'Анна С.', item: 'Kinetic Leggings (S)', price: '6200 ₸', status: 'В обработке' },
                    { id: '#8490', client: 'Иван П.', item: 'Titan Belt', price: '3800 ₸', status: 'Отправлено' },
                  ].map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-white/40">{order.id}</td>
                      <td className="py-4">{order.client}</td>
                      <td className="py-4">{order.item}</td>
                      <td className="py-4">{order.price}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-[2px] text-[8px] font-black ${
                          order.status === 'Оплачено' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'В обработке' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
