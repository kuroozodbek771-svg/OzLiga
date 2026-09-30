import React, { useState } from 'react';
import {
  Trophy,
  Shield,
  Star,
  Flame,
  Calendar,
  Award,
  Bell,
  Heart,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { useLeague } from '../../context/LeagueContext';
import { Team, Player, Match } from '../../types';
import { NavTab } from '../../components/Navbar';

interface FanDashboardProps {
  onSelectTeam: (team: Team) => void;
  onSelectPlayer: (player: Player) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const FanDashboard: React.FC<FanDashboardProps> = ({
  onSelectTeam,
  onSelectPlayer,
  onNavigateTab,
}) => {
  const {
    currentUser,
    teams,
    players,
    matches,
    standings,
    favorites,
    toggleFavorite,
    isFavorite,
    notifications,
  } = useLeague();

  const [activeTab, setActiveTab] = useState<'favorites' | 'live' | 'standings' | 'scorers'>('favorites');

  const favoriteTeams = teams.filter((t) => favorites.includes(t.id));
  const liveMatches = matches.filter(
    (m) => m.status === 'live' || m.status === 'first_half' || m.status === 'second_half'
  );
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').slice(0, 4);

  // Top 5 scorers
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
            ⚽
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Muxlis Kabineti (Fan Hub)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Read-Only (Tomoshabin)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Xush kelibsiz, <strong className="text-slate-200">{currentUser.name}</strong>! O'yinlar natijalari, jonli hisoblar va sevimli jamoalaringiz dinamikasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('matches')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>O'yinlar taqvimi</span>
          </button>
        </div>
      </div>

      {/* Fan Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Sevimli Jamoalarim ({favoriteTeams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'live'
              ? 'bg-rose-500 text-white font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Jonli Hisoblar ({liveMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'standings'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Turnir Jadvali</span>
        </button>

        <button
          onClick={() => setActiveTab('scorers')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'scorers'
              ? 'bg-blue-500 text-white font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Oltin Butsa (To'purarlar)</span>
        </button>
      </div>

      {/* Tab: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
            <h3 className="font-extrabold text-base text-white mb-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Mening Sevimli Jamoalarim
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ushbu jamoalarning barcha o'yinlari va gollari haqida sizga birinchi bo'lib bildirishnoma yuboriladi
            </p>

            {favoriteTeams.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                Hozircha sevimli jamoalar tanlanmagan. Jamoalar bo'limidan ⭐ belgisini bosing!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteTeams.map((team) => {
                  const teamStanding = standings.find((s) => s.teamId === team.id);
                  const nextMatch = matches.find(
                    (m) =>
                      (m.homeTeamId === team.id || m.awayTeamId === team.id) &&
                      m.status === 'upcoming'
                  );

                  return (
                    <div
                      key={team.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-colors flex justify-between items-start"
                    >
                      <div
                        onClick={() => onSelectTeam(team)}
                        className="cursor-pointer group flex items-start gap-3 min-w-0"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-1 shrink-0 group-hover:scale-105 transition-transform">
                          {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            <Shield className="w-6 h-6 text-emerald-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                            {team.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {team.city} • {teamStanding?.points || 0} ochko ({teamStanding?.won || 0}G' - {teamStanding?.drawn || 0}D)
                          </p>
                          {nextMatch && (
                            <span className="inline-block mt-2 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Navbatdagi o'yin: {nextMatch.matchDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(team.id)}
                        className="p-2 text-amber-400 hover:text-slate-400 rounded-lg transition-colors"
                        title="Sevimlilardan chiqarish"
                      >
                        <Star className="w-5 h-5 fill-amber-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming matches */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
            <h3 className="font-extrabold text-base text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Yaqinlashib Kelayotgan O'yinlar
            </h3>
            <div className="space-y-3">
              {upcomingMatches.map((m) => {
                const home = teams.find((t) => t.id === m.homeTeamId);
                const away = teams.find((t) => t.id === m.awayTeamId);
                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">{m.matchDate}</span>
                      <h4 className="font-bold text-xs sm:text-sm text-white mt-0.5">
                        {home?.name} vs {away?.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">Stadion: {m.venue}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      Kutilmoqda
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Live Matches */}
      {activeTab === 'live' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h3 className="font-extrabold text-base text-white">Jonli Efir & Live Score</h3>
          </div>

          {liveMatches.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
              Hozirda faol jonli o'yin yo'q. Taqvimi ko'rish uchun O'yinlar bo'limiga o'ting.
            </div>
          ) : (
            <div className="space-y-3">
              {liveMatches.map((m) => {
                const home = teams.find((t) => t.id === m.homeTeamId);
                const away = teams.find((t) => t.id === m.awayTeamId);
                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {m.currentMinute || 45}' daqiqa • {m.status}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        {home?.name} <span className="text-emerald-400 font-mono">{m.homeScore} : {m.awayScore}</span> {away?.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{m.venue}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                      JONLI
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Standings */}
      {activeTab === 'standings' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-extrabold text-base text-white">Liga Turnir Jadvali</h3>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Jamoa</th>
                  <th className="py-2.5 px-2 text-center">O'</th>
                  <th className="py-2.5 px-2 text-center">G'</th>
                  <th className="py-2.5 px-2 text-center">D</th>
                  <th className="py-2.5 px-2 text-center">M</th>
                  <th className="py-2.5 px-2 text-center">TN</th>
                  <th className="py-2.5 px-3 text-center font-bold text-emerald-400">Ochko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {standings.slice(0, 8).map((st, i) => {
                  const t = teams.find((team) => team.id === st.teamId);
                  return (
                    <tr
                      key={st.id}
                      onClick={() => t && onSelectTeam(t)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono">{i + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">
                        {t?.name} {favorites.includes(st.teamId) && '⭐'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">{st.played}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{st.won}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{st.drawn}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{st.lost}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{st.goalsFor - st.goalsAgainst}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">
                        {st.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Scorers */}
      {activeTab === 'scorers' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-extrabold text-base text-white">Oltin Butsa — To'purarlar Poygasi</h3>
          <div className="space-y-3">
            {topScorers.map((player, idx) => {
              const team = teams.find((t) => t.id === player.teamId);
              return (
                <div
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-black inline-flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : idx === 1
                          ? 'bg-slate-500 text-white'
                          : idx === 2
                          ? 'bg-amber-800 text-amber-200'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{player.name}</h4>
                      <p className="text-xs text-slate-400">{team?.name} • #{player.jerseyNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-lg text-amber-400">{player.goals}</span>
                    <span className="block text-[10px] text-slate-500">{player.assists} assist</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
