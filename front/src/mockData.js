export const roles = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

export const permissions = {
  // 系统管理员权限
  ADMIN_FORUM_MANAGE: 'forum:manage',    // 板块管理
  ADMIN_USER_MANAGE: 'user:manage',      // 用户管理
  ADMIN_ROLE_MANAGE: 'role:manage',      // 角色管理
  ADMIN_POST_MANAGE: 'post:manage:all',  // 所有帖子管理

  // 版主权限
  MOD_POST_MANAGE: 'post:manage:forum',  // 本版块帖子管理
  MOD_COMMENT_MANAGE: 'comment:manage',  // 评论管理
  MOD_USER_BAN: 'user:ban:forum',       // 本版块用户封禁

  // 普通用户权限
  POST_CREATE: 'post:create',            // 发帖
  POST_EDIT: 'post:edit:own',           // 编辑自己的帖子
  POST_DELETE: 'post:delete:own',        // 删除自己的帖子
  COMMENT_CREATE: 'comment:create',      // 评论
  COMMENT_DELETE: 'comment:delete:own'   // 删除自己的评论
};