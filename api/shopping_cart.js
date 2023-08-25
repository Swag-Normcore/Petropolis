const apiRouter = require("express").Router();
const { ShoppingCart, CartProducts } = require("../db");
const { requireUser, requireAdmin } = require("./utils");

// POST / (guest cart)
apiRouter.post("/", async (req, res, next) => {
    const userId = null;
    const { productId, quantity } = req.body;
    try {
        const guestCart = await ShoppingCart.createShoppingCart({ userId });
        if (!guestCart) {
            throw { error: "Couldn't create shopping cart!" };
        } else {
            if (productId && quantity) {
                const shoppingId = guestCart.id;
                const shoppingProduct = await CartProducts.addProductToCart({ shoppingId, productId, quantity });
                if (!shoppingProduct) {
                    throw { error: "Couldn't add product to cart!" };
                } else {
                    guestCart.products = shoppingProduct
                }
            }
            console.log("POST / (guest cart): ", guestCart);
            res.send(guestCart);
        }
    } catch ({ error }) {
        next({ error });
    }
})

// GET /:shoppingId (guest cart)

// PATCH /:shoppingId (guest cart)

// DELETE / (all guest carts) ***

// POST /users (user cart) *

// GET /users/:userId (user cart) **

// PATCH /users/:userId (user cart) **

// DELETE /users/:userId (user cart) **

module.exports = apiRouter;
