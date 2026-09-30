import React, { useState, useEffect } from 'react';
import { LeagueProvider, useLeague } from './context/LeagueContext';
import { Navbar, NavTab } from './components/Navbar';
import { LiveScoresTicker } from './components/LiveScoresTicker';
import { HomePage } from './pages/HomePage';
import { MatchesPage } from './pages/MatchesPage';
import { StandingsPage } from './pages/StandingsPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { TeamsPage } from './pages/TeamsPage';
import { PlayersPage } from './pages/PlayersPage';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { ManagerDashboard } from './pages/dashboards/ManagerDashboard';
import { RefereeDashboard } from './pages/dashboards/RefereeDashboard';
import { FanDashboard } from './pages/dashboards/FanDashboard';
import { ApiSchemaPage } from './pages/ApiSchemaPage';
import { RefereeMatchModal } from './components/RefereeMatchModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { TeamProfileModal } from './components/TeamProfileModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { TelegramPostModal } from './components/TelegramPostModal';
import { ForbiddenScreen } from './components/ForbiddenScreen';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { Match, Team, Player } from './types';
import { Terminal, Send, Search, Sparkles, LayoutDashboard } from 'lucide-react';

const AppContent: React.FC = () => {
  // Sync initial URL path
  const getTabFromPath = (): NavTab => {
    const p = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (
      [
        'admin',
        'manager',
        'referee',
        'fan',
        'matches',
        'standings',
        'tournaments',
        'teams',
        'players',
        'schema',
      ].includes(p)
    ) {
      return p as NavTab;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<NavTab>(() => getTabFromPath());
  const [activeRefereeMatch, setActiveRefereeMatch] = useState<Match | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [selectedTeamForProfile, setSelectedTeamForProfile] = useState<Team | null>(null);
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<Player | null>(null);
  const [telegramMatch, setTelegramMatch] = useState<Match | null>(null);

  const { matches, currentUser, isAuthModalOpen, setIsAuthModalOpen } = useLeague();

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    const newPath = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const getUserOwnDashboard = (): NavTab => {
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

  const handleSelectTickerMatch = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (match) {
      setActiveRefereeMatch(match);
    } else {
      setActiveTab('matches');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16 lg:pb-0">
      {/* Navbar with real JWT auth switcher & role badge */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiModal={() => setIsAiModalOpen(true)}
        openSearchModal={() => setIsSearchModalOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Live Scores Ticker */}
      <LiveScoresTicker onSelectMatch={handleSelectTickerMatch} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenRefereeModal={(match) => setActiveRefereeMatch(match)}
            onSelectTeam={(team) => setSelectedTeamForProfile(team)}
            onSelectPlayer={(player) => setSelectedPlayerForProfile(player)}
            onOpenTelegramModal={(match) => setTelegramMatch(match)}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesPage
            onOpenRefereeModal={(match) => setActiveRefereeMatch(match)}
            onSelectTeam={(team) => setSelectedTeamForProfile(team)}
            onOpenTelegramModal={(match) => setTelegramMatch(match)}
          />
        )}

        {activeTab === 'standings' && (
          <StandingsPage
            onSelectTeam={(team) => setSelectedTeamForProfile(team)}
          />
        )}

        {activeTab === 'tournaments' && <TournamentsPage />}

        {activeTab === 'teams' && (
          <TeamsPage
            onSelectTeam={(team) => setSelectedTeamForProfile(team)}
            onSelectPlayer={(player) => setSelectedPlayerForProfile(player)}
          />
        )}

        {activeTab === 'players' && (
          <PlayersPage
            onSelectPlayer={(player) => setSelectedPlayerForProfile(player)}
            onSelectTeam={(team) => setSelectedTeamForProfile(team)}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* ROLE-BASED DASHBOARDS & ROUTE PROTECTION                      */}
        {/* ------------------------------------------------------------- */}

        {/* 1. Admin Dashboard (/admin) */}
        {activeTab === 'admin' && (
          currentUser.role === 'admin' ? (
            <AdminDashboard
              onOpenRefereeModal={(match) => setActiveRefereeMatch(match)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          ) : (
            <ForbiddenScreen
              currentRole={currentUser.role}
              requiredRole="admin"
              onRedirectToMyDashboard={() => setActiveTab(getUserOwnDashboard())}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onGoHome={() => setActiveTab('home')}
            />
          )
        )}

        {/* 2. Manager Dashboard (/manager) */}
        {activeTab === 'manager' && (
          currentUser.role === 'manager' || currentUser.role === 'league_manager' || currentUser.role === 'admin' ? (
            <ManagerDashboard />
          ) : (
            <ForbiddenScreen
              currentRole={currentUser.role}
              requiredRole="manager"
              onRedirectToMyDashboard={() => setActiveTab(getUserOwnDashboard())}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onGoHome={() => setActiveTab('home')}
            />
          )
        )}

        {/* 3. Referee Dashboard (/referee) */}
        {activeTab === 'referee' && (
          currentUser.role === 'referee' || currentUser.role === 'admin' ? (
            <RefereeDashboard
              onOpenRefereeModal={(match) => setActiveRefereeMatch(match)}
            />
          ) : (
            <ForbiddenScreen
              currentRole={currentUser.role}
              requiredRole="referee"
              onRedirectToMyDashboard={() => setActiveTab(getUserOwnDashboard())}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onGoHome={() => setActiveTab('home')}
            />
          )
        )}

        {/* 4. Fan Dashboard (/fan) */}
        {activeTab === 'fan' && (
          <FanDashboard
            onSelectTeam={(team) => setSelectedTeamForProfile(team)}
            onSelectPlayer={(player) => setSelectedPlayerForProfile(player)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Database & API Documentation */}
        {activeTab === 'schema' && <ApiSchemaPage />}
      </main>

      {/* Global Modals */}
      <RefereeMatchModal
        match={activeRefereeMatch}
        onClose={() => setActiveRefereeMatch(null)}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen || activeTab === 'ai'}
        onClose={() => {
          setIsAiModalOpen(false);
          if (activeTab === 'ai') setActiveTab('home');
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTeam={(team) => {
          setSelectedTeamForProfile(team);
          setIsSearchModalOpen(false);
        }}
        onSelectPlayer={(player) => {
          setSelectedPlayerForProfile(player);
          setIsSearchModalOpen(false);
        }}
        onSelectMatch={(match) => {
          setActiveRefereeMatch(match);
          setIsSearchModalOpen(false);
        }}
      />

      <TeamProfileModal
        team={selectedTeamForProfile}
        onClose={() => setSelectedTeamForProfile(null)}
        onSelectPlayer={(player) => setSelectedPlayerForProfile(player)}
      />

      <PlayerProfileModal
        player={selectedPlayerForProfile}
        onClose={() => setSelectedPlayerForProfile(null)}
      />

      <TelegramPostModal
        match={telegramMatch}
        onClose={() => setTelegramMatch(null)}
      />

      {/* Real Authentication & Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 sm:py-8 text-xs text-slate-500 mb-14 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              ⚽
            </div>
            <span className="font-bold text-slate-300">
              O'z<span className="text-emerald-400">League</span>
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              v2.0 RBAC
            </span>
            <span>— O'zbekiston mahalliy va professional futbol ekotizimi</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Qidiruv</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab(getUserOwnDashboard())}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Kabinetim (/{getUserOwnDashboard()})</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('schema')}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>PostgreSQL & API Doc</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Yordamchi</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LeagueProvider>
      <AppContent />
    </LeagueProvider>
  );
}
