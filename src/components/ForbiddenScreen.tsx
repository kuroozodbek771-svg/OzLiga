import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn, UserCheck, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface ForbiddenScreenProps {
  currentRole: UserRole;
  requiredRole: string;
  onRedirectToMyDashboard: () => void;
  onOpenAuthModal: () => void;
  onGoHome: () => void;
}

export const ForbiddenScreen: React.FC<ForbiddenScreenProps> = ({
  currentRole,
  requiredRole,
  onRedirectToMyDashboard,
  onOpenAuthModal,
  onGoHome,
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Bosh Administrator';
      case 'manager':
      case 'league_manager':
        return 'Liga Menejeri';
      case 'referee':
        return 'Bosh Hakam';
      case 'fan':
      case 'user':
      default:
        return 'Muxlis';
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg shadow-rose-950/40 animate-pulse">
          <ShieldAlert className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-rose-500/15 text-rose-400 border border-rose-500/30">
          403 — Kirish Taqiqlandi (Forbidden)
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-white mt-3">
          Ruxsat berilmagan hudud
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          Ushbu dashboard faqat <strong className="text-amber-400 capitalize">[{requiredRole}]</strong> huquqiga ega foydalanuvchilar uchun mo'ljallangan.
        </p>

        <div className="my-5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-left">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Sizning rolingiz:</span>
            <span className="font-bold text-rose-400 font-mono capitalize">
              {getRoleLabel(currentRole)} ({currentRole})
            </span>
          </div>
          <div className="flex justify-between items-center py-1 pt-2">
            <span className="text-slate-400">Talab qilingan daraja:</span>
            <span className="font-bold text-emerald-400 font-mono capitalize">
              {requiredRole.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onRedirectToMyDashboard}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
            <span>O'z kabinetimga o'tish (/{currentRole === 'user' ? 'fan' : currentRole === 'league_manager' ? 'manager' : currentRole})</span>
          </button>

          <button
            onClick={onOpenAuthModal}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span>Boshqa akkaunt bilan kirish (Login)</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Bosh sahifaga qaytish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
