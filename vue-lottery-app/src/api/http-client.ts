const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  let token = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        localStorage.setItem('accessToken', refreshData.accessToken);
        localStorage.setItem('refreshToken', refreshData.refreshToken);

        headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
        response = await fetch(`${BASE_URL}${path}`, {
          ...options,
          headers,
        });
      } else {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
