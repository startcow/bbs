const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userPermissions = await User.getPermissions(req.user.id);
      
      if (req.user.role === 'admin' || userPermissions.includes(requiredPermission)) {
        return next();
      }

      // 特殊处理版主权限
      if (req.user.role === 'moderator' && req.params.forumId) {
        const managedForums = await User.getManagedForums(req.user.id);
        if (managedForums.includes(parseInt(req.params.forumId))) {
          return next();
        }
      }

      throw new Error('没有权限执行此操作');
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  };
};

module.exports = {
  checkPermission
};