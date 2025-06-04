import api from './index';

export const login = (data) => {
  return api.post('/login', data);
};

export const register = (data) => {
  return api.post('/register', data);
};

export const getProfile = () => {
  return api.get('/profile');
};

export const updateProfile = (data) => {
  return api.put('/profile', data);
};

export const logout = () => {
  localStorage.removeItem('token');
};