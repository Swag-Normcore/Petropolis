module.exports = {
  // add each model to your exports object here
  // so that you can use them in your express server api routers
  // for example, create a users.js file for a User model
  // and User: require('./user') here

  User: require("./user"),
  Category: require("./categories"),
  Products: require("./products"),
  Images: require("./images"),
  ShoppingCart: require("./shoppingCart"),
  CartProducts: require("./cartProducts"),
  Orders: require("./orders"),
  Order_Products: require("./order_products"),
  Favorites: require("./favorites"),
  Reviews: require("./reviews")

};

// then, in your API, you'll require the appropriate model
// and use its database connectors
// ie User.getUserById(), where user.js had a module.exports
// that looked like this: module.exports = { getUserById, ... }

// getAllUsers, *
// createUser, *
// getUserById, *
// getUserByEmail, *
// getUserByEmailAndPassword, *
// updateUser, *
// deleteUser, --------------
// isAdmin, *

// createCategory, *
// getAllCategories, *
// getCategoryById, *
// updateCategory, *
// deleteCategory, *

// getAllProducts, *
// createProduct, *
// getProductById, *
// getProductByTitle, *
// getProductByCategoryId, *
// updateProduct, *
// makeProductInactive, *
// deleteProduct, *

// createFavorite, *
// getAllFavorites, *
// getFavorite, *
// updateFavorite, don't need to worry about this one
// deleteFavorite, *
// deleteFavoritesByUser, *

// createReview, *
// getReviewsByProduct, *
// getReviewsByUser, *
// deleteReview, *
// updateReview, *
// deleteReviewsByUser, *
// getReviewById, *

// addImages, *
// getProductsWithImages, *
// deleteImage, *
// deleteAllImagesForAProduct *,

// createShoppingCart, *
// getShoppingCart, *
// updateShoppingCart, *
// deleteShoppingCart, *
// deleteAllGuestCarts, *

// getProductsByShoppingCart, *
// addProductToCart, *
// updateCartProductsQuantity, *
// removeProductFromCart, *
// removeAllProductsFromCart, *

// createOrder, *
// getOrderById, *
// getAllOrdersByUser, *
// updateOrder, *
// deleteOrder, *
// deleteOrdersByUser, *

// addProductToOrder, *
// getOrderProductsByOrder, *
// removeProductFromOrder, *
// updateOrderProductQuantity *
