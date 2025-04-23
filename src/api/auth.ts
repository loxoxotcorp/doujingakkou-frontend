import { User, AuthResponse, ApiResponse } from './types';

const API_BASE = 'http://127.0.0.1:8000/api/auth';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Реальный вызов логина к бекенду
export const login = async (
  username: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Login failed');
  }

  const data = await res.json();

  // Токен в ответе называется access_token согласно backend
  localStorage.setItem('auth_token', data.access_token || data.token);
  localStorage.setItem('user', JSON.stringify(data.user || { username }));

  return {
    success: true,
    data,
  };
};

// Получение текущего пользователя с реального эндпоинта
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to fetch current user');
  }

  const data = await res.json();

  return {
    success: true,
    data,
  };
};

// Логаут с очисткой локального состояния
export const logout = async (): Promise<ApiResponse<null>> => {
  const token = getToken();

  if (token) {
    // Если есть у бекенда эндпоинт логаута, можно вызвать его здесь
  }

  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');

  return {
    success: true,
    data: null,
  };
};

// Проверка существования токена
export const isAuthenticated = (): boolean => {
  return !!getToken();
};