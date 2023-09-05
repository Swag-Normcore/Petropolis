// grab our db client connection to use with our adapters
const client = require("../client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;
const { deleteOrdersByUser } = require("./orders");
const { createShoppingCart, deleteShoppingCart } = require("./shoppingCart");
const { deleteReviewsByUser } = require("./reviews");
const { deleteFavoritesByUser } = require("./favorites");

module.exports = {
  // add your database adapter fns here
  getAllUsers,
  createUser,
  getUserById,
  getUserByEmail,
  getUserByEmailAndPassword,
  updateUser,
  deleteUser,
  isAdmin,
  updatePassword,
};

async function getAllUsers() {
  try {
    const { rows: users } = await client.query(`
      SELECT id, name, email, "isAdmin"
      FROM users;
    `);
    console.log("getAllUsers:", users);
    if (!users) {
      throw new Error("No users found");
    }

    return users;
  } catch (error) {
    console.error(error);
  }
}

async function createUser({ name, password, email, isAdmin }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(name, password, email, "isAdmin")
      VALUES($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `,
      [name, hashedPassword, email, isAdmin]
    );

    if (!user) {
      throw new Error("User not created");
    }

    const shoppingCart = await createShoppingCart({ userId: user.id });

    if (!shoppingCart) {
      throw new Error("Failed to create shopping cart for user!");
    }

    user.shoppingId = shoppingCart.id;
    delete user.password;
    console.log("createUser:", user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT users.id, users.name, users.email, users."isAdmin",
      shopping_cart.id as "shoppingId"
      FROM users
      JOIN shopping_cart ON users.id=shopping_cart."userId"
      WHERE users.id=${userId};
    `);
    console.log("getUserById:", user);
    if (!user) {
      return new Error("User not found");
    }

    delete user.password;

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByEmail(email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT users.*, shopping_cart.id as "shoppingId"
      FROM users
      JOIN shopping_cart ON users.id=shopping_cart."userId"
      WHERE email=$1;
    `,
      [email]
    );

    console.log("getUserByEmail:", user);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByEmailAndPassword({ email, password }) {
  try {
    const user = await getUserByEmail(email);

    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    console.log("getUserByEmailAndPassword:", user);
    console.log("passwordsMatch:", passwordsMatch);

    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      throw new Error("Password incorrect");
    }
  } catch (error) {
    console.error(error);
  }
}

// Only for name and isAdmin right now
async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    if (!user) {
      throw new Error("User not found");
    }

    delete user.password;
    console.log("updateUser:", user);

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function updatePassword({ userId, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows: [user] } = await client.query(`
      UPDATE users
      SET "password"=$1
      WHERE id=$2
      RETURNING *;
    `, [hashedPassword, userId]);
    if (!user) {
      throw new Error("Couldn't update user!");
    } else {
      delete user.password;
      console.log("updatedPassword: ", user);
      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

//check if user is admin
//can be used to check if user is admin before allowing them to make changes to the database
async function isAdmin(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT "isAdmin"
      FROM users
      WHERE id=$1;
    `,
      [userId]
    );

    console.log("isAdmin:", user);

    if (!user) {
      throw new Error("User not found");
    }

    return user.isAdmin;
  } catch (error) {
    console.error(error);
  }
}

//delete user and all their orders, reviews, and products, and orders_products associated with those user ids
//will need to be edited once we have reviews, products and orders
async function deleteUser(userId) {
  try {
    await deleteOrdersByUser(userId);
    const user = await getUserById(userId);
    await deleteShoppingCart(user.shoppingId);
    await deleteReviewsByUser(userId);
    await deleteFavoritesByUser(userId);
    const {
      rows: [deletedUser],
    } = await client.query(
      `
      DELETE FROM users
      WHERE id=$1
      RETURNING *;
    `,
      [userId]
    );

    if (!user) {
      throw new Error("User not found");
    }

    console.log("deleteUser:", deletedUser);
    return deletedUser;
  } catch (error) {
    console.error(error);
  }
}
