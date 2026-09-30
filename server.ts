import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'ozleague_secret_jwt_key_2025_safe_token';
const PORT = Number(process.env.PORT) || 3000;

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'referee' | 'fan';
  refereeName?: string;
  managedLeagueIds?: string[];
  managedTeamIds?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// In-Memory Database Seeded for Full-Stack Simulation
interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'referee' | 'fan';
  refereeName?: string;
  managedLeagueIds?: string[];
  managedTeamIds?: string[];
  avatarUrl?: string;
  createdAt: string;
}

const usersDB: DBUser[] = [
  {
    id: 'user-admin',
    name: 'Azamat Berdiyev',
    email: 'admin@ozleague.uz',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'user-manager',
    name: 'Dilshod Rahimqulov',
    email: 'manager@ozleague.uz',
    passwordHash: bcrypt.hashSync('manager123', 10),
    role: 'manager',
    managedLeagueIds: ['league-tpl'],
    managedTeamIds: ['team-sherlar', 'team-chilonzor'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2024-01-11T12:00:00Z',
  },
  {
    id: 'user-referee',
    name: 'Ravshan Haydarov',
    email: 'referee@ozleague.uz',
    passwordHash: bcrypt.hashSync('referee123', 10),
    role: 'referee',
    refereeName: 'Ravshan Haydarov',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2024-01-12T14:30:00Z',
  },
  {
    id: 'user-fan',
    name: 'Otabek Mirzayev',
    email: 'fan@ozleague.uz',
    passwordHash: bcrypt.hashSync('fan123', 10),
    role: 'fan',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    createdAt: '2024-02-01T09:15:00Z',
  },
];

// Audit trail
const auditLogs: Array<{
  id: string;
  userId?: string;
  userEmail?: string;
  role?: string;
  action: string;
  details: string;
  timestamp: string;
}> = [];

function logAudit(action: string, details: string, user?: TokenPayload) {
  auditLogs.unshift({
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId: user?.id,
    userEmail: user?.email,
    role: user?.role,
    action,
    details,
    timestamp: new Date().toISOString(),
  });
  if (auditLogs.length > 100) auditLogs.pop();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------
  // MIDDLEWARE: Autentifikatsiya (JWT Verification)
  // -------------------------------------------------------------
  const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Autentifikatsiya talab qilinadi: Bearer token taqdim etilmagan',
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          code: 'INVALID_TOKEN',
          message: 'Token yaroqsiz yoki muddati tugagan. Iltimos, qaytadan tizimga kiring.',
        });
      }
      req.user = decoded as TokenPayload;
      next();
    });
  };

  // -------------------------------------------------------------
  // MIDDLEWARE: Role-Based Authorization
  // -------------------------------------------------------------
  const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          code: 'UNAUTHENTICATED',
          message: 'Avval tizimga kirishingiz lozim.',
        });
      }

      // Admin has full access to all roles
      if (req.user.role === 'admin') {
        return next();
      }

      // Normalize role aliases (league_manager -> manager, user -> fan)
      const userRole = req.user.role === ('league_manager' as any) ? 'manager' : req.user.role === ('user' as any) ? 'fan' : req.user.role;

      if (!allowedRoles.includes(userRole)) {
        logAudit('ACCESS_DENIED', `403 Forbidden: user=${req.user.email} (role=${req.user.role}) tried to access route restricted to [${allowedRoles.join(', ')}]`, req.user);
        return res.status(403).json({
          success: false,
          code: 'FORBIDDEN',
          message: `Kirish taqiqlangan (403): Ushbu bo'lim faqat [${allowedRoles.join(', ')}] rollari uchun ruxsat etilgan. Sizning rolingiz: ${req.user.role}`,
        });
      }

      next();
    };
  };

  // -------------------------------------------------------------
  // AUTH ROUTES
  // -------------------------------------------------------------
  // POST /api/auth/login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email va parol kiritilishi shart',
      });
    }

    const user = usersDB.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email yoki parol noto'g'ri. Bunday foydalanuvchi topilmadi.",
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Email yoki parol noto'g'ri.",
      });
    }

    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      refereeName: user.refereeName,
      managedLeagueIds: user.managedLeagueIds,
      managedTeamIds: user.managedTeamIds,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    logAudit('USER_LOGIN', `Muvaffaqiyatli kirish: ${user.email} (${user.role})`, tokenPayload);

    return res.json({
      success: true,
      message: 'Tizimga muvaffaqiyatli kirildi',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        refereeName: user.refereeName,
        managedLeagueIds: user.managedLeagueIds,
        managedTeamIds: user.managedTeamIds,
      },
    });
  });

  // POST /api/auth/register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, role = 'fan' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Ism, email va parol to'ldirilishi shart",
      });
    }

    const existing = usersDB.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ushbu email manzili allaqachon ro‘yxatdan o‘tgan',
      });
    }

    const validRoles = ['admin', 'manager', 'referee', 'fan'];
    const chosenRole = validRoles.includes(role) ? role : 'fan';

    const newUser: DBUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      passwordHash: bcrypt.hashSync(password, 10),
      role: chosenRole as any,
      refereeName: chosenRole === 'referee' ? name : undefined,
      managedLeagueIds: chosenRole === 'manager' ? ['league-tpl'] : undefined,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString(),
    };

    usersDB.push(newUser);

    const tokenPayload: TokenPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      refereeName: newUser.refereeName,
      managedLeagueIds: newUser.managedLeagueIds,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    logAudit('USER_REGISTER', `Yangi foydalanuvchi: ${newUser.email} (${newUser.role})`, tokenPayload);

    return res.status(201).json({
      success: true,
      message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
        refereeName: newUser.refereeName,
        managedLeagueIds: newUser.managedLeagueIds,
      },
    });
  });

  // GET /api/auth/me
  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = usersDB.find((u) => u.id === req.user?.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        refereeName: user.refereeName,
        managedLeagueIds: user.managedLeagueIds,
        managedTeamIds: user.managedTeamIds,
      },
    });
  });

  // POST /api/auth/quick-switch
  // Switches to any of the 4 standard test roles with real signed JWT
  app.post('/api/auth/quick-switch', (req: Request, res: Response) => {
    const { targetRole } = req.body;
    const user = usersDB.find((u) => u.role === targetRole) || usersDB[0];

    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      refereeName: user.refereeName,
      managedLeagueIds: user.managedLeagueIds,
      managedTeamIds: user.managedTeamIds,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    logAudit('ROLE_SWITCH', `Foydalanuvchi tezkor almashtirildi: ${user.name} (${user.role})`, tokenPayload);

    return res.json({
      success: true,
      message: `${user.name} hisobiga muvaffaqiyatli o'tildi (${user.role.toUpperCase()})`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        refereeName: user.refereeName,
        managedLeagueIds: user.managedLeagueIds,
        managedTeamIds: user.managedTeamIds,
      },
    });
  });

  // -------------------------------------------------------------
  // ADMIN ROUTES (requireRole('admin'))
  // -------------------------------------------------------------
  app.get('/api/admin/overview', authenticateToken, requireRole('admin'), (_req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      data: {
        totalUsers: usersDB.length,
        usersByRole: {
          admin: usersDB.filter((u) => u.role === 'admin').length,
          manager: usersDB.filter((u) => u.role === 'manager').length,
          referee: usersDB.filter((u) => u.role === 'referee').length,
          fan: usersDB.filter((u) => u.role === 'fan').length,
        },
        auditLogs: auditLogs.slice(0, 15),
        systemHealth: 'Active (PostgreSQL Ready, Express 4, JWT Signed)',
      },
    });
  });

  app.get('/api/admin/users', authenticateToken, requireRole('admin'), (_req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      users: usersDB.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        refereeName: u.refereeName,
        managedLeagueIds: u.managedLeagueIds,
        createdAt: u.createdAt,
      })),
    });
  });

  app.put('/api/admin/users/:id/role', authenticateToken, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const user = usersDB.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    const validRoles = ['admin', 'manager', 'referee', 'fan'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Yaroqsiz rol tanlandi' });
    }

    user.role = role;
    if (role === 'referee' && !user.refereeName) {
      user.refereeName = user.name;
    }

    logAudit('USER_ROLE_UPDATED', `Foydalanuvchi ${user.email} roli [${role}] ga o'zgartirildi`, req.user);

    return res.json({
      success: true,
      message: `Foydalanuvchi roli ${role} ga muvaffaqiyatli yangilandi`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });

  // -------------------------------------------------------------
  // MANAGER ROUTES (requireRole('manager'))
  // -------------------------------------------------------------
  app.get('/api/manager/my-leagues', authenticateToken, requireRole('manager'), (req: AuthenticatedRequest, res: Response) => {
    const managedLeagues = req.user?.managedLeagueIds || ['league-tpl'];
    return res.json({
      success: true,
      managedLeagueIds: managedLeagues,
      message: 'Menejerga biriktirilgan ligalar muvaffaqiyatli yuklandi',
    });
  });

  // -------------------------------------------------------------
  // REFEREE ROUTES (requireRole('referee'))
  // -------------------------------------------------------------
  app.get('/api/referee/my-matches', authenticateToken, requireRole('referee'), (req: AuthenticatedRequest, res: Response) => {
    const refereeName = req.user?.refereeName || 'Ravshan Haydarov';
    return res.json({
      success: true,
      refereeName,
      message: `Hakam [${refereeName}] ga biriktirilgan o'yinlar ro'yxati`,
    });
  });

  // -------------------------------------------------------------
  // FAN ROUTES (requireRole('fan', 'manager', 'referee', 'admin'))
  // -------------------------------------------------------------
  app.get('/api/fan/favorites', authenticateToken, requireRole('fan', 'manager', 'referee', 'admin'), (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      message: 'Muxlis sevimli jamoalari',
    });
  });

  // -------------------------------------------------------------
  // VITE OR STATIC FRONTEND MOUNTING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[O'zLeague 2.0] Full-Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[O\'zLeague 2.0] Server startup error:', err);
});
