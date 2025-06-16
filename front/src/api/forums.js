import api from './index';

export const getForums = () => {
  return api.get('/forums');
};

export const getForum = (forumId) => {
  return api.get(`/forums/${forumId}`);
};

export const getForumPosts = (forumId, params) => {
  return api.get(`/forums/${forumId}/posts`, { params });
};

export const addModerator = (forumId, userId) => {
  return api.post(`/forums/${forumId}/moderators`, { user_id: userId });
};

export const removeModerator = (forumId, moderatorId) => {
  return api.delete(`/forums/${forumId}/moderators/${moderatorId}`);
};

export const getForumStats = () => {
  return api.get('/forums/stats');
};

export const createForum = (forumData) => {
  return api.post('/forums', forumData);
};