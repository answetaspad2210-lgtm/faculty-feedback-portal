// client/src/services/authService.js
import api from './api';

export async function login(email, password, role) {
  const { data } = await api.post('/auth/login', { email, password, role });
  return data.data; // { token, user }
}
