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
    console.log(products);
    return products;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllCategories() {
  try {
    const { data: categories } = await axios.get("/api/categories");
    console.log("Get all categories in axios", categories);
    return categories;
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

export async function getAllUsers() {
  try {
    const { data: users } = await axios.get("/api/users");
    console.log("Get all users in axios", users);
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

export async function getAllFavorites(userId) {
  try {
    const { data: favorites } = await axios.get(`/api/favorites/${userId}`);
    console.log("Get all favorites in axios", favorites);
    return favorites;
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
      {},
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
}) {
  try {
    console.log("running addProductToShoppingCart...");
    const { data: shoppingCart } = await axios.post(
      `api/shopping_cart/${shoppingId}`,
      { productId, quantity },
      {
        "Content-Type": "application/json",
      }
    );
    if (!shoppingCart) {
      throw new Error("Couldn't add product to cart!");
    } else {
      console.log(shoppingCart);
      return shoppingCart;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removeProductFromShoppingCart({
  shoppingId,
  cartProductId,
}) {
  try {
    console.log("running removeProductFromShoppingCart...", cartProductId);
    const { data: shoppingCart } = await axios.delete(
      `api/shopping_cart/products/${cartProductId}`,
      {
        data: { shoppingId },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!shoppingCart) {
      throw new Error("Couldn't add product to cart!");
    } else {
      console.log(shoppingCart);
      return shoppingCart;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateShoppingCartProductQuantity({
  shoppingId,
  cartProductId,
  quantity,
}) {
  try {
    console.log("running updateCartProductQuantity...");
    const { data: shoppingCart } = await axios.patch(
      `api/shopping_cart/${shoppingId}`,
      { cartProductId, quantity },
      {
        "Content-Type": "application/json",
      }
    );
    if (!shoppingCart) {
      throw new Error("Couldn't add product to cart!");
    } else {
      console.log(shoppingCart);
      return shoppingCart;
    }
  } catch (error) {
    console.error(error);
  }
}
