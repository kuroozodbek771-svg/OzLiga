import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Calendar,
  Shield,
  ChevronRight,
  Flame,
  CheckCircle,
  Plus,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { Tournament, TournamentBracketMatch } from '../types';

export const TournamentsPage: React.FC = () => {
  const {
    tournaments,
    teams,
    getTeamById,
    currentUser,
    updateTournamentMatchScore,
  } = useLeague();

  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    tournaments[0]?.id || ''
  );

  const activeTournament =
    tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  const canEdit =
    currentUser.role === 'admin' ||
    currentUser.role === 'referee' ||
    currentUser.role === 'league_manager';

  const [editingMatch, setEditingMatch] = useState<{
    tournamentId: string;
    roundId: string;
    match: TournamentBracketMatch;
    homeScore: number;
    awayScore: number;
  } | null>(null);

  const handleSaveScore = () => {
    if (!editingMatch) return;
    updateTournamentMatchScore(
      editingMatch.tournamentId,
      editingMatch.roundId,
      editingMatch.match.id,
      Number(editingMatch.homeScore),
      Number(editingMatch.awayScore)
    );
    setEditingMatch(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            Kubok & Pley-off (Play-off Bracket)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chorak final, yarim final va final bosqichlari to'ri (Play-off grid)
          </p>
        </div>

        {/* Tournament Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tournaments.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTournamentId(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTournament?.id === t.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Card Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              {activeTournament?.type || 'Knockout'}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              {activeTournament?.name}
            </h3>
            <p className="text-xs text-slate-400">
              Mavsum: {activeTournament?.season} • Holati: {activeTournament?.status}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <Award className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Bosh sovrin: <strong>O'zLeague Chempionlik Kubogi</strong></span>
        </div>
      </div>

      {/* Interactive Play-off Bracket */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-x-auto shadow-2xl">
        <h4 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
          <span>Pley-off bosqichlari sxemasi</span>
          <span className="text-xs font-normal text-slate-500">
            (Chorak finaldan Finalgacha)
          </span>
        </h4>

        <div className="min-w-[760px] grid grid-cols-3 gap-6 relative">
          {activeTournament?.rounds.map((round, roundIdx) => (
            <div key={round.id} className="space-y-4">
              <div className="text-center p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  {round.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {round.matches.length} ta o'yin
                </span>
              </div>

              <div
                className={`space-y-4 flex flex-col justify-around ${
                  roundIdx === 1 ? 'pt-8' : roundIdx === 2 ? 'pt-24' : ''
                }`}
              >
                {round.matches.map((bm) => {
                  const home = getTeamById(bm.homeTeamId);
                  const away = getTeamById(bm.awayTeamId);
                  const isHomeWinner = bm.winnerTeamId === bm.homeTeamId;
                  const isAwayWinner = bm.winnerTeamId === bm.awayTeamId;

                  return (
                    <div
                      key={bm.id}
                      className="bg-slate-950/90 rounded-2xl border border-slate-800 p-3 shadow-md hover:border-slate-700 transition-all space-y-2 relative"
                    >
                      {/* Home Team */}
                      <div
                        className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                          isHomeWinner
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-slate-900/60 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-5 h-5 rounded bg-slate-800 overflow-hidden shrink-0">
                            {home?.logoUrl && (
                              <img
                                src={home.logoUrl}
                                alt={home.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="text-xs truncate">{home?.name}</span>
                        </div>
                        <span className="font-mono font-bold text-xs ml-2">
                          {bm.homeScore !== undefined ? bm.homeScore : '-'}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div
                        className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                          isAwayWinner
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-slate-900/60 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-5 h-5 rounded bg-slate-800 overflow-hidden shrink-0">
                            {away?.logoUrl && (
                              <img
                                src={away.logoUrl}
                                alt={away.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="text-xs truncate">{away?.name}</span>
                        </div>
                        <span className="font-mono font-bold text-xs ml-2">
                          {bm.awayScore !== undefined ? bm.awayScore : '-'}
                        </span>
                      </div>

                      {/* Match footer */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span>{bm.matchDate || bm.date || 'Tarix belgilanmagan'}</span>
                        {canEdit && (
                          <button
                            onClick={() =>
                              setEditingMatch({
                                tournamentId: activeTournament.id,
                                roundId: round.id,
                                match: bm,
                                homeScore: bm.homeScore || 0,
                                awayScore: bm.awayScore || 0,
                              })
                            }
                            className="text-amber-400 hover:underline font-semibold"
                          >
                            Hisob kiritish
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Match Score Modal for Bracket */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">
              Pley-off o'yin hisobini yangilash
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {getTeamById(editingMatch.match.homeTeamId)?.name}
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingMatch.homeScore}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      homeScore: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {getTeamById(editingMatch.match.awayTeamId)?.name}
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingMatch.awayScore}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      awayScore: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingMatch(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveScore}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-xs text-slate-950 font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
