import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (role: string) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isRegister ? '/api/register' : '/api/login';
    const body = isRegister ? { email, password, name } : { email, password };
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.role, data.name, data.email);
      } else {
        setError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <button onClick={onBack} className="text-neon text-[10px] font-black uppercase tracking-[0.3em] mb-8 hover:text-white transition-colors">
            ← Вернуться в магазин
          </button>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            {isRegister ? 'Создать' : 'Вход в'} <span className="text-neon">{isRegister ? 'Аккаунт' : 'Систему'}</span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
            {isRegister ? 'Присоединяйтесь к сообществу Streetplayer' : 'Панель управления Streetplayer'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Имя</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full bg-anthracite border border-white/10 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-neon transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-anthracite border border-white/10 rounded-sm px-12 py-4 text-sm focus:outline-none focus:border-neon transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-anthracite border border-white/10 rounded-sm px-12 py-4 text-sm focus:outline-none focus:border-neon transition-colors"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-tighter bg-red-500/10 p-4 rounded-sm border border-red-500/20"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-tighter bg-green-500/10 p-4 rounded-sm border border-green-500/20"
            >
              <AlertCircle size={16} />
              {success}
            </motion.div>
          )}

          <button 
            type="submit"
            className="w-full bg-neon text-ink py-4 font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 group"
          >
            {isRegister ? 'Зарегистрироваться' : 'Войти'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center mt-8">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-neon transition-colors"
          >
            {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>

        <p className="text-center text-[10px] text-white/20 mt-12 uppercase font-bold tracking-widest">
          Забыли пароль? Обратитесь в IT-отдел Streetplayer
        </p>
      </motion.div>
    </div>
  );
};
