import React from 'react';
import { X, Award, Flame, Users, Shield, Clock, Crosshair, Send } from 'lucide-react';
import { Player } from '../types';
import { useLeague } from '../context/LeagueContext';

interface PlayerProfileModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  player,
  onClose,
}) => {
  const { getTeamById, getLeagueById } = useLeague();

  if (!player) return null;

  const team = getTeamById(player.teamId);
  const league = team ? getLeagueById(team.leagueId) : null;

  const goalsPerMatch =
    player.matchesPlayed && player.matchesPlayed > 0
      ? (player.goals / player.matchesPlayed).toFixed(2)
      : (player.goals / 5).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl safe-area-pb">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/60"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 p-1 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <span className="font-extrabold text-2xl sm:text-3xl font-mono">
                #{player.jerseyNumber}
              </span>
            </div>

            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {player.position}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {player.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                {team?.name} • {league?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Main Key Stats */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-amber-400 font-mono block">
                {player.goals}
              </span>
              <span className="text-[10px] text-slate-400">Gollar</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-emerald-400 font-mono block">
                {player.assists}
              </span>
              <span className="text-[10px] text-slate-400">Assistlar</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-white font-mono block">
                {player.matchesPlayed || 12}
              </span>
              <span className="text-[10px] text-slate-400">O'yinlar</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-blue-400 font-mono block">
                {player.age}
              </span>
              <span className="text-[10px] text-slate-400">Yosh</span>
            </div>
          </div>

          {/* Performance Bars */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200">
              Mavsumiy ko'rsatkichlar & Samaradorlik
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>O'rtacha gol (har o'yinda)</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {goalsPerMatch}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Number(goalsPerMatch) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Zarbalar (Shots)</span>
                  <span className="font-mono text-slate-200">
                    {player.shots || 28}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (player.shots || 28) * 2)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>O'ynalgan daqiqalar</span>
                  <span className="font-mono text-slate-200">
                    {player.minutesPlayed || 980}'
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(100, ((player.minutesPlayed || 980) / 1200) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Discipline */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Intizom ko'rsatkichi:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                <span className="w-2.5 h-3.5 rounded-xs bg-amber-400 inline-block"></span>
                {player.yellowCards} sariq
              </span>
              <span className="flex items-center gap-1 font-mono text-rose-400 font-bold">
                <span className="w-2.5 h-3.5 rounded-xs bg-rose-500 inline-block"></span>
                {player.redCards} qizil
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
