import React, { useState } from 'react';
import { Send, Copy, Check, X, Bot, Share2 } from 'lucide-react';
import { Match } from '../types';
import { useLeague } from '../context/LeagueContext';

interface TelegramPostModalProps {
  match: Match | null;
  onClose: () => void;
}

export const TelegramPostModal: React.FC<TelegramPostModalProps> = ({
  match,
  onClose,
}) => {
  const { generateTelegramPost } = useLeague();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'post' | 'bot'>('post');

  if (!match) return null;

  const postText = generateTelegramPost(match.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl safe-area-pb">
        {/* Header */}
        <div className="p-4 bg-[#2AABEE]/10 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2AABEE] text-white flex items-center justify-center shadow-md">
              <Send className="w-5 h-5 -rotate-12" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Telegram Integratsiyasi & Kanal Posti
              </h3>
              <p className="text-[11px] text-slate-400">
                O'yin natijalarini Telegram kanalga bir zumda ulashing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('post')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'post'
                ? 'border-[#2AABEE] text-[#2AABEE] bg-[#2AABEE]/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Kanal uchun post
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'bot'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Telegram Bot Buyruqlari
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {activeTab === 'post' ? (
            <>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs sm:text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner max-h-72 overflow-y-auto">
                {postText}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Telegram kanal adminlari uchun tayyor format
                </span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#2AABEE]/20 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Postni nusxalash</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                O'zLeague Telegram Boti (<code className="text-[#2AABEE]">@OzLeagueBot</code>) orqali foydalanuvchilar to'g'ridan-to'g'ri Telegram messenjerida ma'lumot olishlari mumkin:
              </p>

              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { cmd: '/start', desc: "Botni ishga tushirish va ligani tanlash" },
                  { cmd: '/leagues', desc: "Barcha faol ligalar ro'yxati" },
                  { cmd: '/standings', desc: "Turnir jadvalini olish" },
                  { cmd: '/matches', desc: "Bugungi va jonli o'yinlar hisobi" },
                  { cmd: '/topscorers', desc: "Oltin butsa to'purarlar reytingi" },
                  { cmd: '/team <nomi>', desc: "Jamoa tarkibi va keyingi o'yini" },
                  { cmd: '/player <ism>', desc: "Futbolchi statistikasi" },
                ].map((item) => (
                  <div
                    key={item.cmd}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-[#2AABEE] font-bold">{item.cmd}</span>
                    <span className="text-slate-400 text-[11px] font-sans">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
