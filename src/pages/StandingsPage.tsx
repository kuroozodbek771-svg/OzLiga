import React, { useState } from 'react';
import {
  Trophy,
  RefreshCw,
  Shield,
  Download,
  Info,
  Smartphone,
  Maximize2,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';

import { Team } from '../types';

interface StandingsPageProps {
  onSelectTeam?: (team: Team) => void;
}

export const StandingsPage: React.FC<StandingsPageProps> = ({ onSelectTeam }) => {
  const {
    leagues,
    standings,
    selectedLeagueId,
    setSelectedLeagueId,
    recalculateStandings,
    getTeamById,
    getLeagueById,
  } = useLeague();

  const [compactMobileView, setCompactMobileView] = useState<boolean>(false);

  const activeLeagueId =
    selectedLeagueId === 'all' ? leagues[0]?.id || '' : selectedLeagueId;
  const currentLeague = getLeagueById(activeLeagueId) || leagues[0];

  const leagueStandings = standings
    .filter((s) => s.leagueId === activeLeagueId)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });

  const handleRecalculate = () => {
    recalculateStandings(activeLeagueId);
    alert("Turnir jadvali barcha yakunlangan o'yinlar bo'yicha qayta hisoblandi!");
  };

  const handleExportCSV = () => {
    const headers = "O'rin,Jamoa,Shahar,O'yin,G'alaba,Durang,Mag'lubiyat,UG,O'G,TN,Ochko\n";
    const rows = leagueStandings
      .map((st, i) => {
        const team = getTeamById(st.teamId);
        const gd = st.goalsFor - st.goalsAgainst;
        return `${i + 1},"${team?.name || ''}","${team?.city || ''}",${st.played},${st.won},${st.drawn},${st.lost},${st.goalsFor},${st.goalsAgainst},${gd},${st.points}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `standings_${currentLeague?.name || 'league'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            Turnir Jadvali — Standings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ochkolar, to'plar nisbati va o'yinlar formasi
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile view toggle */}
          <button
            onClick={() => setCompactMobileView(!compactMobileView)}
            className="sm:hidden px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            {compactMobileView ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Keng ko'rinish</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kompakt ko'rinish</span>
              </>
            )}
          </button>

          <button
            onClick={handleRecalculate}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Qayta hisoblash</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* League Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeagueId(league.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeLeagueId === league.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {league.name}
          </button>
        ))}
      </div>

      {/* Standings Table Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {currentLeague?.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {currentLeague?.region} • {currentLeague?.season}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span>
              Chempion
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-400 inline-block"></span>
              Pley-off
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[500px] sm:min-w-full">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-semibold sticky top-0">
              <tr>
                <th className="py-3 px-3 text-center w-10">#</th>
                <th className="py-3 px-3 min-w-[130px]">Jamoa</th>
                <th className="py-3 px-2 text-center" title="O'yinlar">O'</th>
                <th className="py-3 px-2 text-center text-emerald-400" title="G'alaba">G'</th>
                <th className="py-3 px-2 text-center text-amber-400" title="Durang">D</th>
                <th className="py-3 px-2 text-center text-rose-400" title="Mag'lubiyat">M</th>
                
                {!compactMobileView && (
                  <>
                    <th className="py-3 px-2 text-center hidden md:table-cell" title="Urilgan">UG</th>
                    <th className="py-3 px-2 text-center hidden md:table-cell" title="O'tkazilgan">O'G</th>
                    <th className="py-3 px-2 text-center" title="To'plar farqi">TN</th>
                  </>
                )}

                <th className="py-3 px-3 text-center font-bold text-emerald-400 text-sm sm:text-base">
                  OCHKO
                </th>
                <th className="py-3 px-3 text-center">Forma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {leagueStandings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-500">
                    Jamoalar yoki o'yinlar mavjud emas.
                  </td>
                </tr>
              ) : (
                leagueStandings.map((st, index) => {
                  const team = getTeamById(st.teamId);
                  const goalDiff = st.goalsFor - st.goalsAgainst;
                  const isLeader = index === 0;

                  return (
                    <tr
                      key={st.id}
                      onClick={() => team && onSelectTeam?.(team)}
                      className={`hover:bg-slate-800/60 transition-colors cursor-pointer group ${
                        isLeader ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Pos */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`w-6 h-6 rounded-lg inline-flex items-center justify-center font-black text-[11px] ${
                            isLeader
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                              : index === 1
                              ? 'bg-slate-700 text-white'
                              : index === 2
                              ? 'bg-amber-900/80 text-amber-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      {/* Team */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                            {team?.logoUrl ? (
                              <img
                                src={team.logoUrl}
                                alt={team.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Shield className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-100 block truncate max-w-[110px] sm:max-w-[200px]">
                              {team?.name || 'Jamoa'}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {team?.city}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Matches */}
                      <td className="py-3.5 px-2 text-center font-mono text-slate-300">
                        {st.played}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono text-emerald-400 font-bold">
                        {st.won}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono text-amber-400">
                        {st.drawn}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono text-rose-400">
                        {st.lost}
                      </td>

                      {!compactMobileView && (
                        <>
                          <td className="py-3.5 px-2 text-center font-mono text-slate-300 hidden md:table-cell">
                            {st.goalsFor}
                          </td>
                          <td className="py-3.5 px-2 text-center font-mono text-slate-400 hidden md:table-cell">
                            {st.goalsAgainst}
                          </td>
                          <td className="py-3.5 px-2 text-center font-mono font-bold">
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
                        </>
                      )}

                      {/* Points */}
                      <td className="py-3.5 px-3 text-center font-mono font-black text-base sm:text-lg text-emerald-400 bg-emerald-500/5">
                        {st.points}
                      </td>

                      {/* Form */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(st.form || ['W', 'D', 'W']).map((res, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded text-[9px] font-extrabold inline-flex items-center justify-center shadow-xs ${
                                res === 'W'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : res === 'D'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>G'alaba: 3 ochko | Durang: 1 ochko | Mag'lubiyat: 0 ochko</span>
          </div>
          <span className="text-slate-500 font-mono">
            O'zLeague Standings Engine
          </span>
        </div>
      </div>
    </div>
  );
};
