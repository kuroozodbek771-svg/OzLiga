import { UserRole, User } from '../types';

export const API_BASE = '/api';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem('ozleague_jwt_token');
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem('ozleague_jwt_token', token);
    } else {
      localStorage.removeItem('ozleague_jwt_token');
    }
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Server bilan bog'lanishda xatolik yuz berdi",
    };
  }
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
  role: UserRole = 'fan'
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Server bilan bog'lanishda xatolik yuz berdi",
    };
  }
}

export async function quickSwitchApi(targetRole: UserRole): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/quick-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole }),
    });
    const data = await res.json();
    if (data.token) {
      setStoredToken(data.token);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Akkauntni almashtirishda xatolik',
    };
  }
}

export async function fetchAdminOverview(): Promise<any> {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE}/admin/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function updateUserRoleApi(userId: string, role: UserRole): Promise<any> {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  return res.json();
}
