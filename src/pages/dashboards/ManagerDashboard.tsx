import React, { useState } from 'react';
import {
  Shield,
  Users,
  Calendar,
  Award,
  Plus,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
  Search,
  Lock,
} from 'lucide-react';
import { useLeague } from '../../context/LeagueContext';
import { Team, Player, PlayerPosition } from '../../types';

export const ManagerDashboard: React.FC = () => {
  const {
    currentUser,
    leagues,
    teams,
    players,
    matches,
    standings,
    addPlayer,
    getTeamById,
    getLeagueById,
  } = useLeague();

  // Manager is scoped to his assigned leagues/teams
  const assignedLeagueIds = currentUser.managedLeagueIds || ['league-tpl'];
  const assignedTeamIds = currentUser.managedTeamIds || ['team-sherlar', 'team-chilonzor'];

  const managerLeagues = leagues.filter((l) => assignedLeagueIds.includes(l.id));
  const managerTeams = teams.filter(
    (t) => assignedTeamIds.includes(t.id) || assignedLeagueIds.includes(t.leagueId)
  );

  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    managerTeams[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<'teams' | 'players' | 'matches' | 'standings' | 'stats'>('teams');

  // New Player Form State
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number>(10);
  const [position, setPosition] = useState<PlayerPosition>('Hujumchi');
  const [playerAge, setPlayerAge] = useState<number>(22);
  const [targetTeamId, setTargetTeamId] = useState<string>(managerTeams[0]?.id || '');

  const currentTeam = teams.find((t) => t.id === selectedTeamId) || managerTeams[0];
  const currentTeamPlayers = players.filter((p) => p.teamId === currentTeam?.id);

  // Filter matches for manager's teams
  const managerMatches = matches.filter(
    (m) =>
      assignedTeamIds.includes(m.homeTeamId) ||
      assignedTeamIds.includes(m.awayTeamId) ||
      assignedLeagueIds.includes(m.leagueId)
  );

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !targetTeamId) return;

    addPlayer({
      name: playerName,
      teamId: targetTeamId,
      position,
      age: playerAge,
      jerseyNumber,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    });

    setPlayerName('');
    setIsAddPlayerOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center font-black text-xl shadow-lg shadow-teal-500/20">
            👔
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Liga va Jamoa Menejeri Kabineti
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-400 border border-teal-500/30">
                Cheklangan Ruxsat (Scoped)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Menejer: <strong className="text-slate-200">{currentUser.name}</strong> • Faqat biriktirilgan ligalar ({managerLeagues.map(l => l.name).join(', ')}) va jamoalarni boshqarish
            </p>
          </div>
        </div>

        {/* Scope restriction badge */}
        <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px]">
            Admin va tizim sozlamalariga kirish bloklangan
          </span>
        </div>
      </div>

      {/* Quick KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Biriktirilgan Jamoalar</span>
          <span className="text-2xl font-black text-teal-400 font-mono">{managerTeams.length}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Nazorat ostida</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Jami O'yinchilar</span>
          <span className="text-2xl font-black text-white font-mono">
            {players.filter((p) => managerTeams.some((t) => t.id === p.teamId)).length}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1">Litsenziyalangan</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">O'yinlar Kalendari</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{managerMatches.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Rejalashtirilgan</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Kiritilgan Gollar</span>
          <span className="text-2xl font-black text-white font-mono">
            {players
              .filter((p) => managerTeams.some((t) => t.id === p.teamId))
              .reduce((sum, p) => sum + p.goals, 0)}
          </span>
          <span className="text-[10px] text-teal-400 block mt-1">Jamoaviy samaradorlik</span>
        </div>
      </div>

      {/* Manager Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'teams'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Mening Jamoalarim ({managerTeams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'players'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Futbolchilar & Transferlar</span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'matches'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>O'yinlar Kalendari ({managerMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'standings'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Turnir Jadvali</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Jamoa Statistikasi</span>
        </button>
      </div>

      {/* Tab: Teams Overview */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {managerTeams.map((team) => {
            const teamRoster = players.filter((p) => p.teamId === team.id);
            const teamStanding = standings.find((s) => s.teamId === team.id);
            return (
              <div
                key={team.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center p-1">
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-6 h-6 text-teal-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{team.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {team.city} • Bosh murabbiy: {team.coach}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Tarkib</span>
                    <strong className="text-white font-mono text-sm">{teamRoster.length} kishi</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Ochko</span>
                    <strong className="text-emerald-400 font-mono text-sm">{teamStanding?.points || 0} ochko</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Natija</span>
                    <strong className="text-amber-400 font-mono text-sm">
                      {teamStanding?.won || 0}G' - {teamStanding?.drawn || 0}D
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">
                    Stadion: {team.homeVenue || 'Mahalla stadioni'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setActiveTab('players');
                    }}
                    className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    Tarkibni boshqarish <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Players & Transfer */}
      {activeTab === 'players' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-white">
                Futbolchilar Ro'yxati va Yangi Qabul
              </h3>
              <p className="text-xs text-slate-400">
                {currentTeam?.name} jamoasi rasmiy tarkibi
              </p>
            </div>
            <button
              onClick={() => {
                setTargetTeamId(currentTeam?.id || managerTeams[0]?.id || '');
                setIsAddPlayerOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi futbolchi qo'shish</span>
            </button>
          </div>

          {/* Team selector tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
            {managerTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTeamId === team.id
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {team.name}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Futbolchi</th>
                  <th className="py-2.5 px-3">Pozitsiya</th>
                  <th className="py-2.5 px-3 text-center">Yosh</th>
                  <th className="py-2.5 px-3 text-center">Gollar</th>
                  <th className="py-2.5 px-3 text-center">Assistlar</th>
                  <th className="py-2.5 px-3 text-center">Kartochkalar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentTeamPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">
                      #{player.jerseyNumber}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {player.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-300 font-mono">
                      {player.age}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-400 font-mono">
                      {player.goals}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-300 font-mono">
                      {player.assists}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                      {player.yellowCards}🟨 {player.redCards > 0 && `${player.redCards}🟥`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Matches */}
      {activeTab === 'matches' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-extrabold text-base text-white">
            Menejer Nazoratidagi O'yinlar Taqvim
          </h3>
          <div className="space-y-3">
            {managerMatches.map((m) => {
              const home = teams.find((t) => t.id === m.homeTeamId);
              const away = teams.find((t) => t.id === m.awayTeamId);
              return (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">{m.matchDate}</span>
                    <h4 className="font-bold text-xs sm:text-sm text-white mt-0.5">
                      {home?.name} vs {away?.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Stadion: {m.venue} • Hakam: {m.refereeName || 'Ravshan Haydarov'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {m.status}
                    </span>
                    {m.status === 'finished' && (
                      <span className="block font-mono font-bold text-emerald-400 text-sm mt-1">
                        {m.homeScore} : {m.awayScore}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Standings */}
      {activeTab === 'standings' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-extrabold text-base text-white">
            {managerLeagues[0]?.name || 'Liga'} Turnir Jadvali
          </h3>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Jamoa</th>
                  <th className="py-3 px-2 text-center">O'</th>
                  <th className="py-3 px-2 text-center">G'</th>
                  <th className="py-3 px-2 text-center">D</th>
                  <th className="py-3 px-2 text-center">M</th>
                  <th className="py-3 px-2 text-center">TN</th>
                  <th className="py-3 px-3 text-center font-bold text-emerald-400">Ochko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {standings
                  .filter((s) => s.leagueId === managerLeagues[0]?.id)
                  .sort((a, b) => b.points - a.points)
                  .map((st, i) => {
                    const t = getTeamById(st.teamId);
                    const isMyTeam = assignedTeamIds.includes(st.teamId);
                    return (
                      <tr
                        key={st.id}
                        className={`transition-colors ${
                          isMyTeam ? 'bg-teal-500/10 font-bold text-teal-300' : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono">{i + 1}</td>
                        <td className="py-3 px-3">
                          <span className={isMyTeam ? 'text-teal-300 font-bold' : 'text-white'}>
                            {t?.name} {isMyTeam && '⭐ (Mening jamoam)'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono">{st.played}</td>
                        <td className="py-3 px-2 text-center font-mono">{st.won}</td>
                        <td className="py-3 px-2 text-center font-mono">{st.drawn}</td>
                        <td className="py-3 px-2 text-center font-mono">{st.lost}</td>
                        <td className="py-3 px-2 text-center font-mono">{st.goalsFor - st.goalsAgainst}</td>
                        <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold text-sm">
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

      {/* Tab: Stats */}
      {activeTab === 'stats' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-extrabold text-base text-white">
            Jamoa Samaradorligi va Intizom Analitikasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managerTeams.map((team) => {
              const teamPlayers = players.filter((p) => p.teamId === team.id);
              const goalsScored = teamPlayers.reduce((sum, p) => sum + p.goals, 0);
              const yellows = teamPlayers.reduce((sum, p) => sum + p.yellowCards, 0);
              const reds = teamPlayers.reduce((sum, p) => sum + p.redCards, 0);
              return (
                <div key={team.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm text-teal-400">{team.name}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Jami futbolchilar:</span>
                      <strong className="text-white">{teamPlayers.length} nafar</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Kiritilgan gollar:</span>
                      <strong className="text-amber-400">{goalsScored} ta</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Sariq kartochkalar:</span>
                      <strong className="text-amber-300">{yellows} ta</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Qizil kartochkalar:</span>
                      <strong className="text-rose-400">{reds} ta</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {isAddPlayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-base text-white mb-4">
              Jamoaga Yangi Futbolchi Qo'shish
            </h3>
            <form onSubmit={handleAddPlayerSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Jamoani tanlang</label>
                <select
                  value={targetTeamId}
                  onChange={(e) => setTargetTeamId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {managerTeams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Futbolchi ismi</label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Shaxzod Rahimov"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Forma raqami</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    required
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Yoshi</label>
                  <input
                    type="number"
                    min={15}
                    max={45}
                    required
                    value={playerAge}
                    onChange={(e) => setPlayerAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Pozitsiya (Amplua)</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Hujumchi">Hujumchi (FWD)</option>
                  <option value="O'rta">Yarim himoyachi (MID)</option>
                  <option value="Himoyachi">Himoyachi (DEF)</option>
                  <option value="Darvozabon">Darvozabon (GK)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPlayerOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold"
                >
                  Ro'yxatga olish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
