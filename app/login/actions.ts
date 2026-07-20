'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '@/lib/api';

interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const res = await apiFetch<LoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data.access_token) {
      cookies().set('token', res.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });
      return { success: true };
    }
    return { success: false, error: 'Failed to retrieve auth token' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' };
  }
}

export async function logoutAction() {
  cookies().delete('token');
}
