import { roles, permissions } from '../mockData';

// 检查用户是否拥有指定权限
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

// 检查用户是否是版主
export const isModerator = (user, forumId) => {
  if (!user || user.role !== roles.MODERATOR) return false;
  return user.managedForums?.includes(forumId);
};

// 检查用户是否是管理员
export const isAdmin = (user) => {
  return user?.role === roles.ADMIN;
};

// 检查用户是否可以管理帖子
export const canManagePost = (user, post, forumId) => {
  if (!user) return false;
  
  // 系统管理员可以管理所有帖子
  if (isAdmin(user)) return true;
  
  // 版主可以管理其负责板块的帖子
  if (isModerator(user, forumId)) return true;
  
  // 用户可以管理自己的帖子
  return post.author.id === user.id;
};

// 检查用户是否可以管理评论
export const canManageComment = (user, comment, forumId) => {
  if (!user) return false;
  
  // 系统管理员可以管理所有评论
  if (isAdmin(user)) return true;
  
  // 版主可以管理其负责板块的评论
  if (isModerator(user, forumId)) return true;
  
  // 用户可以管理自己的评论
  return comment.author.id === user.id;
};

// 检查用户是否可以管理用户
export const canManageUser = (user, targetUser, forumId) => {
  if (!user) return false;
  
  // 系统管理员可以管理所有用户
  if (isAdmin(user)) return true;
  
  // 版主只能在其负责的板块中管理普通用户
  if (isModerator(user, forumId)) {
    return targetUser.role === roles.USER;
  }
  
  return false;
};