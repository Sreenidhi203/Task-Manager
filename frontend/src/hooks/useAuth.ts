import { useMemo, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      token,
      setToken,
      isAuthenticated: Boolean(token),
    }),
    [token],
  );

  return value;
}
