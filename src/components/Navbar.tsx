import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Shield,
  Award,
  Database,
  Bot,
  UserCheck,
  RotateCcw,
  Search,
  KeyRound,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserRole } from '../types';

export type NavTab =
  | 'home'
  | 'matches'
  | 'standings'
  | 'tournaments'
  | 'teams'
  | 'players'
  | 'admin'
  | 'manager'
  | 'referee'
  | 'fan'
  | 'schema'
  | 'ai';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openAiModal: () => void;
  openSearchModal: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAiModal,
  openSearchModal,
  openAuthModal,
}) => {
  const {
    leagues,
    selectedLeagueId,
    setSelectedLeagueId,
    currentUser,
    switchAuthenticatedUser,
    logout,
    resetToDefault,
    matches,
  } = useLeague();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const liveMatchesCount = matches.filter(
    (m) =>
      m.status === 'live' ||
      m.status === 'first_half' ||
      m.status === 'second_half'
  ).length;

  const getUserDashboardTab = (): NavTab => {
    switch (currentUser.role) {
      case 'admin':
        return 'admin';
      case 'manager':
      case 'league_manager':
        return 'manager';
      case 'referee':
        return 'referee';
      case 'fan':
      case 'user':
      default:
        return 'fan';
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: '👑 Admin',
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        };
      case 'manager':
      case 'league_manager':
        return {
          label: '👔 Menejer',
          color: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
        };
      case 'referee':
        return {
          label: '🟨 Bosh Hakam',
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        };
      case 'fan':
      case 'user':
      default:
        return {
          label: '⚽ Muxlis',
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
        };
    }
  };

  const currentRoleBadge = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Top micro bar: League selector & real JWT Auth Account Switcher */}
      <div className="bg-slate-950/95 border-b border-slate-800/80 px-3 sm:px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          {/* League dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px] sm:text-xs">
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">Liga:</span>
            </span>
            <select
              value={selectedLeagueId}
              onChange={(e) => setSelectedLeagueId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-0.5 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer max-w-[130px] xs:max-w-[180px] sm:max-w-none truncate"
            >
              <option value="all">Barcha ligalar (Umumiy)</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name} ({league.region})
                </option>
              ))}
            </select>
          </div>

          {/* Real Authentication & Account Bar */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-[11px] transition-all"
              >
                <div className="w-5 h-5 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '👤'
                  )}
                </div>
                <span className="font-bold max-w-[90px] sm:max-w-[140px] truncate">
                  {currentUser.name}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded border text-[9px] font-bold uppercase tracking-wider ${currentRoleBadge.color}`}
                >
                  {currentRoleBadge.label}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Account Dropdown */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-fade-in text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Hisobni almashtirish (JWT):
                  </div>

                  <button
                    onClick={() => {
                      switchAuthenticatedUser('admin');
                      setIsAccountDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-slate-200 hover:text-white"
                  >
                    <span>👑 Azamat Berdiyev (Admin)</span>
                    {currentUser.role === 'admin' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchAuthenticatedUser('manager');
                      setIsAccountDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-slate-200 hover:text-white"
                  >
                    <span>👔 Dilshod Rahimqulov (Menejer)</span>
                    {(currentUser.role === 'manager' || currentUser.role === 'league_manager') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchAuthenticatedUser('referee');
                      setIsAccountDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-slate-200 hover:text-white"
                  >
                    <span>🟨 Ravshan Haydarov (Hakam)</span>
                    {currentUser.role === 'referee' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchAuthenticatedUser('fan');
                      setIsAccountDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left text-slate-200 hover:text-white"
                  >
                    <span>⚽ Otabek Mirzayev (Muxlis)</span>
                    {(currentUser.role === 'fan' || currentUser.role === 'user') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    )}
                  </button>

                  <div className="border-t border-slate-800 mt-2 pt-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        openAuthModal();
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-left flex items-center gap-2"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Boshqa login/parol kiritish</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsAccountDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Tizimdan chiqish</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Go to My Dashboard button */}
            <button
              onClick={() => setActiveTab(getUserDashboardTab())}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm"
              title="O'z rol kabinetingizga o'tish"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kabinetim</span>
            </button>

            {/* Reset DB button */}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Barcha ma'lumotlarni boshlang'ich holatga qaytarasizmi?"
                  )
                ) {
                  resetToDefault();
                }
              }}
              title="Boshlang'ich holatga qaytarish"
              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="text-xl sm:text-2xl">⚽</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Cabinet_Grotesk']">
                  O'z<span className="text-emerald-400">League</span>
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 sm:py-0.5 rounded">
                  2.0
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-400 font-medium">
                Futbol ekotizimi & Role Dashboards
              </p>
            </div>
          </div>

          {/* Desktop Tab links (>= lg screens) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Bosh sahifa
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'matches'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>O'yinlar</span>
              {liveMatchesCount > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'standings'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Turnir Jadvali</span>
            </button>

            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'tournaments'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Kubok / Pley-off</span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'teams'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Jamoalar</span>
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'players'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>O'yinchilar</span>
            </button>

            {/* Role Dashboards Link */}
            <button
              onClick={() => setActiveTab(getUserDashboardTab())}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                ['admin', 'manager', 'referee', 'fan'].includes(activeTab)
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-amber-400 hover:text-white hover:bg-slate-800/60 border border-amber-500/30'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="capitalize">
                {currentUser.role === 'admin'
                  ? 'Admin Paneli'
                  : currentUser.role === 'manager' || currentUser.role === 'league_manager'
                  ? 'Menejer Paneli'
                  : currentUser.role === 'referee'
                  ? 'Hakam Paneli'
                  : 'Muxlis Paneli'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'schema'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-blue-400" />
              <span>DB & API</span>
            </button>
          </nav>

          {/* Action buttons (Search, Notifications, AI) */}
          <div className="flex items-center gap-2">
            {/* Global Search Button */}
            <button
              onClick={openSearchModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs"
              title="Global Qidiruv"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline text-slate-400">Qidirish</span>
            </button>

            {/* Notifications Dropdown */}
            <NotificationsDropdown />

            {/* AI Assistant button */}
            <button
              onClick={openAiModal}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span>AI</span>
              <span className="hidden sm:inline">2.0</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
