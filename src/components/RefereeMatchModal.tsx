import React, { useState } from 'react';
import {
  X,
  Plus,
  Shield,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle,
  Repeat,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLeague } from '../context/LeagueContext';
import { Match, MatchStatus } from '../types';
import { TelegramPostModal } from './TelegramPostModal';

interface RefereeMatchModalProps {
  match: Match | null;
  onClose: () => void;
}

export const RefereeMatchModal: React.FC<RefereeMatchModalProps> = ({
  match,
  onClose,
}) => {
  const {
    getTeamById,
    players,
    addGoalToMatch,
    addCardToMatch,
    addSubstitutionToMatch,
    updateMatchScore,
    updateMatchStatus,
    finishMatch,
  } = useLeague();

  const [activeTab, setActiveTab] = useState<
    'goal' | 'card' | 'sub' | 'controls'
  >('goal');
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);

  // Form states for Goal
  const [goalTeamId, setGoalTeamId] = useState<string>('');
  const [goalPlayerId, setGoalPlayerId] = useState<string>('');
  const [assistPlayerId, setAssistPlayerId] = useState<string>('');
  const [goalMinute, setGoalMinute] = useState<number>(
    match?.currentMinute || 45
  );
  const [isOwnGoal, setIsOwnGoal] = useState<boolean>(false);

  // Form states for Card
  const [cardTeamId, setCardTeamId] = useState<string>('');
  const [cardPlayerId, setCardPlayerId] = useState<string>('');
  const [cardType, setCardType] = useState<'yellow' | 'red'>('yellow');
  const [cardMinute, setCardMinute] = useState<number>(
    match?.currentMinute || 45
  );

  // Form states for Substitution
  const [subTeamId, setSubTeamId] = useState<string>('');
  const [subPlayerInId, setSubPlayerInId] = useState<string>('');
  const [subPlayerOutId, setSubPlayerOutId] = useState<string>('');
  const [subMinute, setSubMinute] = useState<number>(
    match?.currentMinute || 60
  );

  if (!match) return null;

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  const currentGoalTeamId = goalTeamId || match.homeTeamId;
  const currentCardTeamId = cardTeamId || match.homeTeamId;
  const currentSubTeamId = subTeamId || match.homeTeamId;

  const goalAvailablePlayers = players.filter(
    (p) => p.teamId === currentGoalTeamId
  );
  const cardAvailablePlayers = players.filter(
    (p) => p.teamId === currentCardTeamId
  );
  const subAvailablePlayers = players.filter(
    (p) => p.teamId === currentSubTeamId
  );

  const handleRecordGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;
    addGoalToMatch(
      match.id,
      goalPlayerId || (goalAvailablePlayers[0]?.id || ''),
      currentGoalTeamId,
      Number(goalMinute),
      isOwnGoal,
      assistPlayerId || undefined
    );
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
    setGoalPlayerId('');
    setAssistPlayerId('');
    setIsOwnGoal(false);
  };

  const handleRecordCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;
    addCardToMatch(
      match.id,
      cardPlayerId || (cardAvailablePlayers[0]?.id || ''),
      currentCardTeamId,
      cardType,
      Number(cardMinute)
    );
    setCardPlayerId('');
  };

  const handleRecordSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match || !subPlayerInId || !subPlayerOutId) {
      alert("Ikkala futbolchini ham tanlang!");
      return;
    }
    addSubstitutionToMatch(
      match.id,
      currentSubTeamId,
      subPlayerInId,
      subPlayerOutId,
      Number(subMinute)
    );
    setSubPlayerInId('');
    setSubPlayerOutId('');
    alert("O'yinchi almashtirish qayd etildi!");
  };

  const handleFinishMatch = () => {
    if (
      window.confirm(
        "O'yinni yakunlaysizmi? Bu amal turnir jadvalini avtomatik qayta hisoblaydi."
      )
    ) {
      finishMatch(match.id);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl safe-area-pb">
          {/* Mobile handle indicator */}
          <div className="sm:hidden w-12 h-1 rounded-full bg-slate-700 mx-auto mt-2 shrink-0"></div>

          {/* Modal Header */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Hakamlik Paneli — Match Center 2.0
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  Hisob, gollar, kartochkalar va almashtirishlar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTelegramOpen(true)}
                className="p-1.5 rounded-lg bg-[#2AABEE]/20 text-[#2AABEE] hover:bg-[#2AABEE]/30 text-xs font-semibold flex items-center gap-1"
                title="Telegram kanaliga post chiqarish"
              >
                <Send className="w-3.5 h-3.5 -rotate-12" />
                <span className="hidden sm:inline">Telegram Post</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Live Scoreboard Display */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4 text-center border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span
                className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  match.status === 'first_half' || match.status === 'second_half' || match.status === 'live'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : match.status === 'finished'
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {match.status === 'first_half'
                  ? `1-bo'lim • ${match.currentMinute || 25}'`
                  : match.status === 'half_time'
                  ? 'Tanaffus (HT)'
                  : match.status === 'second_half'
                  ? `2-bo'lim • ${match.currentMinute || 67}'`
                  : match.status === 'finished'
                  ? 'Tugagan (FT)'
                  : 'Kutilmoqda'}
              </span>
            </div>

            <div className="flex items-center justify-around gap-2">
              {/* Home */}
              <div className="flex-1 text-center min-w-0">
                <span className="block font-bold text-xs sm:text-sm text-slate-100 truncate">
                  {homeTeam?.name}
                </span>
                <span className="text-[10px] text-slate-400">Mezbon</span>
              </div>

              {/* Score */}
              <div className="px-3 py-1.5 bg-slate-800/90 rounded-xl border border-slate-700/60 min-w-[76px] sm:min-w-[90px] shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-wider font-mono text-white">
                  {match.homeScore} : {match.awayScore}
                </span>
              </div>

              {/* Away */}
              <div className="flex-1 text-center min-w-0">
                <span className="block font-bold text-xs sm:text-sm text-slate-100 truncate">
                  {awayTeam?.name}
                </span>
                <span className="text-[10px] text-slate-400">Mehmon</span>
              </div>
            </div>

            {/* Quick Score Tweakers */}
            <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto pb-1">
              <button
                onClick={() =>
                  updateMatchScore(match.id, match.homeScore + 1, match.awayScore)
                }
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-emerald-400 border border-slate-700 whitespace-nowrap"
              >
                +1 {homeTeam?.name.split(' ')[0]}
              </button>
              <button
                onClick={() =>
                  updateMatchScore(
                    match.id,
                    Math.max(0, match.homeScore - 1),
                    match.awayScore
                  )
                }
                className="px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-700 text-[11px] text-slate-400"
              >
                -1
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() =>
                  updateMatchScore(
                    match.id,
                    match.homeScore,
                    Math.max(0, match.awayScore - 1)
                  )
                }
                className="px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-700 text-[11px] text-slate-400"
              >
                -1
              </button>
              <button
                onClick={() =>
                  updateMatchScore(match.id, match.homeScore, match.awayScore + 1)
                }
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-emerald-400 border border-slate-700 whitespace-nowrap"
              >
                +1 {awayTeam?.name.split(' ')[0]}
              </button>
            </div>
          </div>

          {/* Sub Navigation tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/40 shrink-0 text-xs">
            <button
              onClick={() => setActiveTab('goal')}
              className={`flex-1 py-2.5 font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'goal'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Gol</span>
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 py-2.5 font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'card'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Kartochka</span>
            </button>
            <button
              onClick={() => setActiveTab('sub')}
              className={`flex-1 py-2.5 font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'sub'
                  ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Almashtirish</span>
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`flex-1 py-2.5 font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
                activeTab === 'controls'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Holat</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
            {activeTab === 'goal' && (
              <form onSubmit={handleRecordGoal} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Qaysi jamoa gol urdi?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGoalTeamId(match.homeTeamId)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                        currentGoalTeamId === match.homeTeamId
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {homeTeam?.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoalTeamId(match.awayTeamId)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                        currentGoalTeamId === match.awayTeamId
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {awayTeam?.name}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    To'p muallifi (O'yinchi)
                  </label>
                  <select
                    value={goalPlayerId}
                    onChange={(e) => setGoalPlayerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">O'yinchini tanlang...</option>
                    {goalAvailablePlayers.map((player) => (
                      <option key={player.id} value={player.id}>
                        #{player.jerseyNumber} {player.name} ({player.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assist muallifi (Ixtiyoriy)
                  </label>
                  <select
                    value={assistPlayerId}
                    onChange={(e) => setAssistPlayerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Assist yo'q / Tanlanmagan</option>
                    {goalAvailablePlayers
                      .filter((p) => p.id !== goalPlayerId)
                      .map((player) => (
                        <option key={player.id} value={player.id}>
                          #{player.jerseyNumber} {player.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Daqiqa
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={goalMinute}
                      onChange={(e) => setGoalMinute(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={isOwnGoal}
                        onChange={(e) => setIsOwnGoal(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                      />
                      <span>Avtogol</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  Golni rasmiylashtirish
                </button>
              </form>
            )}

            {activeTab === 'card' && (
              <form onSubmit={handleRecordCard} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Qaysi jamoa o'yinchisiga?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCardTeamId(match.homeTeamId)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                        currentCardTeamId === match.homeTeamId
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {homeTeam?.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardTeamId(match.awayTeamId)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                        currentCardTeamId === match.awayTeamId
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {awayTeam?.name}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    O'yinchi
                  </label>
                  <select
                    value={cardPlayerId}
                    onChange={(e) => setCardPlayerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">O'yinchini tanlang...</option>
                    {cardAvailablePlayers.map((player) => (
                      <option key={player.id} value={player.id}>
                        #{player.jerseyNumber} {player.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Kartochka
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCardType('yellow')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                          cardType === 'yellow'
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block"></span>
                        Sariq
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardType('red')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${
                          cardType === 'red'
                            ? 'bg-rose-500 text-white border-rose-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span className="w-2.5 h-3.5 bg-rose-500 rounded-xs inline-block"></span>
                        Qizil
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Daqiqa
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={cardMinute}
                      onChange={(e) => setCardMinute(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  Kartochkani kiritish
                </button>
              </form>
            )}

            {activeTab === 'sub' && (
              <form onSubmit={handleRecordSub} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jamoa
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSubTeamId(match.homeTeamId)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                        currentSubTeamId === match.homeTeamId
                          ? 'border-teal-500 bg-teal-500/10 text-teal-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {homeTeam?.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTeamId(match.awayTeamId)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all truncate ${
                        currentSubTeamId === match.awayTeamId
                          ? 'border-teal-500 bg-teal-500/10 text-teal-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {awayTeam?.name}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400 mb-1">
                      ⬇️ Maydonga tushuvchi
                    </label>
                    <select
                      value={subPlayerInId}
                      onChange={(e) => setSubPlayerInId(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="">Tanlang...</option>
                      {subAvailablePlayers.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.jerseyNumber} {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-rose-400 mb-1">
                      ⬆️ Maydondan chiquvchi
                    </label>
                    <select
                      value={subPlayerOutId}
                      onChange={(e) => setSubPlayerOutId(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="">Tanlang...</option>
                      {subAvailablePlayers
                        .filter((p) => p.id !== subPlayerInId)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            #{p.jerseyNumber} {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Daqiqa
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={subMinute}
                    onChange={(e) => setSubMinute(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-98"
                >
                  <Repeat className="w-4 h-4" />
                  Almashtirishni qayd etish
                </button>
              </form>
            )}

            {activeTab === 'controls' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    O'yin bo'limi & holati
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => updateMatchStatus(match.id, 'first_half', 1)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border text-center ${
                        match.status === 'first_half'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      1-bo'lim
                    </button>
                    <button
                      onClick={() => updateMatchStatus(match.id, 'half_time', 45)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border text-center ${
                        match.status === 'half_time'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      Tanaffus (HT)
                    </button>
                    <button
                      onClick={() => updateMatchStatus(match.id, 'second_half', 46)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border text-center ${
                        match.status === 'second_half'
                          ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      2-bo'lim
                    </button>
                    <button
                      onClick={() => updateMatchStatus(match.id, 'finished', 90)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border text-center ${
                        match.status === 'finished'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      Tugagan (FT)
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFinishMatch}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98"
                  >
                    <CheckCircle className="w-4 h-4" />
                    O'yinni yakunlash & Jadvalni yangilash
                  </button>
                </div>
              </div>
            )}

            {/* Event Log */}
            {(match.goals.length > 0 ||
              match.cards.length > 0 ||
              (match.substitutions && match.substitutions.length > 0)) && (
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-2">
                  Qayd etilgan voqealar ro'yxati
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {match.goals.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-slate-950/40 border border-slate-800"
                    >
                      <span className="text-slate-300 truncate">
                        ⚽ <strong className="text-emerald-400">{g.playerName}</strong>{' '}
                        {g.isOwnGoal && '(avtogol)'}{' '}
                        {g.assistPlayerName && (
                          <span className="text-slate-500">
                            (pas: {g.assistPlayerName})
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-slate-400">{g.minute}'</span>
                    </div>
                  ))}
                  {match.cards.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-slate-950/40 border border-slate-800"
                    >
                      <span className="text-slate-300 truncate">
                        {c.type === 'yellow' ? '🟨' : '🟥'}{' '}
                        <strong className="text-slate-200">{c.playerName}</strong>
                      </span>
                      <span className="font-mono text-slate-400">{c.minute}'</span>
                    </div>
                  ))}
                  {match.substitutions?.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-slate-950/40 border border-slate-800"
                    >
                      <span className="text-slate-300 truncate">
                        🔄 ⬇️ {s.playerInName} / ⬆️ {s.playerOutName}
                      </span>
                      <span className="font-mono text-slate-400">{s.minute}'</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TelegramPostModal
        match={match}
        onClose={() => setIsTelegramOpen(false)}
      />
    </>
  );
};
