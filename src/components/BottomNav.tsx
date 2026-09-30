import React from 'react';
import {
  Trophy,
  Calendar,
  Award,
  Shield,
  UserCheck,
  Database,
  Users,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { useLeague } from '../context/LeagueContext';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { matches, currentUser } = useLeague();
  const liveCount = matches.filter((m) => m.status === 'live').length;

  const dashboardTab: NavTab =
    currentUser.role === 'admin'
      ? 'admin'
      : currentUser.role === 'manager' || currentUser.role === 'league_manager'
      ? 'manager'
      : currentUser.role === 'referee'
      ? 'referee'
      : 'fan';

  const dashboardLabel =
    currentUser.role === 'admin'
      ? 'Admin'
      : currentUser.role === 'manager' || currentUser.role === 'league_manager'
      ? 'Menejer'
      : currentUser.role === 'referee'
      ? 'Hakamlik'
      : 'Muxlis';

  const navItems: { tab: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'home',
      label: 'Asosiy',
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      tab: 'matches',
      label: "O'yinlar",
      icon: <Calendar className="w-5 h-5" />,
      badge: liveCount,
    },
    {
      tab: 'standings',
      label: 'Jadval',
      icon: <Award className="w-5 h-5" />,
    },
    {
      tab: 'tournaments',
      label: 'Kubok',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
    },
    {
      tab: 'teams',
      label: 'Jamoalar',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      tab: 'players',
      label: "To'purar",
      icon: <Users className="w-5 h-5" />,
    },
    {
      tab: dashboardTab,
      label: dashboardLabel,
      icon: <UserCheck className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Mobil pastki navigatsiya"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 min-w-[44px] rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
