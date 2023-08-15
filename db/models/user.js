// grab our db client connection to use with our adapters
const client = require("../client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

module.exports = {
  // add your database adapter fns here
  getAllUsers,
  createUser,
  getUserById,
  getUserByEmailAndPassword,
  updateUser,
  deleteUser,
  isAdmin,
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
    throw error;
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
    console.log("createUser:", user);

    if (!user) {
      throw new Error("User not created");
    }

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT id, name, email, "isAdmin"
      FROM users
      WHERE id=${userId};
    `);
    console.log("getUserById:", user);
    if (!user) {
      return new Error("User not found");
    }

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
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
    throw error;
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
    throw error;
  }
}

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

    console.log("updateUser:", user);

    if (!user) {
      throw new Error("User not found");
    }

    delete user.password;

    return user;
  } catch (error) {
    throw error;
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
    throw error;
  }
}

//delete user and all their orders, reviews, and products, and orders_products associated with those user ids
//will need to be edited once we have reviews, products and orders
async function deleteUser(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      DELETE FROM users, orders, reviews, products, orders_products
      WHERE users.id=$1
      RETURNING *;
    `,
      [userId]
    );

    console.log("deleteUser:", user);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}
