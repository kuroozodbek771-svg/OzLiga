import React from 'react';
import {
  Trophy,
  Users,
  Shield,
  Calendar,
  Flame,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { MatchCardItem } from '../components/MatchCardItem';
import { Match, Team, Player } from '../types';
import { NavTab } from '../components/Navbar';

interface HomePageProps {
  onNavigate: (tab: NavTab) => void;
  onOpenRefereeModal: (match: Match) => void;
  onSelectTeam?: (team: Team) => void;
  onSelectPlayer?: (player: Player) => void;
  onOpenTelegramModal?: (match: Match) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenRefereeModal,
  onSelectTeam,
  onSelectPlayer,
  onOpenTelegramModal,
}) => {
  const {
    leagues,
    teams,
    players,
    matches,
    standings,
    selectedLeagueId,
    getTeamById,
    getLeagueById,
  } = useLeague();

  const currentLeague = getLeagueById(selectedLeagueId) || leagues[0];

  const filteredMatches =
    selectedLeagueId === 'all'
      ? matches
      : matches.filter((m) => m.leagueId === selectedLeagueId);

  const liveMatches = filteredMatches.filter((m) => m.status === 'live');
  const upcomingMatches = filteredMatches
    .filter((m) => m.status === 'upcoming')
    .slice(0, 3);
  const finishedMatches = filteredMatches
    .filter((m) => m.status === 'finished')
    .slice(0, 3);

  const leagueStandings = standings
    .filter(
      (s) =>
        s.leagueId ===
        (selectedLeagueId === 'all' ? leagues[0]?.id : selectedLeagueId)
    )
    .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
    .slice(0, 5);

  const sortedPlayers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/20 p-4 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            O'zbekiston Havaskorlar & Mahalliy Futbol Platformasi
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-['Cabinet_Grotesk']">
            Mahalliy ligalar va derbilar —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              bitta tizimda
            </span>
          </h1>

          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            Toshkent, Vodiy, Samarqand va Buxoro mahalliy futbol ligalari: jonli hisoblar, o'yinchi statistikasi, avtomatik turnir jadvali hamda hakamlik paneli.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigate('matches')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>O'yinlar taqvimi</span>
            </button>

            <button
              onClick={() => onNavigate('standings')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 flex items-center gap-1.5 sm:gap-2 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Turnir Jadvali</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 font-semibold text-xs sm:text-sm border border-amber-500/30 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Hakamlik</span>
            </button>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-8 border-t border-slate-800/80">
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {leagues.length}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-emerald-400" />
              <span>Faol ligalar</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {teams.length}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-teal-400" />
              <span>Jamoalar</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {matches.length}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span>O'yinlar</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              {players.reduce((sum, p) => sum + p.goals, 0)}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Jami gollar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Hozirgi Jonli O'yinlar
              </h2>
            </div>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Barchasi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
            {liveMatches.map((match) => (
              <MatchCardItem
                key={match.id}
                match={match}
                onOpenRefereeModal={onOpenRefereeModal}
                onSelectTeam={onSelectTeam}
                onOpenTelegramModal={onOpenTelegramModal}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Grid: Standings Preview + Top Scorers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left 2 Cols: Standings Table Preview */}
        <section className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Turnir Jadvali — {currentLeague?.name || 'Premer Liga'}</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Ochko va to'plar nisbati bo'yicha peshqadamlar
              </p>
            </div>
            <button
              onClick={() => onNavigate('standings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 shrink-0"
            >
              To'liq <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[380px] sm:min-w-full">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-2 text-center w-8">#</th>
                  <th className="py-2.5 px-3">Jamoa</th>
                  <th className="py-2.5 px-2 text-center">O'</th>
                  <th className="py-2.5 px-2 text-center">G'</th>
                  <th className="py-2.5 px-2 text-center">D</th>
                  <th className="py-2.5 px-2 text-center">M</th>
                  <th className="py-2.5 px-2 text-center">TN</th>
                  <th className="py-2.5 px-3 text-center font-bold text-emerald-400">
                    O
                  </th>
                  <th className="py-2.5 px-2 text-center">Forma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leagueStandings.map((st, idx) => {
                  const team = getTeamById(st.teamId);
                  const goalDiff = st.goalsFor - st.goalsAgainst;

                  return (
                    <tr
                      key={st.id}
                      onClick={() => team && onSelectTeam?.(team)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-2 text-center font-bold text-slate-400">
                        <span
                          className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                            idx === 0
                              ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                              : idx === 1
                              ? 'bg-slate-700 text-slate-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-slate-800 overflow-hidden shrink-0 border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
                            {team?.logoUrl ? (
                              <img
                                src={team.logoUrl}
                                alt={team.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Shield className="w-3.5 h-3.5 m-auto text-emerald-400" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate max-w-[110px] sm:max-w-[180px]">
                            {team?.name || 'Jamoa'}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-2 text-center text-slate-300 font-mono">
                        {st.played}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-300 font-mono">
                        {st.won}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-300 font-mono">
                        {st.drawn}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-300 font-mono">
                        {st.lost}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">
                        <span
                          className={
                            goalDiff > 0
                              ? 'text-emerald-400'
                              : goalDiff < 0
                              ? 'text-rose-400'
                              : 'text-slate-400'
                          }
                        >
                          {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-sm text-emerald-400 bg-emerald-500/5">
                        {st.points}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                          {(st.form || ['W', 'D', 'W']).slice(-3).map((f, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded text-[9px] font-bold inline-flex items-center justify-center ${
                                f === 'W'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : f === 'D'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              }`}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right 1 Col: Top Scorers */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>To'purarlar — Oltin Butsa</span>
              </h3>
              <button
                onClick={() => onNavigate('players')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
              >
                Barchasi <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {sortedPlayers.map((player, index) => {
                const team = getTeamById(player.teamId);
                return (
                  <div
                    key={player.id}
                    onClick={() => onSelectPlayer?.(player)}
                    className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg text-xs font-black inline-flex items-center justify-center shrink-0 ${
                          index === 0
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : index === 1
                            ? 'bg-slate-600 text-white'
                            : index === 2
                            ? 'bg-amber-800 text-amber-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-100 group-hover:text-emerald-400 transition-colors truncate">
                          {player.name}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {team?.name.split(' ')[0]} • {player.position}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="font-black text-sm sm:text-base text-amber-400 font-mono">
                        {player.goals}
                      </span>
                      <span className="block text-[9px] text-slate-500">
                        {player.assists} pas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
            <span className="text-[11px]">Boshqaruv paneli</span>
            <button
              onClick={() => onNavigate('admin')}
              className="font-bold underline hover:text-emerald-200 text-[11px]"
            >
              Hakamlik
            </button>
          </div>
        </section>
      </div>

      {/* Upcoming & Recent Matches Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Fixtures */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Kutilayotgan o'yinlar taqvimi
            </h3>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Taqvim
            </button>
          </div>

          <div className="space-y-3">
            {upcomingMatches.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Rejalashtirilgan o'yinlar yo'q
              </p>
            ) : (
              upcomingMatches.map((match) => (
                <MatchCardItem
                  key={match.id}
                  match={match}
                  onOpenRefereeModal={onOpenRefereeModal}
                  onSelectTeam={onSelectTeam}
                  onOpenTelegramModal={onOpenTelegramModal}
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Yaqinda yakunlangan o'yinlar
            </h3>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Natijalar
            </button>
          </div>

          <div className="space-y-3">
            {finishedMatches.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Yakunlangan o'yinlar yo'q
              </p>
            ) : (
              finishedMatches.map((match) => (
                <MatchCardItem
                  key={match.id}
                  match={match}
                  onOpenRefereeModal={onOpenRefereeModal}
                  onSelectTeam={onSelectTeam}
                  onOpenTelegramModal={onOpenTelegramModal}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
