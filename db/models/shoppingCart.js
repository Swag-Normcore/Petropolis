const client = require("../client");

module.exports = {
  createShoppingCart,
  getShoppingCart,
  updateShoppingCart,
  deleteShoppingCart,
};

async function createShoppingCart({ id, userId, dateCreated }) {
  try {
    const {
      rows: [shoppingCart],
    } = await client.query(
      `
    INSERT INTO shopping_cart (Id, userId, dateCreated)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [id, userId, dateCreated]
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
    WHERE "userId"= $1;
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
      `"${key}" = $${index + 1}
    `;
      return;
    })
    .join(", ");
  if (!setString) {
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
    return shoppingCart;
  } catch (err) {
    console.error(err);
  }
}

async function deleteShoppingCart(id) {
  try {
    const {
      rows: [cart_products],
    } = await client.query(
      `
    UPDATE cart_products
    SET "shoppingId"=$1
    WHERE "shoppingId"=$2;
    `,
      [null, shoppingId]
    );

    const {
      rows: [shoppingCart],
    } = await client.query(
      `
    DELETE FROM shopping_cart,
    WHERE id=$1;
    RETURNING *;
    `,
      [id]
    );
    console.log("deleteShoppingCart: ", shoppingCart);
    if (!shoppingCart) {
      throw new error("Unable to delete cart");
    }
    return cart_products && Products;
  } catch (error) {
    console.error(err);
  }
}
