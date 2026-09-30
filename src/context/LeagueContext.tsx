import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  League,
  Team,
  Player,
  Match,
  Standing,
  User,
  UserRole,
  MatchGoal,
  MatchCard,
  Substitution,
  Tournament,
  AppNotification,
  MatchStatus,
} from '../types';
import {
  INITIAL_LEAGUES,
  INITIAL_TEAMS,
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_STANDINGS,
  INITIAL_USERS,
  INITIAL_TOURNAMENT,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';
import {
  getStoredToken,
  setStoredToken,
  loginApi,
  registerApi,
  quickSwitchApi,
  updateUserRoleApi,
} from '../services/api';

interface LeagueContextType {
  leagues: League[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  standings: Standing[];
  tournaments: Tournament[];
  notifications: AppNotification[];
  favorites: string[];
  currentUser: User;
  users: User[];
  authToken: string | null;
  selectedLeagueId: string;
  setSelectedLeagueId: (id: string) => void;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;

  // Authentication & RBAC
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  switchAuthenticatedUser: (role: UserRole) => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (userId: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Favorites
  toggleFavorite: (teamId: string) => void;
  isFavorite: (teamId: string) => boolean;

  // Notifications
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;

  // League CRUD
  addLeague: (league: Omit<League, 'id' | 'createdAt'>) => League;
  updateLeague: (id: string, updates: Partial<League>) => void;
  deleteLeague: (id: string) => void;

  // Team CRUD
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Team;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Player CRUD
  addPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => Player;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Match CRUD & Live Management
  addMatch: (match: Omit<Match, 'id' | 'goals' | 'cards' | 'createdAt'>) => Match;
  updateMatchScore: (id: string, homeScore: number, awayScore: number) => void;
  updateMatchStatus: (id: string, status: MatchStatus, minute?: number) => void;
  addGoalToMatch: (
    matchId: string,
    playerId: string,
    teamId: string,
    minute: number,
    isOwnGoal: boolean,
    assistPlayerId?: string
  ) => void;
  addCardToMatch: (
    matchId: string,
    playerId: string,
    teamId: string,
    type: 'yellow' | 'red',
    minute: number
  ) => void;
  addSubstitutionToMatch: (
    matchId: string,
    teamId: string,
    playerInId: string,
    playerOutId: string,
    minute: number
  ) => void;
  finishMatch: (matchId: string) => void;

  // Tournament
  updateTournamentMatchScore: (
    tournamentId: string,
    roundId: string,
    matchId: string,
    homeScore: number,
    awayScore: number
  ) => void;

  // Telegram & AI helpers
  generateTelegramPost: (matchId: string) => string;
  generateAiMatchSummary: (matchId: string) => string;

  // General Helpers
  recalculateStandings: (leagueId: string) => void;
  resetToDefault: () => void;
  getTeamById: (teamId: string) => Team | undefined;
  getPlayerById: (playerId: string) => Player | undefined;
  getLeagueById: (leagueId: string) => League | undefined;
}

const STORAGE_KEY = 'ozleague_storage_v2';

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [leagues, setLeagues] = useState<League[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_leagues`);
      return saved ? JSON.parse(saved) : INITIAL_LEAGUES;
    } catch {
      return INITIAL_LEAGUES;
    }
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_players`);
      return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
    } catch {
      return INITIAL_PLAYERS;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_matches`);
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [standings, setStandings] = useState<Standing[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_standings`);
      return saved ? JSON.parse(saved) : INITIAL_STANDINGS;
    } catch {
      return INITIAL_STANDINGS;
    }
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tournaments`);
      return saved ? JSON.parse(saved) : [INITIAL_TOURNAMENT];
    } catch {
      return [INITIAL_TOURNAMENT];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_favorites`);
      return saved ? JSON.parse(saved) : ['team-navbahor', 'team-chilonzor'];
    } catch {
      return ['team-navbahor', 'team-chilonzor'];
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users_list`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(() => getStoredToken());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('all');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_leagues`, JSON.stringify(leagues));
      localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
      localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
      localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(matches));
      localStorage.setItem(`${STORAGE_KEY}_standings`, JSON.stringify(standings));
      localStorage.setItem(`${STORAGE_KEY}_tournaments`, JSON.stringify(tournaments));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_favorites`, JSON.stringify(favorites));
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_users_list`, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [
    leagues,
    teams,
    players,
    matches,
    standings,
    tournaments,
    notifications,
    favorites,
    currentUser,
    users,
  ]);

  // Real login API call
  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAuthToken(res.token || null);
      addNotification(
        'Xush kelibsiz!',
        `${res.user.name} sifatida tizimga muvaffaqiyatli kirdingiz.`,
        'system'
      );
      return { success: true, message: res.message, user: res.user };
    } else {
      // Fallback to local users list if offline
      const local = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (local && (password.length >= 4)) {
        setCurrentUser(local);
        const dummyToken = `ozl_${local.role}_${Date.now()}`;
        setStoredToken(dummyToken);
        setAuthToken(dummyToken);
        return { success: true, message: 'Tizimga kirildi', user: local };
      }
      return { success: false, message: res.message || "Email yoki parol noto'g'ri" };
    }
  };

  // Real register API call
  const register = async (name: string, email: string, password: string, role: UserRole = 'fan') => {
    const res = await registerApi(name, email, password, role);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAuthToken(res.token || null);
      setUsers((prev) => [...prev, res.user!]);
      addNotification(
        'Xush kelibsiz!',
        `O'zLeague platformasida yangi akkaunt yaratildi.`,
        'system'
      );
      return { success: true, message: res.message, user: res.user };
    }
    return { success: false, message: res.message || "Ro'yxatdan o'tishda xatolik yuz berdi" };
  };

  const logout = () => {
    setStoredToken(null);
    setAuthToken(null);
    const fanUser = users.find((u) => u.role === 'fan') || {
      id: 'guest',
      name: 'Mehmon Muxlis',
      email: 'guest@ozleague.uz',
      role: 'fan',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(fanUser);
    addNotification('Tizimdan chiqildi', 'Siz hisobdan chiqdingiz.', 'system');
  };

  // Quick switch role with real JWT signing
  const switchAuthenticatedUser = async (role: UserRole) => {
    const res = await quickSwitchApi(role);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAuthToken(res.token || null);
      addNotification(
        'Rol almashtirildi',
        `Hozirgi profil: ${res.user.name} (${res.user.role.toUpperCase()})`,
        'system'
      );
    } else {
      switchUserRole(role);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    await updateUserRoleApi(userId, newRole);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, role: newRole };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    addNotification(
      'Rol yangilandi',
      `Foydalanuvchi roli ${newRole} ga o'zgartirildi.`,
      'system'
    );
  };

  const addUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const created: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, created]);
    addNotification('Foydalanuvchi yaratildi', `${created.name} (${created.role}) ro'yxatga olindi.`, 'system');
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addNotification("Foydalanuvchi o'chirildi", "Foydalanuvchi tizimdan muvaffaqiyatli o'chirildi.", 'system');
  };

  const switchUserRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser({
        id: `user-${role}`,
        name:
          role === 'admin'
            ? 'Bosh Administrator'
            : role === 'referee'
            ? 'Bosh Hakam'
            : role === 'manager' || role === 'league_manager'
            ? 'Liga Boshqaruvchisi'
            : 'Futbol Muxlisi',
        email: `${role}@ozleague.uz`,
        role,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const toggleFavorite = (teamId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(teamId);
      const updated = exists ? prev.filter((id) => id !== teamId) : [...prev, teamId];
      if (!exists) {
        const team = teams.find((t) => t.id === teamId);
        addNotification(
          '⭐ Sevimli jamoa qo\'shildi',
          `Siz ${team?.name || 'Jamoa'}ni sevimli jamoalaringiz ro'yxatiga kiritdingiz!`,
          'system'
        );
      }
      return updated;
    });
  };

  const isFavorite = (teamId: string) => favorites.includes(teamId);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'system'
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const getTeamById = (teamId: string) => teams.find((t) => t.id === teamId);
  const getPlayerById = (playerId: string) => players.find((p) => p.id === playerId);
  const getLeagueById = (leagueId: string) => leagues.find((l) => l.id === leagueId);

  // Recalculate Standings dynamically
  const recalculateStandings = (leagueId: string) => {
    const leagueTeams = teams.filter((t) => t.leagueId === leagueId);
    const leagueFinishedMatches = matches.filter(
      (m) => m.leagueId === leagueId && m.status === 'finished'
    );

    const newStandings: Standing[] = leagueTeams.map((team) => {
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;
      const form: ('W' | 'D' | 'L')[] = [];

      leagueFinishedMatches.forEach((m) => {
        if (m.homeTeamId === team.id) {
          played += 1;
          goalsFor += m.homeScore;
          goalsAgainst += m.awayScore;
          if (m.homeScore > m.awayScore) {
            won += 1;
            form.push('W');
          } else if (m.homeScore === m.awayScore) {
            drawn += 1;
            form.push('D');
          } else {
            lost += 1;
            form.push('L');
          }
        } else if (m.awayTeamId === team.id) {
          played += 1;
          goalsFor += m.awayScore;
          goalsAgainst += m.homeScore;
          if (m.awayScore > m.homeScore) {
            won += 1;
            form.push('W');
          } else if (m.awayScore === m.homeScore) {
            drawn += 1;
            form.push('D');
          } else {
            lost += 1;
            form.push('L');
          }
        }
      });

      const points = won * 3 + drawn * 1;
      return {
        id: `st-${team.id}`,
        leagueId,
        teamId: team.id,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        points,
        form: form.slice(-5),
      };
    });

    newStandings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });

    setStandings((prev) => [
      ...prev.filter((s) => s.leagueId !== leagueId),
      ...newStandings,
    ]);
  };

  // League CRUD
  const addLeague = (data: Omit<League, 'id' | 'createdAt'>): League => {
    const newLeague: League = {
      ...data,
      id: `league-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLeagues((prev) => [...prev, newLeague]);
    return newLeague;
  };

  const updateLeague = (id: string, updates: Partial<League>) => {
    setLeagues((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const deleteLeague = (id: string) => {
    setLeagues((prev) => prev.filter((l) => l.id !== id));
    setTeams((prev) => prev.filter((t) => t.leagueId !== id));
    setMatches((prev) => prev.filter((m) => m.leagueId !== id));
    setStandings((prev) => prev.filter((s) => s.leagueId !== id));
  };

  // Team CRUD
  const addTeam = (data: Omit<Team, 'id' | 'createdAt'>): Team => {
    const newTeam: Team = {
      ...data,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTeams((prev) => [...prev, newTeam]);
    setStandings((prev) => [
      ...prev,
      {
        id: `st-${newTeam.id}`,
        leagueId: newTeam.leagueId,
        teamId: newTeam.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        form: [],
      },
    ]);
    return newTeam;
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    setPlayers((prev) => prev.filter((p) => p.teamId !== id));
    setStandings((prev) => prev.filter((s) => s.teamId !== id));
    setMatches((prev) =>
      prev.filter((m) => m.homeTeamId !== id && m.awayTeamId !== id)
    );
  };

  // Player CRUD
  const addPlayer = (data: Omit<Player, 'id' | 'createdAt'>): Player => {
    const newPlayer: Player = {
      ...data,
      id: `player-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPlayers((prev) => [...prev, newPlayer]);
    return newPlayer;
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  // Match CRUD & Live Management
  const addMatch = (
    data: Omit<Match, 'id' | 'goals' | 'cards' | 'createdAt'>
  ): Match => {
    const newMatch: Match = {
      ...data,
      id: `match-${Date.now()}`,
      goals: [],
      cards: [],
      substitutions: [],
      events: [],
      createdAt: new Date().toISOString(),
    };
    setMatches((prev) => [newMatch, ...prev]);

    // Check favorites to notify
    const homeTeam = getTeamById(data.homeTeamId);
    const awayTeam = getTeamById(data.awayTeamId);
    if (isFavorite(data.homeTeamId) || isFavorite(data.awayTeamId)) {
      addNotification(
        '📅 Yangi o\'yin rejalashtirildi',
        `${homeTeam?.name} va ${awayTeam?.name} o'yini belgilandi: ${data.matchDate}`,
        'match_start'
      );
    }

    return newMatch;
  };

  const updateMatchScore = (
    id: string,
    homeScore: number,
    awayScore: number
  ) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, homeScore, awayScore } : m))
    );
  };

  const updateMatchStatus = (
    id: string,
    status: MatchStatus,
    minute?: number
  ) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = {
            ...m,
            status,
            ...(minute !== undefined ? { currentMinute: minute } : {}),
          };

          // If starting or moving to live
          if (status === 'first_half' || status === 'live') {
            const home = getTeamById(m.homeTeamId)?.name;
            const away = getTeamById(m.awayTeamId)?.name;
            addNotification(
              '🔥 O\'YIN BOSHLANDI!',
              `${home} va ${away} to'qnashuvi start oldi!`,
              'match_start'
            );
          }
          return updated;
        }
        return m;
      })
    );
  };

  const addGoalToMatch = (
    matchId: string,
    playerId: string,
    teamId: string,
    minute: number,
    isOwnGoal: boolean,
    assistPlayerId?: string
  ) => {
    const player = getPlayerById(playerId);
    const assistPlayer = assistPlayerId ? getPlayerById(assistPlayerId) : undefined;
    const team = getTeamById(teamId);

    const newGoal: MatchGoal = {
      id: `goal-${Date.now()}`,
      matchId,
      playerId,
      playerName: player ? player.name : "Noma'lum futbolchi",
      teamId,
      minute,
      isOwnGoal,
      assistPlayerId,
      assistPlayerName: assistPlayer?.name,
      createdAt: new Date().toISOString(),
    };

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const isHome = m.homeTeamId === teamId;
          const updatedHomeScore = isHome ? m.homeScore + 1 : m.homeScore;
          const updatedAwayScore = !isHome ? m.awayScore + 1 : m.awayScore;
          return {
            ...m,
            homeScore: updatedHomeScore,
            awayScore: updatedAwayScore,
            goals: [...m.goals, newGoal],
          };
        }
        return m;
      })
    );

    // Update player goals
    if (!isOwnGoal && playerId) {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            return {
              ...p,
              goals: p.goals + 1,
              shots: (p.shots || 0) + 1,
            };
          }
          if (assistPlayerId && p.id === assistPlayerId) {
            return {
              ...p,
              assists: p.assists + 1,
            };
          }
          return p;
        })
      );
    }

    // Send push notification
    addNotification(
      `⚽️ GOL! ${minute}' ${player?.name || 'Futbolchi'}`,
      `${team?.name || 'Jamoa'} hisobni o'zgartirdi!`,
      'goal'
    );
  };

  const addCardToMatch = (
    matchId: string,
    playerId: string,
    teamId: string,
    type: 'yellow' | 'red',
    minute: number
  ) => {
    const player = getPlayerById(playerId);
    const newCard: MatchCard = {
      id: `card-${Date.now()}`,
      matchId,
      playerId,
      playerName: player ? player.name : "Noma'lum futbolchi",
      teamId,
      type,
      minute,
      createdAt: new Date().toISOString(),
    };

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, cards: [...m.cards, newCard] } : m
      )
    );

    if (playerId) {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            return {
              ...p,
              yellowCards: type === 'yellow' ? p.yellowCards + 1 : p.yellowCards,
              redCards: type === 'red' ? p.redCards + 1 : p.redCards,
            };
          }
          return p;
        })
      );
    }
  };

  const addSubstitutionToMatch = (
    matchId: string,
    teamId: string,
    playerInId: string,
    playerOutId: string,
    minute: number
  ) => {
    const pIn = getPlayerById(playerInId);
    const pOut = getPlayerById(playerOutId);

    const sub: Substitution = {
      id: `sub-${Date.now()}`,
      matchId,
      teamId,
      playerInId,
      playerInName: pIn ? pIn.name : 'Zaxiradan tushgan',
      playerOutId,
      playerOutName: pOut ? pOut.name : 'Maydonni tark etgan',
      minute,
      createdAt: new Date().toISOString(),
    };

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              substitutions: [...(m.substitutions || []), sub],
            }
          : m
      )
    );
  };

  const finishMatch = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    const summary = generateAiMatchSummary(matchId);

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'finished',
              currentMinute: 90,
              aiSummary: summary,
            }
          : m
      )
    );

    const home = getTeamById(match.homeTeamId)?.name;
    const away = getTeamById(match.awayTeamId)?.name;
    addNotification(
      '🏁 O\'YIN YAKUNLANDI!',
      `${home} ${match.homeScore} : ${match.awayScore} ${away}. Turnir jadvali yangilandi.`,
      'match_end'
    );

    setTimeout(() => {
      recalculateStandings(match.leagueId);
    }, 50);
  };

  // Tournament Bracket
  const updateTournamentMatchScore = (
    tournamentId: string,
    roundId: string,
    bracketMatchId: string,
    homeScore: number,
    awayScore: number
  ) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            rounds: t.rounds.map((r) => {
              if (r.id === roundId) {
                return {
                  ...r,
                  matches: r.matches.map((bm) => {
                    if (bm.id === bracketMatchId) {
                      const winnerId =
                        homeScore > awayScore
                          ? bm.homeTeamId
                          : awayScore > homeScore
                          ? bm.awayTeamId
                          : bm.homeTeamId;
                      return {
                        ...bm,
                        homeScore,
                        awayScore,
                        winnerTeamId: winnerId,
                        isFinished: true,
                      };
                    }
                    return bm;
                  }),
                };
              }
              return r;
            }),
          };
        }
        return t;
      })
    );
  };

  // AI & Telegram Post Helpers
  const generateTelegramPost = (matchId: string) => {
    const m = matches.find((match) => match.id === matchId);
    if (!m) return "O'yin topilmadi";
    const home = getTeamById(m.homeTeamId)?.name || 'Mezbon';
    const away = getTeamById(m.awayTeamId)?.name || 'Mehmon';
    const league = getLeagueById(m.leagueId)?.name || "O'zLeague 2.0";

    const goalsList =
      m.goals.length > 0
        ? m.goals
            .map(
              (g) =>
                `⚽ ${g.minute}' ${g.playerName} ${g.isOwnGoal ? '(avtogol)' : ''}`
            )
            .join('\n')
        : "Hozircha gollar yo'q";

    const cardsList =
      m.cards.length > 0
        ? m.cards
            .map(
              (c) =>
                `${c.type === 'yellow' ? '🟨' : '🟥'} ${c.minute}' ${c.playerName}`
            )
            .join('\n')
        : '';

    return `⚡️ O'ZLEAGUE 2.0 — ${m.status === 'finished' ? 'O\'YIN YAKUNLANDI' : 'JONLI NATIJA'}\n\n🏆 ${league}\n🏟 ${m.venue}\n\n🔥 ${home.toUpperCase()}  ${m.homeScore} : ${m.awayScore}  ${away.toUpperCase()}\n⏱ Daqiqa: ${m.status === 'finished' ? 'FT (90\')' : `${m.currentMinute || 45}'`}\n\n${goalsList}\n${cardsList ? `\nKartochkalar:\n${cardsList}\n` : ''}\n🔗 Batafsil: https://ozleague.uz/matches/${m.id}\n📲 @OzLeagueOfficial`;
  };

  const generateAiMatchSummary = (matchId: string) => {
    const m = matches.find((match) => match.id === matchId);
    if (!m) return '';
    const home = getTeamById(m.homeTeamId)?.name || 'Mezbon';
    const away = getTeamById(m.awayTeamId)?.name || 'Mehmon';

    if (m.homeScore > m.awayScore) {
      return `${home} o'z maydonida ${away} ustidan ${m.homeScore}:${m.awayScore} hisobida ishonchli g'alaba qozondi va turnir jadvalida 3 ochkoni qo'lga kiritdi.`;
    } else if (m.awayScore > m.homeScore) {
      return `${away} safarda ${home} ustidan ${m.awayScore}:${m.homeScore} hisobida ajoyib irodali g'alabaga erishdi.`;
    } else {
      return `${home} va ${away} o'rtasidagi shiddatli bahs ${m.homeScore}:${m.awayScore} durang bilan yakunlandi va tomonlar 1 tadan ochko bo'lishib oldi.`;
    }
  };

  const resetToDefault = () => {
    setLeagues(INITIAL_LEAGUES);
    setTeams(INITIAL_TEAMS);
    setPlayers(INITIAL_PLAYERS);
    setMatches(INITIAL_MATCHES);
    setStandings(INITIAL_STANDINGS);
    setTournaments([INITIAL_TOURNAMENT]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFavorites(['team-navbahor', 'team-chilonzor']);
    setSelectedLeagueId('all');
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
  };

  return (
    <LeagueContext.Provider
      value={{
        leagues,
        teams,
        players,
        matches,
        standings,
        tournaments,
        notifications,
        favorites,
        currentUser,
        users,
        authToken,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        logout,
        switchAuthenticatedUser,
        updateUserRole,
        addUser,
        deleteUser,
        selectedLeagueId,
        setSelectedLeagueId,
        setCurrentUser,
        switchUserRole,
        toggleFavorite,
        isFavorite,
        markNotificationRead,
        addNotification,
        addLeague,
        updateLeague,
        deleteLeague,
        addTeam,
        updateTeam,
        deleteTeam,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addMatch,
        updateMatchScore,
        updateMatchStatus,
        addGoalToMatch,
        addCardToMatch,
        addSubstitutionToMatch,
        finishMatch,
        updateTournamentMatchScore,
        generateTelegramPost,
        generateAiMatchSummary,
        recalculateStandings,
        resetToDefault,
        getTeamById,
        getPlayerById,
        getLeagueById,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
};
