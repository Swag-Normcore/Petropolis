const express = require("express");
const favoritesRouter = express.Router();
const { Favorites } = require("../db");
const { requireUser } = require("./utils");

favoritesRouter.get("/:userId", requireUser, async (req, res) => {
  const userId = req.params.userId;
  try {
    const favorites = await Favorites.getAllFavorites(userId);
    if (!favorites) {
      throw { error: "Unable to get favorites" };
    }
    res.send({
      favorites,
    });
  } catch ({ error }) {
    next({ error });
  }
});

favoritesRouter.post("/", requireUser, async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    const newFavorite = await Favorites.createFavorite({ userId, productId });
    if (!newFavorite) {
      throw { error: "Unable to create favorites" };
    }
    res.send(newFavorite);
  } catch ({ error }) {
    next({ error });
  }
});

favoritesRouter.delete("/:favoriteId", requireUser, async (req, res, next) => {
  const favoriteItem = await Favorites.getFavoriteById(favoriteId);
  const { favoriteId } = req.params.favoriteId;
  try {
    if (favoriteItem.userId !== req.user.id) {
      throw { error: "Unable to get favorite" };
    } else {
      const deleteFavorites = await Favorites.deleteFavorite({
        id: favoriteItem,
      });
      if (!deleteFavorites) {
        throw { error: "Unable to delete favorites" };
      }
      res.send(deleteFavorites);
    }
  } catch ({ error }) {
    next({ error });
  }
});

module.exports = favoritesRouter;
