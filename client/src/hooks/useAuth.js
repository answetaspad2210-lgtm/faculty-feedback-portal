// client/src/hooks/useAuth.js
// Small convenience hook so components write `useAuth()` instead of
// `useContext(AuthContext)` everywhere.
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
