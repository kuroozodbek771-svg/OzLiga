import React, { useState } from 'react';
import { X, LogIn, UserPlus, KeyRound, Shield, Mail, Lock, User, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, switchAuthenticatedUser, currentUser, authToken } = useLeague();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('fan');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.message || "Email yoki parol noto'g'ri");
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await register(name, email, password, role);
      if (res.success) {
        setSuccessMsg("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.message || "Ro'yxatdan o'tishda xatolik");
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetRole: UserRole, defaultEmail: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await switchAuthenticatedUser(targetRole);
      setSuccessMsg(`${targetRole.toUpperCase()} profiliga kirildi`);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl safe-area-pb">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {mode === 'login' ? 'Tizimga Kirish' : "Ro'yxatdan O'tish"}
              </h3>
              <p className="text-[11px] text-slate-400">
                O'zLeague 2.0 • Role-Based Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Preset Accounts */}
        <div className="p-4 sm:p-5 bg-slate-950/40 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Tezkor sinov hisoblari (1-bosishda):
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">
              JWT Signed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin@ozleague.uz')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
            >
              <span className="block font-bold text-xs text-white group-hover:text-emerald-400">
                👑 Admin
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                admin@ozleague.uz
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('manager', 'manager@ozleague.uz')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-teal-950/30 border border-slate-800 hover:border-teal-500/50 text-left transition-all group"
            >
              <span className="block font-bold text-xs text-white group-hover:text-teal-400">
                👔 Menejer
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                manager@ozleague.uz
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('referee', 'referee@ozleague.uz')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <span className="block font-bold text-xs text-white group-hover:text-amber-400">
                🟨 Bosh Hakam
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                referee@ozleague.uz
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('fan', 'fan@ozleague.uz')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-blue-950/30 border border-slate-800 hover:border-blue-500/50 text-left transition-all group"
            >
              <span className="block font-bold text-xs text-white group-hover:text-blue-400">
                ⚽ Muxlis
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                fan@ozleague.uz
              </span>
            </button>
          </div>
        </div>

        {/* Tab switch (Login / Register) */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Kirish (Login)
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email manzili
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ozleague.uz"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Kirilmoqda...' : 'Tizimga kirish'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  To'liq ismingiz
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Sardor Aliyev"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sardor@example.uz"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Foydalanuvchi roli
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="fan">⚽ Muxlis (Fan)</option>
                  <option value="referee">🟨 Bosh Hakam (Referee)</option>
                  <option value="manager">👔 Liga Menejeri (Manager)</option>
                  <option value="admin">👑 Bosh Administrator (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Yaratilmoqda...' : 'Akkaunt yaratish'}</span>
              </button>
            </form>
          )}

          {/* Current Auth Status info */}
          <div className="pt-2 text-center text-[10px] text-slate-500">
            Hozirgi profil: <span className="text-slate-300 font-semibold">{currentUser.name}</span> •{' '}
            <span className="text-emerald-400 uppercase font-mono font-bold">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
