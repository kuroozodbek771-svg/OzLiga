-- ====================================================================
-- O'zLeague 2.0 — PostgreSQL Database Schema
-- To'liq ishlab chiqilgan ma'lumotlar bazasi arxitekturasi
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. FOYDALANUVCHILAR VA ROLLARI
-- Rol turlari: 'admin', 'manager', 'referee', 'fan'
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'fan' CHECK (role IN ('admin', 'manager', 'referee', 'fan')),
    referee_name VARCHAR(150),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. LIGALAR (Leagues)
CREATE TABLE IF NOT EXISTS leagues (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    season VARCHAR(50) NOT NULL,
    region VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('active', 'finished', 'upcoming')),
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. JAMOLAR (Teams)
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    league_id VARCHAR(100) REFERENCES leagues(id) ON DELETE CASCADE,
    coach VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    logo_url TEXT,
    founded_year INT DEFAULT 2024,
    home_venue VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MENEJER BIRIKTIRMALARI (Manager Assignments)
-- Manager faqat o'ziga biriktirilgan ligalar va jamoalarni boshqarishi uchun
CREATE TABLE IF NOT EXISTS manager_leagues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    league_id VARCHAR(100) REFERENCES leagues(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, league_id)
);

CREATE TABLE IF NOT EXISTS manager_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, team_id)
);

-- 6. FUTBOLCHILAR (Players)
CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    position VARCHAR(50) NOT NULL CHECK (position IN ('Hujumchi', 'O''rta', 'Himoyachi', 'Darvozabon')),
    age INT NOT NULL CHECK (age >= 14 AND age <= 50),
    jersey_number INT NOT NULL,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    avatar_url TEXT,
    matches_played INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. O'YINLAR (Matches)
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(100) PRIMARY KEY,
    league_id VARCHAR(100) REFERENCES leagues(id) ON DELETE CASCADE,
    home_team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'first_half', 'half_time', 'second_half', 'finished', 'cancelled', 'live')),
    venue VARCHAR(200) NOT NULL,
    referee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referee_name VARCHAR(150),
    current_minute INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. GOLLAR (Goals)
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id VARCHAR(100) REFERENCES matches(id) ON DELETE CASCADE,
    player_id VARCHAR(100) REFERENCES players(id) ON DELETE SET NULL,
    player_name VARCHAR(150) NOT NULL,
    team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    minute INT NOT NULL CHECK (minute >= 1 AND minute <= 130),
    is_own_goal BOOLEAN DEFAULT FALSE,
    assist_player_id VARCHAR(100) REFERENCES players(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. KARTOCHKALAR (Cards)
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id VARCHAR(100) REFERENCES matches(id) ON DELETE CASCADE,
    player_id VARCHAR(100) REFERENCES players(id) ON DELETE SET NULL,
    player_name VARCHAR(150) NOT NULL,
    team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('yellow', 'red')),
    minute INT NOT NULL CHECK (minute >= 1 AND minute <= 130),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. FUTBOLCHI ALMASHTIRISH (Substitutions)
CREATE TABLE IF NOT EXISTS substitutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id VARCHAR(100) REFERENCES matches(id) ON DELETE CASCADE,
    team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    player_in_id VARCHAR(100) REFERENCES players(id) ON DELETE CASCADE,
    player_in_name VARCHAR(150) NOT NULL,
    player_out_id VARCHAR(100) REFERENCES players(id) ON DELETE CASCADE,
    player_out_name VARCHAR(150) NOT NULL,
    minute INT NOT NULL CHECK (minute >= 1 AND minute <= 130),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. TURNIR JADVALI (Standings)
CREATE TABLE IF NOT EXISTS standings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id VARCHAR(100) REFERENCES leagues(id) ON DELETE CASCADE,
    team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    played INT DEFAULT 0,
    won INT DEFAULT 0,
    drawn INT DEFAULT 0,
    lost INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    points INT DEFAULT 0,
    UNIQUE (league_id, team_id)
);

-- 12. SEVIMLI JAMOLAR (Fan Favorites)
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id VARCHAR(100) REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, team_id)
);

-- 13. TIZIM AUDIT LOGLARI (Role Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(150),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEKSLAR
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_league ON matches(league_id);
CREATE INDEX IF NOT EXISTS idx_matches_referee ON matches(referee_name);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_standings_points ON standings(points DESC);
