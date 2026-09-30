import React, { useState } from 'react';
import {
  Users,
  Award,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { Player, PlayerPosition, Team } from '../types';

interface PlayersPageProps {
  onSelectPlayer?: (player: Player) => void;
  onSelectTeam?: (team: Team) => void;
}

export const PlayersPage: React.FC<PlayersPageProps> = ({
  onSelectPlayer,
  onSelectTeam,
}) => {
  const { players, teams, currentUser, addPlayer, getTeamById } = useLeague();

  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState<boolean>(false);

  // New Player Form
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState(teams[0]?.id || '');
  const [position, setPosition] = useState<PlayerPosition>('Hujumchi');
  const [age, setAge] = useState<number>(22);
  const [jerseyNumber, setJerseyNumber] = useState<number>(10);
  const [goals, setGoals] = useState<number>(0);
  const [assists, setAssists] = useState<number>(0);

  // Filtering
  const filteredPlayers = players.filter((player) => {
    if (positionFilter !== 'all' && player.position !== positionFilter) {
      return false;
    }
    if (teamFilter !== 'all' && player.teamId !== teamFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = player.name.toLowerCase().includes(q);
      const team = getTeamById(player.teamId)?.name.toLowerCase() || '';
      if (!matchName && !team.includes(q)) return false;
    }
    return true;
  });

  // Top 3 Podium
  const top3Scorers = [...players]
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 3);

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPlayer({
      name,
      teamId,
      position,
      age: Number(age) || 20,
      jerseyNumber: Number(jerseyNumber) || 7,
      goals: Number(goals) || 0,
      assists: Number(assists) || 0,
      yellowCards: 0,
      redCards: 0,
    });

    setName('');
    setIsAddPlayerOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            O'yinchilar & To'purarlar Reytingi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            "Oltin butsa" poygasi va o'yinchilar intizom statistikasi
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setIsAddPlayerOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi o'yinchi qo'shish</span>
          </button>
        )}
      </div>

      {/* Top 3 Podium: Responsive for Mobile & Desktop */}
      {top3Scorers.length >= 3 && (
        <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div className="text-center max-w-md mx-auto mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2.5 sm:px-3 py-1 rounded-full">
              🏆 Oltin Butsa — Top 3
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-6 items-end max-w-2xl mx-auto pt-2">
            {/* 2nd Place */}
            <div
              onClick={() => onSelectPlayer?.(top3Scorers[1])}
              className="flex flex-col items-center text-center cursor-pointer group hover:scale-[1.02] transition-transform"
            >
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-800 border-2 border-slate-400 p-1 flex items-center justify-center relative mb-1.5 shadow-md group-hover:border-slate-300">
                <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center shadow">
                  2
                </span>
                <span className="text-base sm:text-2xl">🥈</span>
              </div>
              <h4 className="font-bold text-[11px] sm:text-sm text-slate-100 group-hover:text-emerald-400 transition-colors truncate max-w-full">
                {top3Scorers[1]?.name}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-full">
                {getTeamById(top3Scorers[1]?.teamId)?.name.split(' ')[0]}
              </p>
              <div className="mt-1.5 py-2 sm:py-3 w-full bg-slate-800/80 rounded-t-xl border border-slate-700/60 text-center">
                <span className="text-base sm:text-xl font-black text-white font-mono">
                  {top3Scorers[1]?.goals}
                </span>
                <span className="block text-[9px] sm:text-[10px] text-slate-400">gol</span>
              </div>
            </div>

            {/* 1st Place */}
            <div
              onClick={() => onSelectPlayer?.(top3Scorers[0])}
              className="flex flex-col items-center text-center cursor-pointer group hover:scale-[1.03] transition-transform"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-amber-500/20 border-2 border-amber-400 p-1 flex items-center justify-center relative mb-1.5 shadow-xl shadow-amber-500/20 group-hover:border-amber-300">
                <span className="absolute -top-2.5 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg">
                  1
                </span>
                <span className="text-xl sm:text-3xl">🥇</span>
              </div>
              <h4 className="font-extrabold text-xs sm:text-base text-amber-300 group-hover:text-amber-200 transition-colors truncate max-w-full">
                {top3Scorers[0]?.name}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-full">
                {getTeamById(top3Scorers[0]?.teamId)?.name.split(' ')[0]}
              </p>
              <div className="mt-1.5 py-3 sm:py-5 w-full bg-gradient-to-t from-amber-950/40 to-slate-800/90 rounded-t-xl border border-amber-500/40 text-center shadow-md">
                <span className="text-xl sm:text-3xl font-black text-amber-400 font-mono">
                  {top3Scorers[0]?.goals}
                </span>
                <span className="block text-[9px] sm:text-[11px] text-amber-300 font-semibold truncate px-1">
                  gol • {top3Scorers[0]?.assists} pas
                </span>
              </div>
            </div>

            {/* 3rd Place */}
            <div
              onClick={() => onSelectPlayer?.(top3Scorers[2])}
              className="flex flex-col items-center text-center cursor-pointer group hover:scale-[1.02] transition-transform"
            >
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-amber-950/40 border-2 border-amber-700 p-1 flex items-center justify-center relative mb-1.5 shadow group-hover:border-amber-600">
                <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-700 text-white font-black text-[10px] sm:text-xs flex items-center justify-center shadow">
                  3
                </span>
                <span className="text-base sm:text-2xl">🥉</span>
              </div>
              <h4 className="font-bold text-[11px] sm:text-sm text-slate-100 group-hover:text-emerald-400 transition-colors truncate max-w-full">
                {top3Scorers[2]?.name}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-full">
                {getTeamById(top3Scorers[2]?.teamId)?.name.split(' ')[0]}
              </p>
              <div className="mt-1.5 py-2 w-full bg-slate-800/60 rounded-t-xl border border-slate-700/60 text-center">
                <span className="text-base sm:text-xl font-black text-white font-mono">
                  {top3Scorers[2]?.goals}
                </span>
                <span className="block text-[9px] sm:text-[10px] text-slate-400">gol</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters & Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
        {/* Position filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['all', 'Hujumchi', "O'rta", 'Himoyachi', 'Darvozabon'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPositionFilter(pos)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                positionFilter === pos
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {pos === 'all' ? 'Barchasi' : pos}
            </button>
          ))}
        </div>

        {/* Team filter dropdown & search */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Barcha jamoalar</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="O'yinchi yoki jamoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Players Full Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[540px] sm:min-w-full">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-semibold sticky top-0">
              <tr>
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">O'yinchi</th>
                <th className="py-3 px-3">Jamoa</th>
                <th className="py-3 px-2">Pozitsiya</th>
                <th className="py-3 px-2 text-center hidden sm:table-cell">Yoshi</th>
                <th className="py-3 px-3 text-center font-bold text-amber-400">
                  Gollar ⚽
                </th>
                <th className="py-3 px-2 text-center">Assistlar 👟</th>
                <th className="py-3 px-2 text-center">Kartochkalar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredPlayers
                .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
                .map((player, idx) => {
                  const team = getTeamById(player.teamId);
                  return (
                    <tr
                      key={player.id}
                      onClick={() => onSelectPlayer?.(player)}
                      className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-500 text-xs">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[11px] flex items-center justify-center border border-slate-700 shrink-0">
                            {player.jerseyNumber}
                          </span>
                          <span className="font-bold text-slate-100 truncate max-w-[130px] sm:max-w-none">
                            {player.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300 truncate max-w-[120px]">
                        {team?.name || 'Jamoa'}
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            player.position === 'Hujumchi'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : player.position === "O'rta"
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : player.position === 'Himoyachi'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {player.position}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-center font-mono text-slate-400 hidden sm:table-cell">
                        {player.age}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-black text-amber-400 text-sm sm:text-base bg-amber-500/5">
                        {player.goals}
                      </td>

                      <td className="py-3 px-2 text-center font-mono text-slate-300">
                        {player.assists}
                      </td>

                      <td className="py-3 px-2 text-center font-mono text-xs">
                        <span className="text-amber-400 font-bold">{player.yellowCards}🟨</span>
                        {' '}
                        <span className="text-rose-400 font-bold">{player.redCards}🟥</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Player Modal (Responsive) */}
      {isAddPlayerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl safe-area-pb">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 sticky top-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Yangi O'yinchi Qo'shish
              </h3>
              <button
                onClick={() => setIsAddPlayerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  O'yinchining to'liq ismi
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Eldor Shomurodov"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Qaysi jamoaga qo'shiladi?
                </label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pozitsiya
                  </label>
                  <select
                    value={position}
                    onChange={(e) =>
                      setPosition(e.target.value as PlayerPosition)
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Hujumchi">Hujumchi</option>
                    <option value="O'rta">O'rta (Yarim himoya)</option>
                    <option value="Himoyachi">Himoyachi</option>
                    <option value="Darvozabon">Darvozabon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Yoshi
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="50"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Raqami
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Gollar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={goals}
                    onChange={(e) => setGoals(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assistlar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={assists}
                    onChange={(e) => setAssists(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPlayerOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
