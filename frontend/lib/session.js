"use server";

import "server-only";
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server Action to handle login
export async function createSession(formData) {
  "use server";
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await fetch(`${API_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    const cookieStore = await cookies();

    if (data.access) {
      // Securely store tokens in HTTP-only cookies
      cookieStore.set('access_token', data.access, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
      });

      cookieStore.set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
      });

      return { success: true };
    }

    return { success: false, error: 'Login failed' };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

// Server Action to refresh token
export async function refreshSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return { success: false };
  }

  try {
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (data.access) {
      cookieStore.set('access_token', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
      });

      return { success: true };
    }

    return { success: false };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

// Server Action to make authenticated requests
export async function fetchWithAuth(url, options = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const headers = { ...options.headers, Authorization: `Bearer ${accessToken}` };
  
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const refreshResult = await refreshSession();

      if (refreshResult.success) {
        // Retry the original request with new token
        const newAccessToken = cookieStore.get('access_token')?.value;
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return response;
  } catch (error) {
    return { error: 'Network error' };
  }
}
