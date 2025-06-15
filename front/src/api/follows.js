import api from './index';

// 关注/取消关注用户
export const followUser = (userId) => {
  return api.post(`/users/${userId}/follow`);
};

// 获取用户的关注列表
export const getUserFollowing = (userId, params = {}) => {
  return api.get(`/users/${userId}/following`, { params });
};

// 获取用户的粉丝列表
export const getUserFollowers = (userId, params = {}) => {
  return api.get(`/users/${userId}/followers`, { params });
};

// 获取用户统计信息
export const getUserStats = (userId) => {
  return api.get(`/users/${userId}/stats`);
};