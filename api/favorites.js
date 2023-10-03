const express = require("express");
const favoritesRouter = express.Router();
const { Favorites } = require("../db");
const { requireUser } = require("./utils");

favoritesRouter.get("/:userId", requireUser, async (req, res) => {
  const userId = req.params.userId;
  try {
    console.log("Log inside favorites Router", userId);
    const favorites = await Favorites.getAllFavorites(userId);
    console.log("favorites in API", favorites);
    if (!favorites) {
      throw { error: "Unable to get favorites" };
    }
    res.send(favorites);
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
    const allFavorites = await Favorites.getAllFavorites(userId);
    if (!allFavorites) {
      throw { error: "Couldn't get all favorites!" };
    } else {
      console.log(allFavorites);
      res.send(allFavorites);
    }
  } catch ({ error }) {
    next({ error });
  }
});

favoritesRouter.delete(
  "/remove/:favoriteId",
  requireUser,
  async (req, res, next) => {
    const favoriteId = req.params.favoriteId;
    console.log("favoriteId in api", favoriteId);
    const favoriteItem = await Favorites.getFavorite(favoriteId);
    try {
      if (favoriteItem.userId !== req.user.id) {
        throw { error: "Unable to get favorite" };
      } else {
        const deleteFavorites = await Favorites.deleteFavorite(favoriteId);
        if (!deleteFavorites) {
          throw { error: "Unable to delete favorites" };
        }
        res.send(deleteFavorites);
      }
    } catch ({ error }) {
      next({ error });
    }
  }
);

module.exports = favoritesRouter;
