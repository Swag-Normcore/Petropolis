const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// place your routers here
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (id) {
        req.user = await User.getUserById(id);
        next();
      } else if (!id) {
        throw { error: "Invalid authorization" };
      }
    } catch ({ error }) {
      next({ error });
    }
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const categoriesRouter = require("./categories");
apiRouter.use("/categories", categoriesRouter);

const productsRouter = require("./products");
apiRouter.use("/products", productsRouter);

apiRouter.use((err, req, res, next) => {
  if (err) {
    res.status(400).send({
      error: err.error,
    });
  }
});

module.exports = apiRouter;
