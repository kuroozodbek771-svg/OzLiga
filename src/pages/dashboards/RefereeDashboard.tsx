import React, { useState } from 'react';
import {
  Play,
  Clock,
  Award,
  AlertTriangle,
  Repeat,
  CheckCircle,
  Shield,
  Flame,
  UserCheck,
  Calendar,
  Lock,
} from 'lucide-react';
import { useLeague } from '../../context/LeagueContext';
import { Match } from '../../types';

interface RefereeDashboardProps {
  onOpenRefereeModal: (match: Match) => void;
}

export const RefereeDashboard: React.FC<RefereeDashboardProps> = ({
  onOpenRefereeModal,
}) => {
  const { currentUser, matches, teams, getTeamById } = useLeague();

  // Referee is scoped to matches assigned to him
  const myRefereeName = currentUser.refereeName || currentUser.name || 'Ravshan Haydarov';

  // Filter matches for this referee
  const myAssignedMatches = matches.filter(
    (m) =>
      m.refereeName?.toLowerCase() === myRefereeName.toLowerCase() ||
      m.refereeName === 'Ravshan Haydarov' // Default seed match referee
  );

  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');

  const liveMatches = myAssignedMatches.filter(
    (m) => m.status === 'live' || m.status === 'first_half' || m.status === 'second_half'
  );
  const upcomingMatches = myAssignedMatches.filter((m) => m.status === 'upcoming');
  const finishedMatches = myAssignedMatches.filter((m) => m.status === 'finished');

  const displayedMatches = myAssignedMatches.filter((m) => {
    if (filterStatus === 'live') {
      return m.status === 'live' || m.status === 'first_half' || m.status === 'second_half';
    }
    if (filterStatus === 'upcoming') return m.status === 'upcoming';
    if (filterStatus === 'finished') return m.status === 'finished';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            🟨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Bosh Hakam Kabineti (Referee Console)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Match Center
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hakam: <strong className="text-slate-200">{myRefereeName}</strong> • Faqat o'zingizga biriktirilgan rasmiy o'yinlarni boshqarish huquqi
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px]">
            Boshqa hakamlarning o'yinlariga kirish bloklangan
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Biriktirilgan O'yinlar</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{myAssignedMatches.length}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Jami taqvim</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Hozirgi Jonli O'yin</span>
          <span className="text-2xl font-black text-rose-400 font-mono">{liveMatches.length}</span>
          <span className="text-[10px] text-rose-300 block mt-1">Hakamlik ostida</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Kutilayotgan</span>
          <span className="text-2xl font-black text-blue-400 font-mono">{upcomingMatches.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Boshlashga tayyor</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Yakunlangan</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{finishedMatches.length}</span>
          <span className="text-[10px] text-emerald-300 block mt-1">Protokol tasdiqlangan</span>
        </div>
      </div>

      {/* Live Match Active Alert */}
      {liveMatches.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-rose-950/20 border-2 border-rose-500/50 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Diqqat! Hozirda Jonli O'yin Bormoqda
              </h3>
            </div>
            <span className="text-xs text-rose-400 font-bold uppercase">
              Jonli Match Center
            </span>
          </div>

          {liveMatches.map((m) => {
            const home = teams.find((t) => t.id === m.homeTeamId);
            const away = teams.find((t) => t.id === m.awayTeamId);
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs text-rose-400 font-mono font-bold">
                    {m.currentMinute || 45}' daqiqa • {m.status}
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">
                    {home?.name} <span className="text-emerald-400">{m.homeScore} : {m.awayScore}</span> {away?.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Stadion: {m.venue} • {m.goals.length} ta gol • {m.cards.length} ta kartochka
                  </p>
                </div>

                <button
                  onClick={() => onOpenRefereeModal(m)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Hakamlik Console (O'yinni Boshqarish)</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filterStatus === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Barchasi ({myAssignedMatches.length})
        </button>
        <button
          onClick={() => setFilterStatus('live')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filterStatus === 'live'
              ? 'bg-rose-500 text-white font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Jonli ({liveMatches.length})
        </button>
        <button
          onClick={() => setFilterStatus('upcoming')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filterStatus === 'upcoming'
              ? 'bg-blue-500 text-white font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Kutilayotgan ({upcomingMatches.length})
        </button>
        <button
          onClick={() => setFilterStatus('finished')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filterStatus === 'finished'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Yakunlangan ({finishedMatches.length})
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedMatches.map((match) => {
          const home = teams.find((t) => t.id === match.homeTeamId);
          const away = teams.find((t) => t.id === match.awayTeamId);
          const isLive = match.status === 'live' || match.status === 'first_half' || match.status === 'second_half';
          const isFinished = match.status === 'finished';

          return (
            <div
              key={match.id}
              className={`p-5 rounded-3xl border transition-all ${
                isLive
                  ? 'bg-slate-900/90 border-rose-500/50 shadow-lg shadow-rose-950/20'
                  : isFinished
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-slate-900/80 border-slate-800/80 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-slate-400 font-mono uppercase">
                  {match.matchDate}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isLive
                      ? 'bg-rose-500 text-white animate-pulse'
                      : isFinished
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {match.status}
                </span>
              </div>

              {/* Match Score Display */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {home?.logoUrl ? (
                      <img src={home.logoUrl} alt={home.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[120px]">
                    {home?.name}
                  </span>
                </div>

                <div className="px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 font-mono font-black text-sm sm:text-base text-amber-400">
                  {match.homeScore} : {match.awayScore}
                </div>

                <div className="flex items-center gap-2.5 min-w-0 justify-end">
                  <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[120px] text-right">
                    {away?.name}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {away?.logoUrl ? (
                      <img src={away.logoUrl} alt={away.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Stadion: {match.venue}</span>
                <button
                  onClick={() => onOpenRefereeModal(match)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold border border-amber-500/30 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isLive ? 'Davom ettirish' : isFinished ? "Protokolni ko'rish" : "O'yinni boshlash"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
