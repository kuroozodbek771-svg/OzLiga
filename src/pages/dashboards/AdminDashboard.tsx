import React, { useState } from 'react';
import {
  Trophy,
  Shield,
  Users,
  Calendar,
  UserCheck,
  Settings,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Download,
  CheckCircle,
  Clock,
  Play,
  Activity,
  AlertTriangle,
  ArrowRight,
  Eye,
  KeyRound,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import { useLeague } from '../../context/LeagueContext';
import { Match, UserRole } from '../../types';
import { NavTab } from '../../components/Navbar';

interface AdminDashboardProps {
  onOpenRefereeModal: (match: Match) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenRefereeModal,
  onNavigateTab,
}) => {
  const {
    currentUser,
    users,
    updateUserRole,
    addUser,
    deleteUser,
    leagues,
    teams,
    players,
    matches,
    standings,
    tournaments,
    addLeague,
    deleteLeague,
    resetToDefault,
    switchAuthenticatedUser,
  } = useLeague();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'leagues' | 'teams' | 'referees' | 'settings'
  >('overview');

  // New League Form
  const [isAddLeagueOpen, setIsAddLeagueOpen] = useState(false);
  const [leagueName, setLeagueName] = useState('');
  const [leagueRegion, setLeagueRegion] = useState('');
  const [leagueSeason, setLeagueSeason] = useState('2024/2025');

  // New User Form
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('fan');

  // Quick Switch View simulator for Admin
  const [viewingAs, setViewingAs] = useState<'admin' | 'manager' | 'referee' | 'fan'>('admin');

  const liveMatches = matches.filter(
    (m) => m.status === 'live' || m.status === 'first_half' || m.status === 'second_half'
  );

  const handleCreateLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueName.trim()) return;
    addLeague({
      name: leagueName,
      region: leagueRegion || 'Toshkent',
      season: leagueSeason,
      status: 'active',
      description: 'Yangi tashkil qilingan havaskorlar ligasi',
    });
    setLeagueName('');
    setLeagueRegion('');
    setIsAddLeagueOpen(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;
    addUser({
      name: userName,
      email: userEmail,
      role: userRole,
      refereeName: userRole === 'referee' ? userName : undefined,
    });
    setUserName('');
    setUserEmail('');
    setIsAddUserOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner with Admin Badge & View-as feature */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Bosh Administrator Kabineti
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                To'liq Ruxsat (Super Admin)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Foydalanuvchi: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.email}) • Barcha ligalar, rollar va tizim boshqaruvi
            </p>
          </div>
        </div>

        {/* Superpower: Switch View As Other Roles */}
        <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-2xl flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Kabinetga o'tish:
          </span>
          <button
            onClick={() => onNavigateTab('manager')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 transition-all flex items-center gap-1"
          >
            Menejer
          </button>
          <button
            onClick={() => onNavigateTab('referee')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1"
          >
            Hakam
          </button>
          <button
            onClick={() => onNavigateTab('fan')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center gap-1"
          >
            Muxlis
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Ligalar</span>
          <span className="text-2xl font-black text-white font-mono">{leagues.length}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">Barchasi faol</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Jamoalar</span>
          <span className="text-2xl font-black text-white font-mono">{teams.length}</span>
          <span className="text-[10px] text-teal-400 block mt-1">Ro'yxatdan o'tgan</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Futbolchilar</span>
          <span className="text-2xl font-black text-white font-mono">{players.length}</span>
          <span className="text-[10px] text-blue-400 block mt-1">Faol litsenziya</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">O'yinlar</span>
          <span className="text-2xl font-black text-white font-mono">{matches.length}</span>
          <span className="text-[10px] text-amber-400 block mt-1">{liveMatches.length} ta jonli</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Foydalanuvchilar</span>
          <span className="text-2xl font-black text-white font-mono">{users.length}</span>
          <span className="text-[10px] text-purple-400 block mt-1">4 xil rol</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Hakamlar</span>
          <span className="text-2xl font-black text-white font-mono">
            {users.filter((u) => u.role === 'referee').length || 2}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1">Biriktirilgan</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Umumiy Analitika</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Foydalanuvchilar & Rollar ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leagues')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'leagues'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Ligalar Boshqaruvi ({leagues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'teams'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Jamoalar & Tarkib</span>
        </button>

        <button
          onClick={() => setActiveTab('referees')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'referees'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Hakamlar Paneli</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Tizim Sozlamalari & Audit</span>
        </button>
      </div>

      {/* Tab 1: Overview & Quick Actions */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Live Matches management */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  Jonli O'yinlar Nazorati (Match Control)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {liveMatches.length} ta faol o'yin
                </span>
              </div>

              {liveMatches.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800/80">
                  Hozirda jonli o'yinlar yo'q. O'yinlar taqvimidan biror o'yinni boshlang.
                </div>
              ) : (
                <div className="space-y-3">
                  {liveMatches.map((m) => {
                    const homeTeam = teams.find((t) => t.id === m.homeTeamId);
                    const awayTeam = teams.find((t) => t.id === m.awayTeamId);
                    return (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-2xl bg-slate-950/60 border border-rose-500/30 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                            <span className="text-[11px] font-bold text-rose-400 uppercase font-mono">
                              {m.currentMinute || 45}' daqiqa
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white mt-0.5 truncate">
                            {homeTeam?.name} {m.homeScore} : {m.awayScore} {awayTeam?.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            Hakam: {m.refereeName || 'Ravshan Haydarov'} • Stadion: {m.venue}
                          </span>
                        </div>

                        <button
                          onClick={() => onOpenRefereeModal(m)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Hakamlik Paneli</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* League Standings Summary */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Ligalar Holati va Yetakchilar
              </h3>
              <div className="space-y-3">
                {leagues.map((league) => {
                  const leagueTeams = teams.filter((t) => t.leagueId === league.id);
                  return (
                    <div
                      key={league.id}
                      className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-200">
                          {league.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {league.region} • {leagueTeams.length} jamoa • {league.season}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {league.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-3">
                Tezkor Ma'muriy Amallar
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsAddLeagueOpen(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    Yangi Liga Yaratish
                  </span>
                  <Plus className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    Yangi Foydalanuvchi Qo'shish
                  </span>
                  <Plus className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => onNavigateTab('tournaments')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Kubok / Pley-off To'ri
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => onNavigateTab('schema')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    PostgreSQL Sxemasi & API
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Security Audit snippet */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-2">
                Xavfsizlik & Ruxsatlar
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Barcha so'rovlar <strong className="text-emerald-400">JWT Token</strong> va{' '}
                <strong className="text-emerald-400">bcrypt</strong> shifrlash orqali himoyalangan.
                Manager, Referee va Fan rollari uchun backend middleware orqali 403 Forbidden tekshiruvlari yoqilgan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Roles Management */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-white">
                Foydalanuvchilar va Rollarni Boshqarish (RBAC)
              </h3>
              <p className="text-xs text-slate-400">
                Tizim a'zolariga Admin, Manager, Referee yoki Fan huquqlarini belgilash
              </p>
            </div>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Foydalanuvchi qo'shish</span>
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Ism-familiya</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Hozirgi Rol</th>
                  <th className="py-3 px-3">Biriktirilgan vazifa</th>
                  <th className="py-3 px-3 text-right">Rolni o'zgartirish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{u.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : u.role === 'manager' || u.role === 'league_manager'
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                            : u.role === 'referee'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {u.refereeName ? `Hakam: ${u.refereeName}` : u.managedLeagueIds ? 'Liga Menejeri' : 'Umumiy'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="admin">👑 Admin</option>
                        <option value="manager">👔 Manager</option>
                        <option value="referee">🟨 Referee</option>
                        <option value="fan">⚽ Fan</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Leagues CRUD */}
      {activeTab === 'leagues' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">
              Barcha Futbol Ligalari (CRUD)
            </h3>
            <button
              onClick={() => setIsAddLeagueOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi liga</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leagues.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-white">{l.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{l.region} • {l.season}</p>
                  <p className="text-[11px] text-slate-500 mt-2">{l.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {l.status}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`${l.name} ligasini o'chirmoqchimisiz?`)) {
                        deleteLeague(l.id);
                      }
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Referees Management */}
      {activeTab === 'referees' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-extrabold text-base text-white">
            Bosh Hakamlar va O'yinlar Taqvimi
          </h3>
          <p className="text-xs text-slate-400">
            Hakamlar ro'yxati va ularga o'yinlarni belgilash
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => {
              const home = teams.find((t) => t.id === m.homeTeamId);
              const away = teams.find((t) => t.id === m.awayTeamId);
              return (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">{m.matchDate}</span>
                    <h4 className="font-bold text-xs sm:text-sm text-white mt-0.5">
                      {home?.name} vs {away?.name}
                    </h4>
                    <p className="text-[11px] text-amber-400 font-semibold mt-1">
                      Hakam: {m.refereeName || 'Ravshan Haydarov'}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenRefereeModal(m)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-all"
                  >
                    Hakamlik qilish
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Settings & Reset */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-white">
              Tizim Sozlamalari va Zaxira Nusxa (Backup)
            </h3>
            <p className="text-xs text-slate-400">
              Ma'lumotlar bazasini eksport qilish yoki boshlang'ich holatga qaytarish
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-200">
                To'liq Ma'lumotlarni JSON formatida yuklab olish
              </h4>
              <p className="text-xs text-slate-500">
                Ligalar, jamoalar, futbolchilar, o'yinlar va foydalanuvchilar zaxira fayli
              </p>
            </div>
            <button
              onClick={() => {
                const data = { leagues, teams, players, matches, standings, users };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ozleague_backup_${Date.now()}.json`;
                a.click();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Eksport (JSON)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-rose-300">
                Boshlang'ich Holatga Qaytarish (Reset All)
              </h4>
              <p className="text-xs text-slate-400">
                Barcha kiritilgan o'zgarishlarni tozalab, O'zLeague boshlang'ich seed ma'lumotlariga qaytaradi.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Haqiqatan ham barcha ma'lumotlarni tozalab, boshlang'ich holatga qaytarmoqchimisiz?")) {
                  resetToDefault();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qayta tiklash (Reset)</span>
            </button>
          </div>
        </div>
      )}

      {/* Add League Modal */}
      {isAddLeagueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-base text-white mb-4">Yangi Liga Qo'shish</h3>
            <form onSubmit={handleCreateLeague} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Liga nomi</label>
                <input
                  type="text"
                  required
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  placeholder="Masalan: Samarqand Shahar Kubogi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Hudud / Viloyat</label>
                <input
                  type="text"
                  required
                  value={leagueRegion}
                  onChange={(e) => setLeagueRegion(e.target.value)}
                  placeholder="Samarqand viloyati"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Mavsum</label>
                <input
                  type="text"
                  value={leagueSeason}
                  onChange={(e) => setLeagueSeason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeagueOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-base text-white mb-4">Yangi Foydalanuvchi Ro'yxatga Olish</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Ism-familiya</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Jamshid Nurmatov"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="jamshid@ozleague.uz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Roli</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="fan">Muxlis (Fan)</option>
                  <option value="manager">Liga Menejeri (Manager)</option>
                  <option value="referee">Bosh Hakam (Referee)</option>
                  <option value="admin">Administrator (Admin)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
