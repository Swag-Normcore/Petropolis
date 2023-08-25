const client = require("../client");

module.exports = {
  createShoppingCart,
  getShoppingCart,
  updateShoppingCart,
  deleteShoppingCart,
};

async function createShoppingCart({ userId }) {
  try {
    const {
      rows: [shoppingCart],
    } = await client.query(
      `
    INSERT INTO shopping_cart (userId)
    VALUES ($1)
    RETURNING *;
    `,
      [userId]
    );
    console.log("createShoppingCart: ", shoppingCart);
    if (!shoppingCart) {
      throw new Error("Unable to create cart");
    }
    return shoppingCart;
  } catch (err) {
    console.error(err);
  }
}

async function getShoppingCart(id) {
  try {
    const {
      rows: [shoppingCart],
    } = await client.query(
      `
    SELECT * FROM shopping_cart
    WHERE id=$1;
    `,
      [id]
    );
    if (!shoppingCart) {
      throw new Error("Unable to get cart");
    }
    return shoppingCart;
  } catch (err) {
    console.error(err);
  }
}

async function updateShoppingCart(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => {
      return `"${key}" = $${index + 1}
    `;
    })
    .join(", ");
  if (!setString) {
    return;
  }
  try {
    const {
      rows: [shoppingCart],
    } = await client.query(
      `
    UPDATE shopping_cart
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    if (!shoppingCart) {
      throw new Error("Unable to update cart");
    }
    return shoppingCart;
  } catch (err) {
    console.error(err);
  }
}

async function deleteShoppingCart(id) {
  try {
    const { rows: cart_products } = await client.query(
      `
    DELETE FROM cart_products
    WHERE "shoppingId"=$1
    RETURNING *;
    `,
      [id]
    );

    const {
      rows: [shoppingCart],
    } = await client.query(
      `
    DELETE FROM shopping_cart,
    WHERE id=$1
    RETURNING *;
    `,
      [id]
    );
    console.log("deleteShoppingCart: ", shoppingCart, cart_products);
    if (!shoppingCart) {
      throw new error("Unable to delete cart");
    }
    return shoppingCart;
  } catch (error) {
    console.error(err);
  }
}
