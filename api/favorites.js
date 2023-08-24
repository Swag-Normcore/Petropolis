const express = require("express");
const favoritesRouter = express.Router();
const { Favorites } = require("../db");
const { requireUser } = require("./utils");
const requireUser = requireUser;

favoritesRouter.get("/", requireUser, async (req, res) => {
  try {
    const favorites = await Favorites.getAllFavorites(req.user.id);
    res.send({
      favorites,
    });
    if (!Favorites) {
      throw { error: "Unable to get favorites" };
    }
  } catch ({ error }) {
    next({ error });
  }
});

favoritesRouter.post("/", requireUser, async (req, res, next) => {
  const { userId, productId } = req.body;
  try {
    const newFavorite = await Favorites.createFavorite({ userId, productId });
    res.send(newFavorite);
    if (!newFavorite) {
      throw { error: "Unable to create favorites" };
    }
  } catch ({ error }) {
    next({ error });
  }
});

favoritesRouter.delete("/:favoriteId", requireUser, async (req, res, next) => {
  const { favoriteId } = req.params.favoriteId;
  try {
    const deleteFavorites = await Favorites.deleteFavorite({ id: favoriteId });
    res.send(deleteFavorites);
    if (!deleteFavorites) {
      throw { error: "Unable to delete favorites" };
    }
  } catch ({ error }) {
    next({ error });
  }
});

module.exports = favoritesRouter;
