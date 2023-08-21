
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

async function requireUser(req, res, next) {
    if (!req.user) {
        next({
            error: "You must be logged in."
        })
    }
    next();
}

async function requireCurrentUserOrAdmin(req, res, next) {
    if (req.user.id !== req.params.userId && req.user.admin === false) {
        next({
            error: "You must be the current logged in user or an admin."
        })
    }
    next();
}

async function requireAdmin(req, res, next) {
    if (!req.user.isAdmin) {
        next({
            error: "You must be an admin."
        })
    }
    next();
}

module.exports = {
    requireUser,
    requireCurrentUserOrAdmin,
    requireAdmin,
}

