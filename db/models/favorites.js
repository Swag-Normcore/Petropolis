//database adapters for a user to product reference table where users can create a list of their favorite products
//adapters will be createFavorite, getAllFavorites, getFavorite, updateFavorite, deleteFavorite
const client = require("./client");

module.exports = {
  createFavorite,
  getAllFavorites,
  getFavorite,
  updateFavorite,
  deleteFavorite,
  deleteFavoritesByUser,
};

async function createFavorite({ userId, productId }) {
  try {
    const favorite = await db.one(
      "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
      [userId, productId]
    );
    console.log("createFavorite:", favorite);

    if (!favorite) {
      throw new Error("Could not create favorite");
    }

    return favorite;
  } catch (error) {
    throw error;
  }
}

async function getAllFavorites(userId) {
  try {
    const favorites = await db.any(
      "SELECT * FROM favorites WHERE user_id = $1",
      userId
    );
    console.log("getAllFavorites:", favorites);

    if (!favorites) {
      throw new Error("Could not get favorites");
    }

    return favorites;
  } catch (error) {
    console.log(error);
  }
}

async function getFavorite(userId, productId) {
  try {
    const favorite = await db.one(
      "SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
    console.log("getFavorite:", favorite);

    if (!favorite) {
      throw new Error("Could not get favorite");
    }

    return favorite;
  } catch (error) {
    console.log(error);
  }
}

async function updateFavorite(userId, productId, newProductId) {
  try {
    const favorite = await db.one(
      "UPDATE favorites SET product_id = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *",
      [newProductId, userId, productId]
    );
    console.log("updateFavorite:", favorite);

    if (!favorite) {
      throw new Error("Could not update favorite");
    }

    return favorite;
  } catch (error) {
    console.log(error);
  }
}

async function deleteFavorite(userId, productId) {
  try {
    const favorite = await db.one(
      "DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [userId, productId]
    );
    console.log("deleteFavorite:", favorite);

    if (!favorite) {
      throw new Error("Could not delete favorite");
    }

    return favorite;
  } catch (error) {
    console.log(error);
  }
}

async function deleteFavoritesByUser(userId) {
  try {
    const favorites = await db.any(
      "DELETE FROM favorites WHERE user_id = $1 RETURNING *",
      userId
    );
    console.log("deleteFavoritesByUser:", favorites);

    if (!favorites) {
      throw new Error("Could not delete favorites");
    }

    return favorites;
  } catch (error) {
    console.log(error);
  }
}
