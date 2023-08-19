const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { requireUser, requireCurrentUserOrAdmin, requireAdmin } = require("./utils")

apiRouter.use("/", (req, res, next) => {
    console.log("a request is being made to /users");

    next();
})

// POST /register
apiRouter.post("/register", async (req, res, next) => {
    console.log("working 1");
    const { name, email, password, isAdmin } = req.body;
    console.log(req.body);
    try {
        const existingUser = await User.getUserByEmail(email);
        if (password.length < 8) {
            throw { error: "Password too short!" };
        } else if (existingUser) {
            throw { error: "Email already used!" };
        } else {
            const newUser = await User.createUser({ name, email, password, isAdmin });
            const encryptedUser = jwt.sign({
                id: newUser.id,
                email,
            }, process.env.JWT_SECRET, {
                expiresIn: "1w",
            });
            res.send({
                message: "Thank you for singing up!",
                token: encryptedUser,
                user: newUser,
            });
        }
    } catch ({ error }) {
        next({ error });
    }
})

// POST /login
apiRouter.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.getUserByEmailAndPassword({ email, password });
        if (!user) {
            throw { error: "Email or password does not exist!" };
        } else {
            const encryptedUser = jwt.sign({
                id: user.id,
                email,
            }, process.env.JWT_SECRET, {
                expiresIn: "1w",
            });
            res.send({
                message: "You're logged in!",
                token: encryptedUser,
                user,
            });
        }
    } catch ({ error }) {
        next({ error })
    }
})

// GET / ***
apiRouter.get("/", requireUser, requireAdmin, async (req, res, next) => {
    try {
        const allUsers = await User.getAllUsers();
        if (!allUsers) {
            throw { error: "Couldn't get users!" };
        } else {
            res.send(allUsers);
        }
    } catch ({ error }) {
        next({ error });
    }
})

// GET /me *
apiRouter.get("/me", requireUser, async (req, res, next) => {
    const { email } = req.user;
    try {
        const currentUser = await User.getUserByEmail(email);
        if (!currentUser) {
            throw { error: `Couldn't find user by email ${email}!` };
        } else {
            delete currentUser.password;
            res.send(currentUser);
        }
    } catch ({ error }) {
        next({ error });
    }
})

// PATCH /:userId **
apiRouter.patch("/:userId", requireUser, requireCurrentUserOrAdmin, async (req, res, next) => {
    const userId = req.params.userId;
    const fields = req.body;
    try {
        const updatedUser = await User.updateUser(userId, fields);
        if (!updatedUser) {
            throw { error: "Couldn't update user!" };
        } else {
            res.send(updatedUser);
        }
    } catch ({ error }) {
        next({ error });
    }
})

// DELETE /:userId ***
apiRouter.delete("/:userId", requireUser, requireAdmin, async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const deletedUser = await User.deleteUser(userId);
        if (!deletedUser) {
            throw { error: "Couldn't delete user!" };
        } else {
            res.send(deletedUser);
        }
    } catch ({ error }) {
        next({ error });
    }
})

module.exports = apiRouter;
