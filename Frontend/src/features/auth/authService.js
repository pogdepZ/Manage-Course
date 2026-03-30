import { http } from '../../api/http';

export async function loginRequest(payload) {
  const response = await http.post('/login', payload);
  return response.data;
}

export async function registerRequest(payload) {
  const response = await http.post('/register', payload);
  return response.data;
}

export async function getProfileRequest() {
  const response = await http.get('/profile');
  return response.data;
}
