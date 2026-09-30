export type UserRole = 'admin' | 'manager' | 'referee' | 'fan' | 'league_manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managedLeagueIds?: string[];
  managedTeamIds?: string[];
  refereeName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type LeagueStatus = 'active' | 'finished' | 'upcoming';

export interface League {
  id: string;
  name: string;
  season: string;
  region: string;
  status: LeagueStatus;
  logoUrl?: string;
  description?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  leagueId: string;
  coach: string;
  city: string;
  logoUrl: string;
  foundedYear?: number;
  homeVenue?: string;
  createdAt: string;
}

export type PlayerPosition = 'Hujumchi' | "O'rta" | 'Himoyachi' | 'Darvozabon';

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: PlayerPosition;
  age: number;
  jerseyNumber: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  avatarUrl?: string;
  matchesPlayed?: number;
  starterMatches?: number;
  minutesPlayed?: number;
  shots?: number;
  passes?: number;
  createdAt: string;
}

export type MatchStatus =
  | 'upcoming'
  | 'first_half'
  | 'half_time'
  | 'second_half'
  | 'finished'
  | 'cancelled'
  | 'live';

export interface MatchGoal {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  teamId: string;
  minute: number;
  isOwnGoal: boolean;
  assistPlayerId?: string;
  assistPlayerName?: string;
  createdAt: string;
}

export interface MatchCard {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  teamId: string;
  type: 'yellow' | 'red';
  minute: number;
  createdAt: string;
}

export interface Substitution {
  id: string;
  matchId: string;
  teamId: string;
  playerInId: string;
  playerInName: string;
  playerOutId: string;
  playerOutName: string;
  minute: number;
  createdAt: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  teamId: string;
  playerId?: string;
  eventType: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'penalty';
  minute: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface MatchStats {
  homePossession: number;
  awayPossession: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeFouls: number;
  awayFouls: number;
  homeCorners: number;
  awayCorners: number;
}

export interface Match {
  id: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: string; // ISO format or YYYY-MM-DD HH:mm
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  venue: string;
  refereeName?: string;
  currentMinute?: number;
  goals: MatchGoal[];
  cards: MatchCard[];
  substitutions?: Substitution[];
  events?: MatchEvent[];
  stats?: MatchStats;
  aiSummary?: string;
  createdAt: string;
}

export interface Standing {
  id: string;
  leagueId: string;
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form?: ('W' | 'D' | 'L')[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match_start' | 'goal' | 'match_end' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface TournamentBracketMatch {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  winnerTeamId?: string;
  matchDate?: string;
  date?: string;
  venue?: string;
  isFinished?: boolean;
}

export interface TournamentRound {
  id: string;
  tournamentId: string;
  name: string;
  roundNumber: number;
  matches: TournamentBracketMatch[];
}

export interface Tournament {
  id: string;
  name: string;
  season: string;
  type: 'Knockout' | 'Group Stage + Knockout' | 'League';
  status: 'upcoming' | 'active' | 'finished';
  rounds: TournamentRound[];
  winnerTeamId?: string;
  createdAt?: string;
}
