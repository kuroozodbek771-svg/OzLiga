import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Trophy,
  Shield,
  HelpCircle,
  Award,
  RefreshCw,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { GoogleGenAI } from '@google/genai';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { leagues, teams, players, matches, standings, getTeamById } =
    useLeague();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Assalomu alaykum! Men **O'zLeague AI Yordamchisiman**. O'zbekistondagi mahalliy futbol ligalari, jamoalar, turnir jadvali, to'purarlar, hakamlik qoidalari yoki platforma kodi (SQL, Express, React) bo'yicha har qanday savolingizga javob berishga tayyorman. Sizga qanday yordam bera olaman?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Generate context for AI prompt
  const getPlatformContext = () => {
    const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
    const topScorerTeam = topScorer ? getTeamById(topScorer.teamId)?.name : '';
    const activeLeagues = leagues.map((l) => `${l.name} (${l.region})`).join(', ');

    return `Siz O'zLeague platformasining AI yordamchisisiz.
Platforma holati:
- Faol ligalar: ${activeLeagues}
- Jami jamoalar soni: ${teams.length}
- Jami o'yinlar: ${matches.length}
- Hozirgi eng yaxshi to'purar: ${topScorer?.name} (${topScorerTeam}) - ${topScorer?.goals} ta gol.
- Tizim: React, Tailwind CSS, Node.js Express, PostgreSQL.
Iltimos, O'zbek tilida aniq, do'stona va professional javob bering.`;
  };

  const handleSend = async (customPrompt?: string) => {
    const userQuery = customPrompt || input;
    if (!userQuery.trim() || loading) return;

    const newMsgs: Message[] = [
      ...messages,
      { role: 'user', content: userQuery },
    ];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${getPlatformContext()}\n\nFoydalanuvchi savoli: ${userQuery}`,
                },
              ],
            },
          ],
        });

        const reply =
          response.text ||
          "Kechirasiz, javob olishda xatolik yuz berdi.";
        setMessages([...newMsgs, { role: 'assistant', content: reply }]);
      } else {
        // High quality intelligent response generator
        let reply = '';
        const q = userQuery.toLowerCase();

        if (q.includes("to'purar") || q.includes('oltin butsa') || q.includes('gol')) {
          const top3 = [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);
          reply = `🏆 **Hozirgi mavsum to'purarlari:**\n\n1. 🥇 **${top3[0]?.name}** (${getTeamById(top3[0]?.teamId)?.name}) — **${top3[0]?.goals} ta gol**\n2. 🥈 **${top3[1]?.name}** (${getTeamById(top3[1]?.teamId)?.name}) — **${top3[1]?.goals} ta gol**\n3. 🥉 **${top3[2]?.name}** (${getTeamById(top3[2]?.teamId)?.name}) — **${top3[2]?.goals} ta gol**\n\nO'yinchilarning to'liq ro'yxati va assistlarini **"O'yinchilar"** bo'limida ko'rishingiz mumkin.`;
        } else if (q.includes('jadval') || q.includes('peshqadam') || q.includes('ochko')) {
          const tplStandings = standings.filter((s) => s.leagueId === 'league-tpl');
          const leader = tplStandings.sort((a, b) => b.points - a.points)[0];
          const leaderTeam = leader ? getTeamById(leader.teamId)?.name : 'Chilonzor FC';
          reply = `📊 **Turnir jadvali holati:**\n\nToshkent Havaskorlar Premer Ligasida hozirda **"${leaderTeam}"** jamoasi **${leader?.points || 13} ochko** bilan 1-o'rinni egallab turibdi. (${leader?.won || 4} g'alaba, ${leader?.drawn || 1} durang).\n\nTo'liq jadvalni **"Turnir Jadvali"** sahifasida ko'rishingiz mumkin!`;
        } else if (q.includes('hakam') || q.includes('qoida') || q.includes('kartochka')) {
          reply = `⏱️ **O'zLeague hakamlik qoidalari:**\n\n1. **G'alaba va Ochkolar:** G'alabaga 3 ochko, durangga 1 ochko, mag'lubiyatga 0 ochko beriladi.\n2. **Kartochkalar:** Bitta o'yinda 2 ta sariq yoki to'g'ridan-to'g'ri qizil kartochka olgan o'yinchi avtomatik ravishda keyingi turni o'tkazib yuboradi.\n3. **Hakamlik qilish:** Sayt tepasidagi rolni **"Hakam"**ga o'tkazsangiz, har qanday o'yinda to'p mualliflarini kiritish va o'yinni yakunlash imkoniga ega bo'lasiz.`;
        } else if (q.includes('api') || q.includes('sql') || q.includes('kod')) {
          reply = `💻 **O'zLeague Texnik Arxitekturasi:**\n\n- **Database:** PostgreSQL (8 ta jadval: users, leagues, teams, players, matches, goals, standings, cards)\n- **Backend:** Node.js + Express.js API\n- **Frontend:** React + Tailwind CSS\n- To'liq \`schema.sql\` va Express route kodlarini **"DB & API Sxema"** sahifasidan ko'chirib olishingiz mumkin.`;
        } else {
          reply = `⚽ **O'zLeague AI Yordamchisi javobi:**\n\nSizning savolingiz: "${userQuery}".\n\nO'zLeague platformasida hozirda **${leagues.length} ta liga**, **${teams.length} ta jamoa** va **${matches.length} ta o'yin** ro'yxatdan o'tgan. Siz jamoalar qo'shishingiz, o'yinlar natijasini hakam sifatida kiritishingiz va to'purarlar jadvalini kuzatishingiz mumkin.`;
        }

        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        }, 400);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Kechirasiz, xatolik yuz berdi: " + (e?.message || 'Tarmoq xatosi'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-xl h-[88vh] sm:h-[600px] flex flex-col overflow-hidden shadow-2xl safe-area-pb">
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 rounded-full bg-slate-700 mx-auto mt-2 shrink-0"></div>

        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-1.5 font-['Cabinet_Grotesk']">
                O'zLeague <span className="text-emerald-400">AI Yordamchisi</span>
              </h3>
              <p className="text-xs text-slate-400">
                O'zbek futbol ligasi bo'yicha aqlli assistent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() =>
              handleSend("Top to'purarlar ro'yxati kimlar va nechta gol urgan?")
            }
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/60"
          >
            🏆 Top to'purarlar
          </button>
          <button
            onClick={() =>
              handleSend("Turnir jadvali va peshqadam jamoa haqida aytib ber")
            }
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/60"
          >
            📊 Peshqadam kim?
          </button>
          <button
            onClick={() =>
              handleSend("Hakamlik qilishda hisob kiritish va qoidalar qanday?")
            }
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/60"
          >
            ⏱️ Hakamlik qoidalari
          </button>
          <button
            onClick={() =>
              handleSend("PostgreSQL schema va Express arxitekturasi qanday?")
            }
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/60"
          >
            💻 SQL & API tuzilmasi
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}
              >
                {m.role === 'user' ? 'Siz' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-xs'
                    : 'bg-slate-950/70 text-slate-200 border border-slate-800 rounded-tl-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>O'zLeague AI javob tayyorlamoqda...</span>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="O'zLeague haqida savolingizni yozing..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
