import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, Shield, Flame, X } from 'lucide-react';
import { useLeague } from '../context/LeagueContext';

export const NotificationsDropdown: React.FC = () => {
  const { notifications, markNotificationRead } = useLeague();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        title="Bildirishnomalar"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Bildirishnomalar</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                  {unreadCount} yangi
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() =>
                  notifications.forEach((n) => markNotificationRead(n.id))
                }
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Barchasi o'qildi
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Hozircha bildirishnomalar yo'q
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                    !notif.isRead
                      ? 'bg-slate-950/70 border border-emerald-500/20'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5
                      className={`text-xs font-bold ${
                        !notif.isRead ? 'text-emerald-300' : 'text-slate-200'
                      }`}
                    >
                      {notif.title}
                    </h5>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
