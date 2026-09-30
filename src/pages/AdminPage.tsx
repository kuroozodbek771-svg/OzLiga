import React, { useState } from 'react';
import {
  UserCheck,
  Trophy,
  Shield,
  Calendar,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Download,
  CheckCircle,
  Clock,
  Play,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { LeagueStatus, Match } from '../types';

interface AdminPageProps {
  onOpenRefereeModal: (match: Match) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onOpenRefereeModal,
}) => {
  const {
    currentUser,
    switchUserRole,
    leagues,
    teams,
    matches,
    players,
    addLeague,
    updateLeague,
    deleteLeague,
    resetToDefault,
    getTeamById,
    updateMatchStatus,
  } = useLeague();

  const [activeTab, setActiveTab] = useState<
    'leagues' | 'matches' | 'referee' | 'system'
  >('leagues');

  // Form for New League
  const [leagueName, setLeagueName] = useState('');
  const [leagueSeason, setLeagueSeason] = useState('2024/2025');
  const [leagueRegion, setLeagueRegion] = useState('Toshkent');
  const [leagueStatus, setLeagueStatus] = useState<LeagueStatus>('active');
  const [leagueDescription, setLeagueDescription] = useState('');

  const handleCreateLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueName.trim()) return;

    addLeague({
      name: leagueName,
      season: leagueSeason,
      region: leagueRegion,
      status: leagueStatus,
      description: leagueDescription,
      logoUrl:
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
    });

    setLeagueName('');
    setLeagueDescription('');
    alert("Yangi liga muvaffaqiyatli yaratildi!");
  };

  const handleExportAllJSON = () => {
    const data = {
      leagues,
      teams,
      players,
      matches,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ozleague_backup_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Current Role Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <UserCheck className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                Boshqaruv & Hakamlik Markazi
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  currentUser.role === 'admin'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : currentUser.role === 'referee'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                }`}
              >
                Hozirgi rol: {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Foydalanuvchi: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.email})
            </p>
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 px-2 font-medium">
            Rolni almashtirish:
          </span>
          <button
            onClick={() => switchUserRole('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentUser.role === 'admin'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Admin
          </button>
          <button
            onClick={() => switchUserRole('referee')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentUser.role === 'referee'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏱️ Hakam
          </button>
          <button
            onClick={() => switchUserRole('user')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentUser.role === 'user'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚽ Muxlis
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('leagues')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'leagues'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Ligalar Boshqaruvi ({leagues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('referee')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'referee'
              ? 'border-amber-500 text-amber-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jonli Hakamlik ({matches.filter((m) => m.status === 'live').length} faol)</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'system'
              ? 'border-blue-500 text-blue-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Tizim & Zaxira (Backup)</span>
        </button>
      </div>

      {/* Tab: Leagues Management */}
      {activeTab === 'leagues' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create League Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-emerald-400" />
              Yangi Liga Yaratish
            </h3>

            <form onSubmit={handleCreateLeague} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Liga nomi
                </label>
                <input
                  type="text"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  placeholder="Masalan: Farg'ona Vodiy Superligasi"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mavsum
                  </label>
                  <input
                    type="text"
                    value={leagueSeason}
                    onChange={(e) => setLeagueSeason(e.target.value)}
                    placeholder="2024/2025"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hudud
                  </label>
                  <input
                    type="text"
                    value={leagueRegion}
                    onChange={(e) => setLeagueRegion(e.target.value)}
                    placeholder="Toshkent shahri"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Holati (Status)
                </label>
                <select
                  value={leagueStatus}
                  onChange={(e) =>
                    setLeagueStatus(e.target.value as LeagueStatus)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="active">Faol (Active)</option>
                  <option value="upcoming">Kutilmoqda (Upcoming)</option>
                  <option value="finished">Yakunlangan (Finished)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tavsif (Qisqacha)
                </label>
                <textarea
                  value={leagueDescription}
                  onChange={(e) => setLeagueDescription(e.target.value)}
                  placeholder="Turnir haqida ma'lumot..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                Ligani saqlash va boshlash
              </button>
            </form>
          </div>

          {/* Existing Leagues List */}
          <div className="lg:col-span-2 space-y-3">
            {leagues.map((league) => (
              <div
                key={league.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">
                      {league.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {league.region} • {league.season} • {teams.filter((t) => t.leagueId === league.id).length} ta jamoa
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <select
                    value={league.status}
                    onChange={(e) =>
                      updateLeague(league.id, {
                        status: e.target.value as LeagueStatus,
                      })
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="active">Faol</option>
                    <option value="upcoming">Kutilmoqda</option>
                    <option value="finished">Tugagan</option>
                  </select>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `"${league.name}" ligasini o'chirishni tasdiqlaysizmi?`
                        )
                      ) {
                        deleteLeague(league.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Referee Matches Control */}
      {activeTab === 'referee' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Jonli O'yin Hakamligi
                </h4>
                <p className="text-xs text-slate-300">
                  O'yinni tanlang va hisob, gol urgan o'yinchi yoki kartochkalarni kiritish uchun "Hakamlik paneli"ni oching.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => {
              const home = getTeamById(match.homeTeamId);
              const away = getTeamById(match.awayTeamId);

              return (
                <div
                  key={match.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        match.status === 'live'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : match.status === 'finished'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {match.status} {match.currentMinute && `(${match.currentMinute}')`}
                    </span>
                    <span className="text-slate-400">{match.venue}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="font-bold text-sm text-slate-100">
                      {home?.name}
                    </span>
                    <span className="text-xl font-black font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-emerald-400">
                      {match.homeScore} : {match.awayScore}
                    </span>
                    <span className="font-bold text-sm text-slate-100">
                      {away?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    {match.status === 'upcoming' ? (
                      <button
                        onClick={() =>
                          updateMatchStatus(match.id, 'live', 1)
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        O'yinni boshlash (Jonli)
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenRefereeModal(match)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Hakamlik panelini ochish
                      </button>
                    )}

                    <span className="text-xs text-slate-500">
                      {match.goals.length} gol • {match.cards.length} kartochka
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: System & Data */}
      {activeTab === 'system' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              Tizim ma'lumotlarini boshqarish va eksport
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Barcha ligalar, jamoalar, o'yinlar va statistikalarni to'liq JSON fayl shaklida yuklab oling yoki dastlabki holatga qaytaring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-400" />
                  JSON Zaxira nusxasi (Backup)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Barcha ma'lumotlar bazasini bitta faylda yuklab oling.
                </p>
              </div>
              <button
                onClick={handleExportAllJSON}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-colors"
              >
                Eksport qilish (JSON)
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-sm text-rose-300 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  Boshlang'ich holatga qaytarish (Reset)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Barcha o'zgarishlarni o'chirib, test uchun haqiqiy O'zbekiston ligalari seed ma'lumotlarini tiklaydi.
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Haqiqatan ham barcha ma'lumotlarni boshlang'ich test holatiga qaytarasizmi?"
                    )
                  ) {
                    resetToDefault();
                    alert("Ma'lumotlar tiklandi!");
                  }
                }}
                className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
              >
                Dastlabki holatga qaytarish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
