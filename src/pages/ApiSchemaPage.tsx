import React, { useState } from 'react';
import {
  Database,
  Code,
  Copy,
  Check,
  Server,
  Terminal,
  FileCode,
  Layers,
} from 'lucide-react';

export const ApiSchemaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'routes' | 'express'>('sql');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const SQL_SCHEMA = `-- ========================================================
-- O'zLeague Platformasi — PostgreSQL Ma'lumotlar Bazasi Sxemasi
-- database/schema.sql
-- ========================================================

-- UUID kengaytmasini yoqish (agar kerak bo'lsa)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FOYDALANUVCHILAR JADVALI (users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'fan' CHECK (role IN ('admin', 'manager', 'referee', 'fan')),
    referee_name VARCHAR(150),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MENEJER BIRIKTIRMALARI (Manager Assignments)
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

-- AUDIT TRAIL LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(150),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. LIGALAR JADVALI (leagues)
CREATE TABLE IF NOT EXISTS leagues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    season VARCHAR(50) NOT NULL,
    region VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('active', 'finished', 'upcoming')),
    logo_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. JAMOALAR JADVALI (teams)
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    coach VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    home_venue VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. O'YINCHILAR JADVALI (players)
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    position VARCHAR(30) NOT NULL CHECK (position IN ('Hujumchi', 'O''rta', 'Himoyachi', 'Darvozabon')),
    age INT CHECK (age >= 14 AND age <= 50),
    jersey_number INT DEFAULT 10,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. O'YINLAR JADVALI (matches)
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'finished', 'cancelled')),
    venue VARCHAR(200) NOT NULL,
    referee_name VARCHAR(150),
    current_minute INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_different_teams CHECK (home_team_id <> away_team_id)
);

-- 6. GOLLAR JADVALI (goals)
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    minute INT NOT NULL CHECK (minute >= 1 AND minute <= 130),
    is_own_goal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TURNIR JADVALI (standings)
CREATE TABLE IF NOT EXISTS standings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    played INT DEFAULT 0,
    won INT DEFAULT 0,
    drawn INT DEFAULT 0,
    lost INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    points INT DEFAULT 0,
    UNIQUE (league_id, team_id)
);

-- 8. KARTOCHKALAR (cards)
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('yellow', 'red')),
    minute INT NOT NULL CHECK (minute >= 1 AND minute <= 130),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEKSLAR (Tezkor qidiruv uchun)
CREATE INDEX idx_teams_league ON teams(league_id);
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_matches_league ON matches(league_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_standings_points ON standings(league_id, points DESC);
`;

  const EXPRESS_SERVER_CODE = `// ========================================================
// O'zLeague Platformasi — Node.js + Express Server
// server/server.js
// ========================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API marshrutlarini ulash
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leagues', require('./routes/leagues'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));

// Server sog'ligini tekshirish
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Portni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`O'zLeague serveri \${PORT}-portda ishga tushdi\`);
});
`;

  const MATCHES_ROUTE_CODE = `// ========================================================
// O'yinlar va Natijalar Marshruti (Matches & Score controller)
// server/routes/matches.js
// ========================================================

const router = require('express').Router();
const pool = require('../models/db');
const authMw = require('../middleware/auth');

// Barcha o'yinlarni olish (?league_id= &status=)
router.get('/', async (req, res) => {
  try {
    const { league_id, status } = req.query;
    let query = 'SELECT * FROM matches WHERE 1=1';
    const params = [];

    if (league_id) {
      params.push(league_id);
      query += \` AND league_id = $\${params.length}\`;
    }
    if (status) {
      params.push(status);
      query += \` AND status = $\${params.length}\`;
    }

    query += ' ORDER BY match_date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "O'yinlarni yuklashda xatolik: " + err.message });
  }
});

// O'yin natijasini kiritish va Turnir jadvalini (standings) yangilash (Admin / Referee)
router.put('/:id/score', authMw, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { home_score, away_score, status } = req.body;

    await client.query('BEGIN');

    // 1. O'yin hisobini yangilash
    const matchRes = await client.query(
      \`UPDATE matches 
       SET home_score = $1, away_score = $2, status = $3 
       WHERE id = $4 RETURNING *\`,
      [home_score, away_score, status || 'finished', id]
    );

    const match = matchRes.rows[0];

    // 2. Agar o'yin yakunlangan bo'lsa, standings jadvalini qayta hisoblash
    if (status === 'finished') {
      // Mezbon va Mehmon jamoalarni standingsda yangilash
      const isHomeWin = home_score > away_score;
      const isDraw = home_score === away_score;

      // Mezbon jamoa ochkosi
      await client.query(
        \`UPDATE standings 
         SET played = played + 1,
             won = won + $1,
             drawn = drawn + $2,
             lost = lost + $3,
             goals_for = goals_for + $4,
             goals_against = goals_against + $5,
             points = points + $6
         WHERE league_id = $7 AND team_id = $8\`,
        [
          isHomeWin ? 1 : 0,
          isDraw ? 1 : 0,
          (!isHomeWin && !isDraw) ? 1 : 0,
          home_score,
          away_score,
          isHomeWin ? 3 : (isDraw ? 1 : 0),
          match.league_id,
          match.home_team_id
        ]
      );

      // Mehmon jamoa ochkosi
      await client.query(
        \`UPDATE standings 
         SET played = played + 1,
             won = won + $1,
             drawn = drawn + $2,
             lost = lost + $3,
             goals_for = goals_for + $4,
             goals_against = goals_against + $5,
             points = points + $6
         WHERE league_id = $7 AND team_id = $8\`,
        [
          (!isHomeWin && !isDraw) ? 1 : 0,
          isDraw ? 1 : 0,
          isHomeWin ? 1 : 0,
          away_score,
          home_score,
          (!isHomeWin && !isDraw) ? 3 : (isDraw ? 1 : 0),
          match.league_id,
          match.away_team_id
        ]
      );
    }

    await client.query('COMMIT');
    res.json({ message: "O'yin hisobi muvaffaqiyatli yangilandi", match });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: "Hisobni kiritishda xatolik: " + err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
`;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Database className="w-7 h-7 text-blue-400" />
            Ma'lumotlar Bazasi Sxemasi & API Kodeksi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            PostgreSQL <code className="text-blue-400 font-mono">schema.sql</code>, barcha 8 ta jadval va Node.js Express REST API arxitekturasi
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'sql'
              ? 'border-blue-500 text-blue-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PostgreSQL (schema.sql)</span>
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'routes'
              ? 'border-emerald-500 text-emerald-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Express Match & Standings Route</span>
        </button>

        <button
          onClick={() => setActiveTab('express')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'express'
              ? 'border-amber-500 text-amber-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Express server.js</span>
        </button>
      </div>

      {/* Code Display Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">
              {activeTab === 'sql'
                ? 'database/schema.sql'
                : activeTab === 'routes'
                ? 'server/routes/matches.js'
                : 'server/server.js'}
            </span>
          </div>

          <button
            onClick={() => {
              const code =
                activeTab === 'sql'
                  ? SQL_SCHEMA
                  : activeTab === 'routes'
                  ? MATCHES_ROUTE_CODE
                  : EXPRESS_SERVER_CODE;
              copyToClipboard(code, activeTab);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            {copied === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Nusxalandi!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kodni nusxalash</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-6 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[600px] scrollbar-thin">
          {activeTab === 'sql' && SQL_SCHEMA}
          {activeTab === 'routes' && MATCHES_ROUTE_CODE}
          {activeTab === 'express' && EXPRESS_SERVER_CODE}
        </pre>
      </div>

      {/* REST API Endpoints Cheat Sheet */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          Barcha REST API Endpointlar Ro'yxati
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-emerald-400 font-bold">POST</span>
            <span className="text-slate-300">/api/auth/register</span>
            <span className="text-[10px] text-slate-500 font-sans">Ro'yxatdan o'tish</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-emerald-400 font-bold">POST</span>
            <span className="text-slate-300">/api/auth/login</span>
            <span className="text-[10px] text-slate-500 font-sans">Kirish (JWT)</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-blue-400 font-bold">GET</span>
            <span className="text-slate-300">/api/leagues</span>
            <span className="text-[10px] text-slate-500 font-sans">Barcha ligalar</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-blue-400 font-bold">GET</span>
            <span className="text-slate-300">/api/teams?league_id=</span>
            <span className="text-[10px] text-slate-500 font-sans">Jamoalar ro'yxati</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-blue-400 font-bold">GET</span>
            <span className="text-slate-300">/api/players/top?limit=10</span>
            <span className="text-[10px] text-slate-500 font-sans">Top to'purarlar</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-amber-400 font-bold">PUT</span>
            <span className="text-slate-300">/api/matches/:id/score</span>
            <span className="text-[10px] text-slate-500 font-sans">Hisob + Standings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
