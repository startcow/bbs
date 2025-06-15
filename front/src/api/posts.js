import api from './index';

// 获取帖子详// 创建评论
export const createComment = (postId, content) => {
  return api.post(`/posts/${postId}/comments`, { content });
};
export const getPost = (postId) => {
  return api.get(`posts/${postId}`);
};

// 获取帖子评论
export const getPostComments = (postId) => {
  return api.get(`posts/${postId}/comments`);
};

// 点赞帖子
export const likePost = (postId) => {
  return api.post(`/posts/${postId}/like`);
};

// 收藏帖子
export const favoritePost = (postId) => {
  return api.post(`/posts/${postId}/favorite`);
};

// 删除帖子
export const deletePost = (postId) => {
  return api.delete(`posts/${postId}`);
};

// 置顶帖子
export const setTopPost = (postId) => {
  return api.post(`posts/${postId}/top`);
};

// 设为精华
export const setEssencePost = (postId) => {
  return api.post(`posts/${postId}/essence`);
};



// 删除评论
export const deleteComment = (commentId) => {
  return api.delete(`/comments/${commentId}`);
};

// 回复评论
export const replyComment = (commentId, content) => {
  return api.post(`/comments/${commentId}/reply`, { content });
};

// 点赞评论
export const likeComment = (commentId) => {
  return api.post(`/comments/${commentId}/like`);
};

// 创建帖子
export const createPost = async (data) => {
  const response = await api.post('/posts', data);
  return response.data;
};

// 获取最新帖子
export const getLatestPosts = (params) => {
  return api.get('/posts/latest', { params });
};