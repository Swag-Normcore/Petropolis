async function requireUser(req, res, next) {
    if (!req.user) {
        next({
            error: "You must be logged in."
        })
    }
    next();
}

async function requireCurrentUserOrAdmin(req, res, next) {
    if (req.user.id !== req.params.userId && req.user.isAdmin === false) {
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
