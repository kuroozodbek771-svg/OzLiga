import React from 'react';
import { Flame, Play, Clock, ChevronRight } from 'lucide-react';
import { useLeague } from '../context/LeagueContext';

interface LiveScoresTickerProps {
  onSelectMatch: (matchId: string) => void;
}

export const LiveScoresTicker: React.FC<LiveScoresTickerProps> = ({
  onSelectMatch,
}) => {
  const { matches, getTeamById, getLeagueById } = useLeague();

  const liveMatches = matches.filter((m) => m.status === 'live');
  const recentFinished = matches.filter((m) => m.status === 'finished').slice(0, 3);
  const tickerItems = liveMatches.length > 0 ? liveMatches : recentFinished;

  if (tickerItems.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 py-2 px-4 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-3 min-w-max">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          {liveMatches.length > 0 ? "Jonli Hisoblar" : "Oxirgi Natijalar"}
        </div>

        <div className="flex items-center gap-3">
          {tickerItems.map((m) => {
            const home = getTeamById(m.homeTeamId);
            const away = getTeamById(m.awayTeamId);
            const isLive = m.status === 'live';

            return (
              <button
                key={m.id}
                onClick={() => onSelectMatch(m.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs transition-all hover:scale-[1.02] cursor-pointer ${
                  isLive
                    ? 'bg-slate-900 border-rose-500/40 text-slate-100 hover:border-rose-500 shadow-sm shadow-rose-950/20'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isLive ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" />
                    {m.currentMinute || 70}'
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px] font-semibold">
                    FT
                  </span>
                )}

                <div className="flex items-center gap-1.5 font-medium">
                  <span className="truncate max-w-[100px] text-slate-200">
                    {home?.name || 'Jamoa A'}
                  </span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded font-bold text-white font-mono">
                    {m.homeScore} : {m.awayScore}
                  </span>
                  <span className="truncate max-w-[100px] text-slate-200">
                    {away?.name || 'Jamoa B'}
                  </span>
                </div>

                <ChevronRight className="w-3 h-3 text-slate-500" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
