const client = require("../client");

module.exports = {
  createFavorite,
  getAllFavorites,
  getFavorite,
  // updateFavorite,
  deleteFavorite,
  deleteFavoritesByUser,
};

async function createFavorite({ userId, productId }) {
  try {
    const { rows: [favorite] } = await client.query(
      `
      INSERT INTO favorites("userId", "productId")
      VALUES ($1, $2)
      RETURNING *;
    `,
      [userId, productId]
    );
    console.log("createFavorite:", favorite);

    if (!favorite) {
      throw new Error("Could not create favorite");
    }

    return favorite;
  } catch (error) {
    console.log(error);
  }
}

async function getAllFavorites(userId) {
  try {
    const { rows: favorites } = await client.query(
      `
      SELECT favorites.*, products.title, products.price, products.image
      FROM favorites
      JOIN products ON favorites."productId"=products.id
      WHERE favorites."userId"=$1;
    `,
      [userId]
    );
    console.log("getAllFavorites:", favorites);

    if (!favorites) {
      throw new Error("Could not get all favorites");
    }

    return favorites;
  } catch (error) {
    console.log(error);
  }
}

async function getFavorite(id) {
  try {
    const { rows: [favorite] } = await client.query(
      `
      SELECT *
      FROM favorites
      WHERE id = $1;
    `,
      [id]
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

// We don't need this function
// async function updateFavorite(userId, productId, newProductId) {
//   try {
//     const { rows: [favorite] } = await client.query(
//       `
//       UPDATE favorites
//       SET "productId" = $1
//       WHERE "userId" = $2 AND "productId" = $3
//       RETURNING *;
//     `,
//       [newProductId, userId, productId]
//     );
//     console.log("updateFavorite:", favorite);

//     if (!favorite) {
//       throw new Error("Could not update favorite");
//     }

//     return favorite;
//   } catch (error) {
//     console.log(error);
//   }
// }

async function deleteFavorite(id) {
  try {
    const { rows: [favorite] } = await client.query(
      `
      DELETE FROM favorites
      WHERE id = $1
      RETURNING *;
    `,
      [id]
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
    const { rows: favorites } = await client.query(
      `
      DELETE FROM favorites
      WHERE "userId" = $1
      RETURNING *;
    `,
      [userId]
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
