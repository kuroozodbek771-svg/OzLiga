import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Shield,
  Users,
  Trophy,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { Team, Player, League, Match } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (team: Team) => void;
  onSelectPlayer: (player: Player) => void;
  onSelectMatch: (match: Match) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  onSelectPlayer,
  onSelectMatch,
}) => {
  const { teams, players, leagues, matches, getTeamById, getLeagueById } =
    useLeague();
  const [query, setQuery] = useState('');

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingTeams = q
    ? teams.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.coach.toLowerCase().includes(q)
      )
    : [];

  const matchingPlayers = q
    ? players.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q) ||
          getTeamById(p.teamId)?.name.toLowerCase().includes(q)
      )
    : [];

  const matchingLeagues = q
    ? leagues.filter(
        (l) =>
          l.name.toLowerCase().includes(q) || l.region.toLowerCase().includes(q)
      )
    : [];

  const matchingMatches = q
    ? matches.filter((m) => {
        const home = getTeamById(m.homeTeamId)?.name.toLowerCase() || '';
        const away = getTeamById(m.awayTeamId)?.name.toLowerCase() || '';
        const venue = m.venue.toLowerCase();
        return home.includes(q) || away.includes(q) || venue.includes(q);
      })
    : [];

  const totalResults =
    matchingTeams.length +
    matchingPlayers.length +
    matchingLeagues.length +
    matchingMatches.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in pt-12 sm:pt-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jamoa, futbolchi, liga yoki o'yin qidirish (masalan: 'Navbahor', 'Aliyev')..."
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          {!q ? (
            <div className="py-10 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="text-xs">
                O'zLeague 2.0 bo'yicha global qidiruv. Klubi, futbolchisi yoki shahar nomini kiriting.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {['Navbahor', 'Bunyodkor', 'Aliyev', 'Toshkent', 'Chilonzor'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700/60"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold">
                "{query}" bo'yicha hech narsa topilmadi
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Imlo to'g'riligini tekshiring yoki boshqa kalit so'z bilan izlang.
              </p>
            </div>
          ) : (
            <>
              {/* Teams Results */}
              {matchingTeams.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Jamoalar ({matchingTeams.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchingTeams.map((team) => (
                      <div
                        key={team.id}
                        onClick={() => {
                          onSelectTeam(team);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700 shrink-0">
                            {team.logoUrl ? (
                              <img
                                src={team.logoUrl}
                                alt={team.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Shield className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                              {team.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {team.city} • Murabbiy: {team.coach}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Players Results */}
              {matchingPlayers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Futbolchilar ({matchingPlayers.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchingPlayers.map((player) => {
                      const team = getTeamById(player.teamId);
                      return (
                        <div
                          key={player.id}
                          onClick={() => {
                            onSelectPlayer(player);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-800 font-mono font-bold text-xs text-slate-300 flex items-center justify-center border border-slate-700">
                              #{player.jerseyNumber}
                            </span>
                            <div>
                              <span className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-400 transition-colors">
                                {player.name}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                {team?.name} • {player.position}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="text-amber-400 font-bold">
                              ⚽ {player.goals} gol
                            </span>
                            <span className="text-slate-400">
                              👟 {player.assists} pas
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matches Results */}
              {matchingMatches.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    O'yinlar ({matchingMatches.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchingMatches.map((m) => {
                      const home = getTeamById(m.homeTeamId);
                      const away = getTeamById(m.awayTeamId);
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            onSelectMatch(m);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
                            <span>{home?.name}</span>
                            <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                              {m.homeScore} : {m.awayScore}
                            </span>
                            <span>{away?.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                            {m.venue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
