const apiRouter = require("express").Router();
const { ShoppingCart, CartProducts } = require("../db");
const { requireUser, requireAdmin } = require("./utils");

// POST / (guest cart)
apiRouter.post("/guest", async (req, res, next) => {
    const userId = null;
    // const { productId, quantity } = req.body;
    try {
        const guestCart = await ShoppingCart.createShoppingCart({ userId });
        if (!guestCart) {
            throw { error: "Couldn't create shopping cart!" };
        } else {
            // if (productId && quantity) {
            // const shoppingId = guestCart.id;
            // const shoppingProduct = await CartProducts.addProductToCart({ shoppingId, productId, quantity });
            // if (!shoppingProduct) {
            //     throw { error: "Couldn't add product to cart!" };
            // } else {
            //     guestCart.products = shoppingProduct
            // }
            // }
            console.log("POST / (guest cart): ", guestCart);
            res.send(guestCart);
        }
    } catch ({ error }) {
        next({ error });
    }
})

// GET /:shoppingId (guest or user cart)
apiRouter.get("/:shoppingId", async (req, res, next) => {
    const shoppingId = req.params.shoppingId;
    try {
        const shoppingCart = await ShoppingCart.getShoppingCart(shoppingId);
        if (!shoppingCart) {
            throw { error: "Couldn't get shopping cart!" };
        } else {
            if (shoppingCart.userId && shoppingCart.userId !== req.user.id) {
                throw { error: "Can't get another users cart!" };
            } else {
                const cartProducts = await CartProducts.getProductsByShoppingCart(shoppingId);
                if (!cartProducts) {
                    throw { error: "Couldn't get cart products!" }
                } else {
                    shoppingCart.products = cartProducts;
                    console.log("GET /:shoppingId ", shoppingCart);
                    res.send(shoppingCart);
                }
            }
        }
    } catch ({ error }) {
        next({ error });
    }
})

// POST /:shoppingId (guest or user cart)
apiRouter.post("/:shoppingId", async (req, res, next) => {
    const shoppingId = Number(req.params.shoppingId);
    const { productId, quantity } = req.body;
    try {
        const shoppingCart = await ShoppingCart.getShoppingCart(shoppingId);
        if (!shoppingCart) {
            throw { error: "Couldn't find cart!" };
        } else {
            if (shoppingCart.userId && shoppingCart.userId !== req.user.id) {
                throw { error: "Can't get another users cart!" };
            } else {
                const cartProducts = await CartProducts.getProductsByShoppingCart(shoppingId);
                let cartProductId = null;
                let cartProductQuantity = null;
                let indexOfCartProduct = null;
                cartProducts.forEach((product, index) => {
                    if (product.productId == productId) {
                        cartProductId = product.id;
                        cartProductQuantity = product.quantity + quantity;
                        indexOfCartProduct = index;
                    }
                });
                if (cartProductId) {
                    const updatedCartProduct = await CartProducts.updateCartProductsQuantity({ cartProductId, quantity: cartProductQuantity })
                    if (!updatedCartProduct) {
                        throw { error: "Couldn't update cart product quantity!" };
                    } else {
                        cartProducts.splice(indexOfCartProduct, 1, updatedCartProduct);
                        shoppingCart.products = cartProducts;
                        console.log("POST /:shoppingId ", shoppingCart);
                        res.send(shoppingCart);
                    }
                } else {
                    const newCartProduct = await CartProducts.addProductToCart({ shoppingId, productId, quantity });
                    if (!newCartProduct) {
                        throw { error: "Couldn't add product to cart!" };
                    } else {
                        cartProducts.push(newCartProduct);
                        shoppingCart.products = cartProducts;
                        console.log("POST /:shoppingId ", shoppingCart);
                        res.send(shoppingCart);
                    }
                }
            }
        }
    } catch ({ error }) {
        next({ error });
    }
})

// PATCH /:shoppingId (guest or user cart product quantity)

apiRouter.patch("/:shoppingId", async (req, res, next) => {
    const shoppingId = req.params.shoppingId;
    const { cartProductId, quantity } = req.body;
    try {
        const shoppingCart = await ShoppingCart.getShoppingCart(shoppingId);
        if (!shoppingCart) {
            throw { error: "Couldn't find cart!" }
        } else {
            if (shoppingCart.userId && shoppingCart.userId !== req.user.id) {
                throw { error: "Can't get another users cart!" };
            } else {
                const updatedCartProduct = await CartProducts.updateCartProductsQuantity({ cartProductId, quantity });
                if (!updatedCartProduct) {
                    throw { error: "Couldn't update cart!" };
                } else {
                    const allCartProducts = await CartProducts.getProductsByShoppingCart(shoppingId);
                    if (!allCartProducts) {
                        throw { error: "Couldn't get all cart products!" };
                    }
                    shoppingCart.products = allCartProducts;
                    console.log("PATCH /:cartProductId ", shoppingCart);
                    res.send(shoppingCart);
                }
            }
        }
    } catch ({ error }) {
        next({ error });
    }
})

// DELETE /:shoppingId (guest or user cart)

apiRouter.delete("/products/:cartProductId", async (req, res, next) => {
    const cartProductId = req.params.cartProductId;
    const { shoppingId } = req.body;
    try {
        const shoppingCart = await ShoppingCart.getShoppingCart(shoppingId);
        if (!shoppingCart) {
            throw { error: "Couldn't find cart!" };
        } else {
            if (shoppingCart.userId && shoppingCart.userId !== req.user.id) {
                throw { error: "Can't get another users cart!" };
            } else {
                const removedProduct = await CartProducts.removeProductFromCart(cartProductId);
                if (!removedProduct) {
                    throw { error: "Couldn't remove product from cart!" }
                } else {
                    const allCartProducts = await CartProducts.getProductsByShoppingCart(shoppingId);
                    if (!allCartProducts) {
                        throw { error: "Couldn't get shopping cart!" };
                    } else {
                        shoppingCart.products = allCartProducts;
                        console.log("DELETE /:shoppingId ", shoppingCart);
                        res.send(shoppingCart);
                    }
                }
            }
        }
    } catch ({ error }) {
        next({ error });
    }
})

// DELETE /:shoppingId (guest cart)

// apiRouter.delete("/:shoppingId", async (req, res, next) => { })

// DELETE /guest (all guest carts) ***

apiRouter.delete("/guest", requireUser, requireAdmin, async (req, res, next) => {
    try {
        console.log("request to delete guest carts");
        const deletedCarts = await ShoppingCart.deleteAllGuestCarts();
        console.log("Trying to delete guest carts...")
        if (!deletedCarts) {
            console.log("Couldn't delete all guest carts!")
            throw { error: "Couldn't delete all guest carts!" };
        } else {
            console.log("DELETE /guest ", deletedCarts);
            res.send(deletedCarts);
        }
    } catch ({ error }) {
        next({ error });
    }
})

module.exports = apiRouter;
