import React from 'react';
import {
  X,
  Shield,
  Star,
  MapPin,
  Users,
  Trophy,
  Calendar,
  Award,
} from 'lucide-react';
import { Team, Player } from '../types';
import { useLeague } from '../context/LeagueContext';

interface TeamProfileModalProps {
  team: Team | null;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
}

export const TeamProfileModal: React.FC<TeamProfileModalProps> = ({
  team,
  onClose,
  onSelectPlayer,
}) => {
  const {
    players,
    standings,
    matches,
    getLeagueById,
    toggleFavorite,
    isFavorite,
    getTeamById,
  } = useLeague();

  if (!team) return null;

  const league = getLeagueById(team.leagueId);
  const teamStanding = standings.find((s) => s.teamId === team.id);
  const teamPlayers = players.filter((p) => p.teamId === team.id);
  const isFav = isFavorite(team.id);

  // Recent matches
  const recentMatches = matches
    .filter(
      (m) =>
        (m.homeTeamId === team.id || m.awayTeamId === team.id) &&
        m.status === 'finished'
    )
    .slice(0, 3);

  // Next match
  const nextMatch = matches.find(
    (m) =>
      (m.homeTeamId === team.id || m.awayTeamId === team.id) &&
      m.status === 'upcoming'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl safe-area-pb">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-b border-slate-800 shrink-0">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(team.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFav
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isFav ? "Sevimli jamoalardan o'chirish" : "Sevimli jamoa qilish"}
            >
              <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center p-1 shadow-lg shrink-0">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Shield className="w-8 h-8 text-emerald-400" />
              )}
            </div>

            <div className="min-w-0 pr-16 sm:pr-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {league?.name || 'Liga'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 truncate">
                {team.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {team.city} • Stadion: {team.homeVenue || 'Markaziy'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          {/* Key Numbers */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-emerald-400 font-mono block">
                {teamStanding?.points || 0}
              </span>
              <span className="text-[10px] text-slate-400">Ochko</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-white font-mono block">
                {teamStanding?.won || 0}
              </span>
              <span className="text-[10px] text-slate-400">G'alaba</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-amber-400 font-mono block">
                {teamStanding?.drawn || 0}
              </span>
              <span className="text-[10px] text-slate-400">Durang</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-rose-400 font-mono block">
                {teamStanding?.lost || 0}
              </span>
              <span className="text-[10px] text-slate-400">Mag'lubiyat</span>
            </div>
          </div>

          {/* Form & Coach Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Bosh murabbiy:</span>
              <strong className="text-slate-200">{team.coach}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Oxirgi o'yinlar formasi:</span>
              <div className="flex items-center gap-1">
                {(teamStanding?.form || ['W', 'D', 'W']).map((f, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded text-[10px] font-bold inline-flex items-center justify-center ${
                      f === 'W'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : f === 'D'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Next Match Banner (if scheduled) */}
          {nextMatch && (
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 block">
                    Keyingi o'yin
                  </span>
                  <span className="text-slate-200 font-semibold">
                    vs{' '}
                    {getTeamById(
                      nextMatch.homeTeamId === team.id
                        ? nextMatch.awayTeamId
                        : nextMatch.homeTeamId
                    )?.name}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {nextMatch.matchDate}
              </span>
            </div>
          )}

          {/* Squad Roster */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                Jamoa Tarkibi ({teamPlayers.length} ta futbolchi)
              </h4>
            </div>

            <div className="space-y-1.5">
              {teamPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    onSelectPlayer(player);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded bg-slate-800 font-mono font-bold text-xs text-slate-300 flex items-center justify-center border border-slate-700">
                      {player.jerseyNumber}
                    </span>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-100 hover:text-emerald-400 transition-colors block">
                        {player.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {player.position} • {player.age} yosh
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-emerald-400 font-bold">
                      ⚽ {player.goals}
                    </span>
                    <span className="text-slate-400">
                      👟 {player.assists}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
