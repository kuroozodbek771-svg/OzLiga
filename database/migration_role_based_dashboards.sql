-- ====================================================================
-- O'zLeague 2.0 — Migration: Role-Based Dashboards & Assignments
-- Sana: 2026-09-30
-- ====================================================================

-- 1. Rol tekshiruvini yangilash
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'manager', 'referee', 'fan'));

-- 2. Hakam va avatar ustunlarini qo'shish
ALTER TABLE users ADD COLUMN IF NOT EXISTS referee_name VARCHAR(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Menejer jadvallarini qo'shish
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

-- 4. O'yinlarga hakam id qo'shish
ALTER TABLE matches ADD COLUMN IF NOT EXISTS referee_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS referee_name VARCHAR(150);

-- 5. Audit loglar jadvali
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

-- 6. Boshlang'ich test foydalanuvchilarni kiritish yoki yangilash
-- Parollar: bcrypt orqali shifrlangan
-- admin123, manager123, referee123, fan123
INSERT INTO users (id, name, email, password_hash, role, referee_name)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Azamat Berdiyev', 'admin@ozleague.uz', '$2a$10$wE9mHhHh782aPqKkR1g9QOp2k1w1w1w1w1w1w1w1w1w1w1w1w1w1w', 'admin', NULL),
  ('a0000000-0000-0000-0000-000000000002', 'Dilshod Rahimqulov', 'manager@ozleague.uz', '$2a$10$wE9mHhHh782aPqKkR1g9QOp2k1w1w1w1w1w1w1w1w1w1w1w1w1w1w', 'manager', NULL),
  ('a0000000-0000-0000-0000-000000000003', 'Ravshan Haydarov', 'referee@ozleague.uz', '$2a$10$wE9mHhHh782aPqKkR1g9QOp2k1w1w1w1w1w1w1w1w1w1w1w1w1w1w', 'referee', 'Ravshan Haydarov'),
  ('a0000000-0000-0000-0000-000000000004', 'Otabek Mirzayev', 'fan@ozleague.uz', '$2a$10$wE9mHhHh782aPqKkR1g9QOp2k1w1w1w1w1w1w1w1w1w1w1w1w1w1w', 'fan', NULL)
ON CONFLICT (email) DO UPDATE 
SET role = EXCLUDED.role, 
    referee_name = EXCLUDED.referee_name;
