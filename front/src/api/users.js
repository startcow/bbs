import api from './index';

// 获取用户列表
export const getUsers = (params = {}) => {
  return api.get('/users', { params });
};

// 获取单个用户信息
export const getUser = (userId) => {
  return api.get(`/users/${userId}`);
};

// 更新用户信息
export const updateUser = (userId, userData) => {
  return api.put(`/users/${userId}`, userData);
};

// 获取用户统计信息
export const getUserStats = (userId) => {
  return api.get(`/users/${userId}/stats`);
};

// 获取用户帖子
export const getUserPosts = (userId, params = {}) => {
  return api.get(`/users/${userId}/posts`, { params });
};

// 获取用户收藏
export const getUserFavorites = (userId, params = {}) => {
  return api.get(`/users/${userId}/favorites`, { params });
};

// 获取用户评论
export const getUserComments = (userId, params = {}) => {
  return api.get(`/users/${userId}/comments`, { params });
};