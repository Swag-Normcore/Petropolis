const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    next({
      name: "ForbiddenError",
      message: "You must be an administrator to perform this action",
    });
  }
  next();
};

module.exports = {
  requireAdmin,
};
//
