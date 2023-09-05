import axios from "axios";

// this file holds your frontend network request adapters
// think about each function as a service that provides data
// to your React UI through AJAX calls

// for example, if we need to display a list of users
// we'd probably want to define a getUsers service like this:

/*
  export async function getUsers() {
    try {
      const { data: users } = await axios.get('/api/users')
      return users;
    } catch(err) {
      console.error(err)
    }
  }
*/

export async function register({ name, email, password }) {
  try {
    const { data: user } = await axios.post(
      "/api/users/register",
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Axios register POST", user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function login({ email, password }) {
  try {
    const { data: user } = await axios.post(
      "/api/users/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Axios login POST", user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function getUser({ token }) {
  try {
    const { data: user } = await axios.get("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function getAPIHealth() {
  try {
    const { data } = await axios.get("/api/health");
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    return { healthy: false };
  }
}

export async function getAllProducts() {
  try {
    const { data: products } = await axios.get("/api/products");
    return products;
  } catch (error) {
    console.error(error);
  }
}

export async function createProduct({
  title,
  description,
  price,
  stock,
  imageUrl,
  categoryId,
  animalType,
  token,
}) {
  try {
    const { data: product } = await axios.post(
      "/api/products",
      { title, description, price, stock, imageUrl, categoryId, animalType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("product inside axios", product);
    return product;
  } catch (error) {
    console.error(error);
  }
}

export async function addImagesToProduct({ productId, imageUrls, token }) {
  try {
    const { data: images } = await axios.post(
      `/api/images/product/${productId}`,
      { imageUrls },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("images inside axios", images);
    return images;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllCategories() {
  try {
    const { data: categories } = await axios.get("/api/categories");
    return categories;
  } catch (error) {
    console.error(error);
  }
}

export async function createCategory({ name, description, token }) {
  try {
    const { data: category } = await axios.post(
      "/api/categories",
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Category inside axios post", category);
    return category;
  } catch (error) {
    console.error(error);
  }
}

export async function patchCategory({ categoryId, name, description, token }) {
  try {
    console.log("log inside patch", categoryId, name, description, token);
    const { data: category } = await axios.patch(
      `/api/categories/${categoryId}`,
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("result from inside axios update category", category);
    return category;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCategory({ categoryId, token }) {
  try {
    const { data: category } = await axios.delete(
      `/api/categories/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return category;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete category");
  }
}

export async function getAllUsers({ token }) {
  try {
    const { data: users } = await axios.get("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("axios call", users);
    return users;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(userId) {
  try {
    const { data: user } = await axios.get(`/api/users/${userId}`);
    console.log("Get user by id in axios", user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser({ userId, token }) {
  try {
    const { data: user } = await axios.delete(`/api/users/${userId}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("deleting user in axios", user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function patchUser({ userId, token, isAdmin }) {
  try {
    const { data: user } = await axios.patch(
      `/api/users/${userId}`,
      { isAdmin },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("patch users req inside axios", user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllFavorites({ userId, token }) {
  try {
    const { data: favorites } = await axios.get(`/api/favorites/${userId}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return favorites;
  } catch (error) {
    console.error(error);
  }
}

export async function addToFavorites({ productId, token }) {
  try {
    const { data: favorite } = await axios.post(
      "/api/favorites",
      {
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(favorite);
    return favorite;
  } catch (error) {
    console.error(error);
  }
}

export async function removeFavorite({ favoriteId, token }) {
  try {
    const { data: favorite } = await axios.delete(
      `/api/favorites/remove/${favoriteId}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("remove fave in axios", favorite);
    return favorite;
  } catch (error) {
    console.error(error);
  }
}

export async function isAdmin(userId) {
  try {
    const { data: isAdmin } = await axios.get(`/api/users/${userId}`);
    console.log("Is admin in axios", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error(error);
  }
}

export async function createGuestShoppingCart() {
  try {
    console.log("running createGuestShoppingCart...");
    const { data: shoppingCart } = await axios.post("/api/shopping_cart/guest");
    if (!shoppingCart) {
      throw new Error("Couldn't create new guest cart!");
    } else {
      console.log(shoppingCart);
      return shoppingCart;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getUserShoppingCart({ shoppingId, token }) {
  try {
    console.log("running getUserShoppingCart...");
    const { data: shoppingCart } = await axios.get(
      `/api/shopping_cart/${shoppingId}`,

      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!shoppingCart) {
      throw new Error("Couldn't get user's shopping cart!");
    } else {
      console.log(shoppingCart);
      return shoppingCart;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getGuestShoppingCart({ shoppingId }) {
  try {
    console.log("running getGuestShoppingCart...");
    const { data: shoppingCart } = await axios.get(
      `/api/shopping_cart/${shoppingId}`,
      {},
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if (!shoppingCart) {
      throw new Error("Couln't get guest's shopping cart!");
    } else {
      console.log(shoppingCart);
      return shoppingCart;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addProductToShoppingCart({
  shoppingId,
  productId,
  quantity,
  token,
}) {
  try {
    console.log("running addProductToShoppingCart...");
    console.log(shoppingId, productId, quantity, token);
    // const { data: shoppingCart } = await axios.post(
    //   `api/shopping_cart/${shoppingId}`,
    //   {
    //     productId,
    //     quantity,
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${token}`,
    //     }
    //   }
    // );
    if (token) {
      const { data: shoppingCart } = await axios({
        method: "post",
        url: `/api/shopping_cart/${shoppingId}`,
        data: {
          productId,
          quantity,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!shoppingCart) {
        throw new Error("Couldn't add product to cart!");
      } else {
        console.log(shoppingCart);
        return shoppingCart;
      }
    } else {
      const { data: shoppingCart } = await axios({
        method: "post",
        url: `/api/shopping_cart/${shoppingId}`,
        data: {
          productId,
          quantity,
        },
      });
      if (!shoppingCart) {
        throw new Error("Couldn't add product to cart!");
      } else {
        console.log(shoppingCart);
        return shoppingCart;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removeProductFromShoppingCart({
  shoppingId,
  cartProductId,
  token,
}) {
  try {
    console.log("running removeProductFromShoppingCart...", cartProductId);
    // const { data: shoppingCart } = await axios.delete(
    //   `api/shopping_cart/products/${cartProductId}`,
    //   {
    //     data: { shoppingId },
    //   }, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // }
    // );
    if (token) {
      const { data: shoppingCart } = await axios({
        method: "delete",
        url: `/api/shopping_cart/products/${cartProductId}`,
        data: {
          shoppingId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!shoppingCart) {
        throw new Error("Couldn't add product to cart!");
      } else {
        console.log(shoppingCart);
        return shoppingCart;
      }
    } else {
      const { data: shoppingCart } = await axios({
        method: "delete",
        url: `/api/shopping_cart/products/${cartProductId}`,
        data: {
          shoppingId,
        },
      });
      if (!shoppingCart) {
        throw new Error("Couldn't add product to cart!");
      } else {
        console.log(shoppingCart);
        return shoppingCart;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateShoppingCartProductQuantity({
  shoppingId,
  cartProductId,
  quantity,
  token,
}) {
  try {
    console.log("running updateCartProductQuantity...");
    // const { data: shoppingCart } = await axios.patch(
    //   `api/shopping_cart/${shoppingId}`,
    //   {
    //     cartProductId,
    //     quantity,
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${token}`,
    //     }
    //   }
    // );
    if (token) {
      const { data: shoppingCart } = await axios({
        method: "patch",
        url: `/api/shopping_cart/${shoppingId}`,
        data: {
          cartProductId,
          quantity,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!shoppingCart) {
        throw new Error("Couldn't add product to cart!");
      } else {
        console.log(shoppingCart);
        return shoppingCart;
      }
    } else {
      const { data: shoppingCart } = await axios({
        method: "patch",
        url: `/api/shopping_cart/${shoppingId}`,
        data: {
          cartProductId,
          quantity,
        },
      });
      if (!shoppingCart) {
        throw new Error("Couldn't add product to cart!");
      } else {
        console.log(shoppingCart);
        return shoppingCart;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getSingleProduct({ productId }) {
  try {
    const { data: product } = await axios.get(`/api/products/${productId}`, {
      "Content-Type": "application/json",
    });
    if (!product) {
      throw new Error("Couldn't get product!");
    } else {
      console.log(product);
      return product;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getProductImages({ productId }) {
  try {
    const { data: images } = await axios.get(
      `/api/images/product/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!images) {
      throw new Error("Couldn't get product!");
    } else {
      console.log(images);
      return images;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProduct({ productId, token }) {
  const { data: deletedProduct } = await axios({
    method: "patch",
    url: `/api/products/${productId}/active`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!deletedProduct) {
    throw new Error("Couldn't delete product!");
  } else {
    console.log(deletedProduct);
    return deletedProduct;
  }
}

export async function updateProduct({
  productId,
  token,
  title,
  description,
  animalType,
  price,
  stock,
  image,
  categoryId,
}) {
  const { data: updatedProduct } = await axios({
    method: "patch",
    url: `/api/products/${productId}`,
    data: {
      title,
      description,
      animalType,
      price,
      stock,
      image,
      categoryId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!updatedProduct) {
    throw new Error("Couldn't update product!");
  } else {
    console.log(updatedProduct);
    return updatedProduct;
  }
}

export async function stripeCheckout({ cartProducts, shoppingId, token }) {
  try {
    const { data: url } = await axios({
      method: "post",
      url: "/api/stripe/create-checkout-session",
      data: {
        cartProducts,
        shoppingId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(url);
    return url;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllOrders({ token, userId }) {
  try {
    const { data: orders } = await axios({
      method: "get",
      url: `/api/orders/users/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
    console.log(orders);
    return orders;
  } catch (error) {
    console.error(error)
  }
}

export async function updateUser({ userId, name, password, token }) {
  try {
    console.log("updateUser: ", userId, name, password, token);
    if (name) {
      const { data: updatedUser } = await axios({
        method: "patch",
        url: `/api/users/${userId}`,
        data: {
          name,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!updatedUser) {
        throw new Error("Unable to update user");
      } else {
        console.log(updatedUser);
        return updatedUser;
      }
    } else if (password) {
      const { data: updatedUser } = await axios({
        method: "patch",
        url: `/api/users/${userId}`,
        data: {
          password,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!updatedUser) {
        throw new Error("Unable to update user");
      } else {
        console.log(updatedUser);
        return updatedUser;
      }
    }
  } catch (error) {
    console.error(error);
  }
}
