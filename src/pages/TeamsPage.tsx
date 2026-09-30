import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Users,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Award,
} from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { Team, Player } from '../types';

interface TeamsPageProps {
  onSelectTeam?: (team: Team) => void;
  onSelectPlayer?: (player: Player) => void;
}

export const TeamsPage: React.FC<TeamsPageProps> = ({
  onSelectTeam,
  onSelectPlayer,
}) => {
  const {
    teams,
    leagues,
    players,
    standings,
    matches,
    selectedLeagueId,
    currentUser,
    addTeam,
    getLeagueById,
  } = useLeague();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState<boolean>(false);

  // New team form
  const [name, setName] = useState('');
  const [leagueId, setLeagueId] = useState(
    selectedLeagueId !== 'all' ? selectedLeagueId : leagues[0]?.id || ''
  );
  const [coach, setCoach] = useState('');
  const [city, setCity] = useState('');
  const [homeVenue, setHomeVenue] = useState('');
  const [foundedYear, setFoundedYear] = useState<number>(2023);
  const [logoUrl, setLogoUrl] = useState('');

  const filteredTeams =
    selectedLeagueId === 'all'
      ? teams
      : teams.filter((t) => t.leagueId === selectedLeagueId);

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTeam({
      name,
      leagueId,
      coach: coach || 'Bosh murabbiy',
      city: city || 'Toshkent',
      homeVenue: homeVenue || 'Mahalla stadioni',
      foundedYear: Number(foundedYear) || 2024,
      logoUrl:
        logoUrl ||
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=100&q=80',
    });

    setName('');
    setCoach('');
    setCity('');
    setHomeVenue('');
    setIsAddTeamOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-400" />
            Liganing Futbol Jamoalari
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Barcha klublar, bosh murabbiylar, stadionlar va o'yinchilar tarkibi
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setIsAddTeamOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi jamoa qo'shish</span>
          </button>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team) => {
          const teamLeague = getLeagueById(team.leagueId);
          const teamPlayers = players.filter((p) => p.teamId === team.id);
          const standing = standings.find((s) => s.teamId === team.id);
          const topScorer = [...teamPlayers].sort(
            (a, b) => b.goals - a.goals
          )[0];

          return (
            <div
              key={team.id}
              onClick={() => (onSelectTeam ? onSelectTeam(team) : setSelectedTeam(team))}
              className="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header: Logo, Name & City */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0 p-1 group-hover:scale-105 transition-transform shadow-md">
                    {team.logoUrl ? (
                      <img
                        src={team.logoUrl}
                        alt={team.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Shield className="w-7 h-7 text-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mb-1">
                      {teamLeague?.name || 'Liga'}
                    </span>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors truncate">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {team.city}
                    </p>
                  </div>
                </div>

                {/* Team meta facts */}
                <div className="mt-5 grid grid-cols-2 gap-2 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">
                      Bosh murabbiy:
                    </span>
                    <strong className="text-slate-200 truncate block">
                      {team.coach}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">
                      Uy stadioni:
                    </span>
                    <strong className="text-slate-200 truncate block">
                      {team.homeVenue || 'Mahalla maydoni'}
                    </strong>
                  </div>
                </div>

                {/* Quick stats: Players count & Points */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {teamPlayers.length} ta o'yinchi
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {standing?.points || 0} ochko ({standing?.won || 0}G' - {standing?.drawn || 0}D)
                  </span>
                </div>
              </div>

              {/* View roster button */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Tarkibni ko'rish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Roster Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl safe-area-pb">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  {selectedTeam.logoUrl ? (
                    <img
                      src={selectedTeam.logoUrl}
                      alt={selectedTeam.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    {selectedTeam.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                    {selectedTeam.city} • Murabbiy: {selectedTeam.coach}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: Player List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Jamoa O'yinchilari</span>
                </h4>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  {players.filter((p) => p.teamId === selectedTeam.id).length} ta o'yinchi
                </span>
              </div>

              <div className="space-y-2">
                {players
                  .filter((p) => p.teamId === selectedTeam.id)
                  .map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[11px] sm:text-xs flex items-center justify-center border border-slate-700 shrink-0">
                          #{player.jerseyNumber}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-100 block truncate">
                            {player.name}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-slate-400">
                            {player.position} • {player.age} yosh
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono shrink-0 ml-2">
                        <span className="text-emerald-400 font-bold">
                          ⚽ {player.goals}
                        </span>
                        <span className="text-slate-400">
                          👟 {player.assists}
                        </span>
                        {(player.yellowCards > 0 || player.redCards > 0) && (
                          <div className="flex items-center gap-0.5">
                            {player.yellowCards > 0 && (
                              <span className="text-amber-400 font-bold text-[10px]">
                                {player.yellowCards}🟨
                              </span>
                            )}
                            {player.redCards > 0 && (
                              <span className="text-rose-400 font-bold text-[10px]">
                                {player.redCards}🟥
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {isAddTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl safe-area-pb">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 sticky top-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Yangi Jamoa Qo'shish
              </h3>
              <button
                onClick={() => setIsAddTeamOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeamSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jamoa nomi
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Paxtakor Mahalla FC"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Qaysi ligaga biriktiriladi?
                </label>
                <select
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Shahar / Tuman
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Toshkent, Mirzo Ulug'bek"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bosh murabbiy
                  </label>
                  <input
                    type="text"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    placeholder="Aziz Karimov"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Uy maydoni / Stadion
                </label>
                <input
                  type="text"
                  value={homeVenue}
                  onChange={(e) => setHomeVenue(e.target.value)}
                  placeholder="Yunusobod 12-maktab maydoni"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeamOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Jamoani saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
