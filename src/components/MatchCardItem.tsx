import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Shield,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Calendar,
  Send,
  Sparkles,
  BarChart2,
  Repeat,
} from 'lucide-react';
import { Match, Team } from '../types';
import { useLeague } from '../context/LeagueContext';

interface MatchCardItemProps {
  match: Match;
  onOpenRefereeModal: (match: Match) => void;
  onSelectTeam?: (team: Team) => void;
  onOpenTelegramModal?: (match: Match) => void;
}

export const MatchCardItem: React.FC<MatchCardItemProps> = ({
  match,
  onOpenRefereeModal,
  onSelectTeam,
  onOpenTelegramModal,
}) => {
  const { getTeamById, getLeagueById, currentUser } = useLeague();
  const [expanded, setExpanded] = useState<boolean>(false);

  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);
  const league = getLeagueById(match.leagueId);

  const isLive =
    match.status === 'live' ||
    match.status === 'first_half' ||
    match.status === 'second_half' ||
    match.status === 'half_time';
  const isFinished = match.status === 'finished';
  const isUpcoming = match.status === 'upcoming';
  const canRef =
    currentUser.role === 'admin' ||
    currentUser.role === 'referee' ||
    currentUser.role === 'league_manager';

  const homeGoals = match.goals.filter((g) => g.teamId === match.homeTeamId);
  const awayGoals = match.goals.filter((g) => g.teamId === match.awayTeamId);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isLive
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/20'
          : isFinished
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top bar: League name & status */}
      <div className="px-3.5 sm:px-4 py-2 bg-slate-950/60 border-b border-slate-800/70 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium truncate max-w-[160px] xs:max-w-[220px] sm:max-w-[280px]">
          {league?.name || "O'zLeague"}
        </span>

        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 text-[10px] sm:text-[11px] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              {match.status === 'half_time'
                ? 'TANAFFUS (HT)'
                : `JONLI • ${match.currentMinute || 70}'`}
            </span>
          )}

          {isFinished && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[10px] sm:text-[11px]">
              Yakunlangan (FT)
            </span>
          )}

          {isUpcoming && (
            <span className="flex items-center gap-1 text-emerald-400 font-medium text-[10px] sm:text-[11px]">
              <Calendar className="w-3 h-3" />
              <span>{match.matchDate}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Scoreboard: Responsive Switch */}
      <div className="p-3.5 sm:p-5">
        {/* Mobile Layout (< sm screens) */}
        <div className="sm:hidden space-y-2.5">
          {/* Home Team Row */}
          <div
            onClick={() => home && onSelectTeam && onSelectTeam(home)}
            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 cursor-pointer hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center p-1 shrink-0">
                {home?.logoUrl ? (
                  <img
                    src={home.logoUrl}
                    alt={home.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Shield className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-100 truncate block">
                  {home?.name || 'Mezbon'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {home?.city}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              {isUpcoming ? (
                <span className="text-[10px] text-slate-400 font-mono">Mezbon</span>
              ) : (
                <span
                  className={`text-lg font-mono font-black px-2 py-0.5 rounded ${
                    match.homeScore > match.awayScore
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-white'
                  }`}
                >
                  {match.homeScore}
                </span>
              )}
            </div>
          </div>

          {/* Away Team Row */}
          <div
            onClick={() => away && onSelectTeam && onSelectTeam(away)}
            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 cursor-pointer hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center p-1 shrink-0">
                {away?.logoUrl ? (
                  <img
                    src={away.logoUrl}
                    alt={away.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Shield className="w-4 h-4 text-teal-400" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-100 truncate block">
                  {away?.name || 'Mehmon'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {away?.city}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              {isUpcoming ? (
                <span className="text-[10px] text-slate-400 font-mono">Mehmon</span>
              ) : (
                <span
                  className={`text-lg font-mono font-black px-2 py-0.5 rounded ${
                    match.awayScore > match.homeScore
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-white'
                  }`}
                >
                  {match.awayScore}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tablet & Desktop Layout (>= sm screens) */}
        <div className="hidden sm:grid grid-cols-7 items-center gap-4">
          {/* Home */}
          <div
            onClick={() => home && onSelectTeam && onSelectTeam(home)}
            className="col-span-3 flex items-center justify-end gap-3 text-right cursor-pointer group"
          >
            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-emerald-400 transition-colors">
                {home?.name || 'Mezbon'}
              </h4>
              <p className="text-[11px] text-slate-400">{home?.city}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-1.5 shadow-md overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              {home?.logoUrl ? (
                <img
                  src={home.logoUrl}
                  alt={home.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Shield className="w-6 h-6 text-emerald-400" />
              )}
            </div>
          </div>

          {/* Score Box */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {isUpcoming ? (
              <div className="text-center px-2 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  VS
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 whitespace-nowrap">
                  {match.matchDate.split(' ')[1] || '18:00'}
                </span>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 shadow-inner">
                <span
                  className={`text-xl sm:text-2xl font-extrabold font-mono ${
                    match.homeScore > match.awayScore
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  {match.homeScore}
                </span>
                <span className="text-slate-500 font-bold">:</span>
                <span
                  className={`text-xl sm:text-2xl font-extrabold font-mono ${
                    match.awayScore > match.homeScore
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  {match.awayScore}
                </span>
              </div>
            )}
          </div>

          {/* Away */}
          <div
            onClick={() => away && onSelectTeam && onSelectTeam(away)}
            className="col-span-3 flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-1.5 shadow-md overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              {away?.logoUrl ? (
                <img
                  src={away.logoUrl}
                  alt={away.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Shield className="w-6 h-6 text-teal-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-emerald-400 transition-colors">
                {away?.name || 'Mehmon'}
              </h4>
              <p className="text-[11px] text-slate-400">{away?.city}</p>
            </div>
          </div>
        </div>

        {/* Scorers Summary if any */}
        {(homeGoals.length > 0 || awayGoals.length > 0) && (
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-0.5">
              {homeGoals.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-1 text-slate-300 text-[10px] sm:text-[11px]"
                >
                  <span>⚽</span>
                  <span className="font-medium truncate max-w-[120px]">
                    {g.playerName}
                  </span>
                  <span className="text-slate-500 font-mono">{g.minute}'</span>
                </div>
              ))}
            </div>

            <div className="space-y-0.5 text-right">
              {awayGoals.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-end gap-1 text-slate-300 text-[10px] sm:text-[11px]"
                >
                  <span className="text-slate-500 font-mono">{g.minute}'</span>
                  <span className="font-medium truncate max-w-[120px]">
                    {g.playerName}
                  </span>
                  <span>⚽</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Match Summary if available */}
        {match.aiSummary && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2 text-[11px] text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="text-emerald-400">AI Tahlil: </strong>
              {match.aiSummary}
            </p>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 max-w-[65%] truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">{match.venue}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenTelegramModal && (
            <button
              onClick={() => onOpenTelegramModal(match)}
              className="p-1 rounded-lg bg-[#2AABEE]/10 text-[#2AABEE] hover:bg-[#2AABEE]/20 transition-colors"
              title="Telegram Post"
            >
              <Send className="w-3.5 h-3.5 -rotate-12" />
            </button>
          )}

          {canRef && (
            <button
              onClick={() => onOpenRefereeModal(match)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-[11px] sm:text-xs transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Hakamlik</span>
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Tafsilotlar & Statistika"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Match Center Timeline & Stats */}
      {expanded && (
        <div className="px-3.5 sm:px-4 py-3 bg-slate-950 border-t border-slate-800 text-xs space-y-3">
          {/* Match Stats Bars if available */}
          {match.stats && (
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h5 className="font-bold text-slate-300 text-[11px] flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                O'yin Statistikasi
              </h5>

              {/* Possession */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>{match.stats.homePossession}%</span>
                  <span>To'p nazorati</span>
                  <span>{match.stats.awayPossession}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${match.stats.homePossession}%` }}
                  ></div>
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: `${match.stats.awayPossession}%` }}
                  ></div>
                </div>
              </div>

              {/* Shots */}
              <div className="grid grid-cols-3 text-center text-[10px] text-slate-300 pt-1 border-t border-slate-800/80">
                <div>
                  <span className="font-bold font-mono">
                    {match.stats.homeShots} ({match.stats.homeShotsOnTarget})
                  </span>
                </div>
                <div className="text-slate-500">Zarbalar (aniq)</div>
                <div>
                  <span className="font-bold font-mono">
                    {match.stats.awayShots} ({match.stats.awayShotsOnTarget})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline of events */}
          <div>
            <h5 className="font-bold text-slate-300 mb-2 text-xs">
              Voqealar xronikasi (Gollar, kartochkalar, almashtirishlar)
            </h5>
            {match.goals.length === 0 &&
            match.cards.length === 0 &&
            (!match.substitutions || match.substitutions.length === 0) ? (
              <p className="text-slate-500 py-1 text-[11px]">
                Hozircha ushbu o'yinda qayd etilgan voqealar yo'q.
              </p>
            ) : (
              <div className="space-y-1.5">
                {[
                  ...match.goals.map((g) => ({
                    ...g,
                    eventType: 'goal' as const,
                  })),
                  ...match.cards.map((c) => ({
                    ...c,
                    eventType: 'card' as const,
                  })),
                  ...(match.substitutions || []).map((s) => ({
                    ...s,
                    eventType: 'sub' as const,
                  })),
                ]
                  .sort((a, b) => a.minute - b.minute)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between py-1 px-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-emerald-400 font-bold shrink-0">
                          {ev.minute}'
                        </span>
                        {ev.eventType === 'goal' ? (
                          <span className="text-emerald-400 font-semibold truncate">
                            ⚽ Gol: {ev.playerName}
                            {'isOwnGoal' in ev && ev.isOwnGoal && ' (Avtogol)'}
                          </span>
                        ) : ev.eventType === 'card' ? (
                          <span className="flex items-center gap-1 text-slate-200 truncate">
                            <span
                              className={`w-2 h-3 rounded-xs shrink-0 inline-block ${
                                'type' in ev && ev.type === 'yellow'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                              }`}
                            ></span>
                            <span className="truncate">
                              {'type' in ev && ev.type === 'yellow'
                                ? 'Sariq'
                                : 'Qizil'}
                              : {ev.playerName}
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-300 truncate">
                            <Repeat className="w-3 h-3 text-teal-400 shrink-0" />
                            <span className="truncate">
                              ⬇️ {ev.playerInName} / ⬆️ {ev.playerOutName}
                            </span>
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                        {getTeamById(ev.teamId)?.name}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
