import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Plus,
  Flame,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  X,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { MatchCardItem } from '../components/MatchCardItem';
import { Match, MatchStatus, Team } from '../types';

interface MatchesPageProps {
  onOpenRefereeModal: (match: Match) => void;
  onSelectTeam?: (team: Team) => void;
  onOpenTelegramModal?: (match: Match) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  onOpenRefereeModal,
  onSelectTeam,
  onOpenTelegramModal,
}) => {
  const {
    matches,
    leagues,
    teams,
    selectedLeagueId,
    setSelectedLeagueId,
    currentUser,
    addMatch,
    getTeamById,
  } = useLeague();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddMatchOpen, setIsAddMatchOpen] = useState<boolean>(false);

  // New Match Form State
  const [newLeagueId, setNewLeagueId] = useState<string>(
    selectedLeagueId !== 'all' ? selectedLeagueId : leagues[0]?.id || ''
  );
  const [newHomeTeamId, setNewHomeTeamId] = useState<string>('');
  const [newAwayTeamId, setNewAwayTeamId] = useState<string>('');
  const [newMatchDate, setNewMatchDate] = useState<string>('2025-05-25 18:00');
  const [newVenue, setNewVenue] = useState<string>('');
  const [newRefereeName, setNewRefereeName] = useState<string>('Ravshan Haydarov');

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    // League match
    if (selectedLeagueId !== 'all' && m.leagueId !== selectedLeagueId) {
      return false;
    }
    // Status match
    if (statusFilter !== 'all' && m.status !== statusFilter) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const home = getTeamById(m.homeTeamId)?.name.toLowerCase() || '';
      const away = getTeamById(m.awayTeamId)?.name.toLowerCase() || '';
      const venue = m.venue.toLowerCase();
      const q = searchQuery.toLowerCase();
      if (!home.includes(q) && !away.includes(q) && !venue.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const availableTeamsForLeague = teams.filter(
    (t) => t.leagueId === newLeagueId
  );

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomeTeamId || !newAwayTeamId) {
      alert("Ikkala jamoani ham tanlang!");
      return;
    }
    if (newHomeTeamId === newAwayTeamId) {
      alert("Bitta jamoa o'ziga qarshi o'ynay olmaydi!");
      return;
    }

    const homeTeam = getTeamById(newHomeTeamId);

    addMatch({
      leagueId: newLeagueId,
      homeTeamId: newHomeTeamId,
      awayTeamId: newAwayTeamId,
      matchDate: newMatchDate,
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      venue: newVenue || homeTeam?.homeVenue || 'Markaziy shahar stadioni',
      refereeName: newRefereeName,
    });

    setIsAddMatchOpen(false);
  };

  const liveCount = matches.filter((m) => m.status === 'live').length;
  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;
  const finishedCount = matches.filter((m) => m.status === 'finished').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title and Add Match CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-emerald-400" />
            O'yinlar Taqvimi & Natijalar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Barcha ligalar bo'yicha jonli hisoblar, taqvim va o'tgan turlar natijalari
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setIsAddMatchOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi o'yin belgilash</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Barchasi ({matches.length})
          </button>

          <button
            onClick={() => setStatusFilter('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              statusFilter === 'live'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Jonli ({liveCount})
          </button>

          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'upcoming'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kutilmoqda ({upcomingCount})
          </button>

          <button
            onClick={() => setStatusFilter('finished')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'finished'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yakunlangan ({finishedCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Jamoa yoki stadion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Match Cards Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">
            Mos keluvchi o'yinlar topilmadi
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Qidiruv so'zini o'zgartiring yoki boshqa liga va filtrni tanlang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMatches.map((match) => (
            <MatchCardItem
              key={match.id}
              match={match}
              onOpenRefereeModal={onOpenRefereeModal}
              onSelectTeam={onSelectTeam}
              onOpenTelegramModal={onOpenTelegramModal}
            />
          ))}
        </div>
      )}

      {/* Modal: Schedule new match (Admin) */}
      {isAddMatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Yangi O'yin Rejalashtirish
              </h3>
              <button
                onClick={() => setIsAddMatchOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ligani tanlang
                </label>
                <select
                  value={newLeagueId}
                  onChange={(e) => setNewLeagueId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mezbon Jamoa (Home)
                  </label>
                  <select
                    value={newHomeTeamId}
                    onChange={(e) => setNewHomeTeamId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Tanlang...</option>
                    {availableTeamsForLeague.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mehmon Jamoa (Away)
                  </label>
                  <select
                    value={newAwayTeamId}
                    onChange={(e) => setNewAwayTeamId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Tanlang...</option>
                    {availableTeamsForLeague
                      .filter((t) => t.id !== newHomeTeamId)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  O'yin sanasi va soati (YYYY-MM-DD HH:mm)
                </label>
                <input
                  type="text"
                  value={newMatchDate}
                  onChange={(e) => setNewMatchDate(e.target.value)}
                  placeholder="2025-05-25 18:30"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Stadion / Maydon (Venue)
                </label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="Masalan: Chilonzor 19-mavze stadioni"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bosh Hakam ismi (Referee)
                </label>
                <input
                  type="text"
                  value={newRefereeName}
                  onChange={(e) => setNewRefereeName(e.target.value)}
                  placeholder="Ravshan Haydarov"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMatchOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Taqvimga kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
