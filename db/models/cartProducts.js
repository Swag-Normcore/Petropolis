const client = require("../client");
const { getProductById } = require("../products");

module.exports = {
  getProductsByShoppingCart,
  addProductToCart,
  updateCartProductsQuantity,
  removeProductFromCart,
  removeAllProductsFromCart,
};

async function getProductsByShoppingCart(shoppingId) {
  try {
    const { rows: product } = await client.query(
      `
    SELECT * FROM cart_products
    WHERE "shoppingId"= $1;
    `,
      [shoppingId]
    );
    if (!product) {
      throw new Error("Unable to get product");
    }
    console.log(product);
    return product;
  } catch (err) {
    console.error(err);
  }
}

async function addProductToCart({ shoppingId, productId, quantity }) {
  try {
    const product = await getProductById(productId);
    const {
      rows: [cartProduct],
    } = await client.query(
      `
    INSERT INTO cart_products("shoppingId", "productId", quantity)
    VALUES($1, $2, $3)
    RETURNING *;
    `,
      [shoppingId, productId, quantity]
    );

    if (!productId) {
      throw new Error("Unable to find product");
    } else if (!cartProduct) {
      throw new Error("Unable to add products to cart");
    } else {
      cartProduct.product = product;
      console.log("addProductToCart: ", cartProduct);
      return cartProduct;
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateCartProductsQuantity({ cartProductId, quantity }) {
  try {
    if (!cartProductId || !quantity) {
      throw new Error("Must select a product from the cart and quantity");
    } else if (quantity === 0) {
      const removedCartProduct = await removeProductFromCart(cartProductId);
      console.log("updateCartProductQuantity (to zero): ", removedCartProduct);
    } else {
      const {
        rows: [cartProducts],
      } = await client.query(
        `
    SELECT cart_products.*
    FROM cart_products
    WHERE cart_products.id=$1;
    `,
        [cartProductId]
      );
      const product = await getProductById(cartProducts.productId);
      if (!product) {
        throw new error("Unable to get product");
      } else {
        const {
          rows: [updatedCartProducts],
        } = await client.query(
          `
      UPDATE cart_products 
      SET "quantity"= $1, 
      WHERE id= $2
      RETURNING *;

      `,
          [quantity, cartProductId]
        );

        if (!updatedCartProducts) {
          throw new Error("Unable to update cart product");
        } else {
          updatedCartProducts.product = product;
          console.log("updateCartProductQuantity: ", updatedCartProducts);
          return updatedCartProducts;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function removeProductFromCart(cartProductId) {
  try {
    const {
      rows: [cartProduct],
    } = await client.query(
      `
    DELETE FROM cart_products
    WHERE id=$1;
    `,
      [cartProductId]
    );
    if (!cartProduct) {
      throw new Error("Unable to delete product from cart");
    }
    console.log("removeProductFromCart: ", cartProduct);
    return cartProduct;
  } catch (err) {
    console.error(err);
  }
}

async function removeAllProductsFromCart(shoppingId) {
  try {
    const { rows: cartProduct } = await client.query(
      `
      DELETE FROM cart_products
      WHERE cart_products."shoppingId"=$1;
      `,
      [shoppingId]
    );
    if (!cartProduct) {
      throw new Error("Unable to delete product from cart");
    } else {
      console.log("removeAllProductsFromCart: ", cartProduct);
      return cartProduct;
    }
  } catch (err) {
    console.error(err);
  }
}
