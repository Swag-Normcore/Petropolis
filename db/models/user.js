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
};

async function getAllUsers() {
  try {
    const { rows: users } = await client.query(`
      SELECT id, name, email, "isAdmin"
      FROM users;
    `);

    return users;
  } catch (error) {
    throw error;
  }
}

async function createUser({ name, password, email }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(name, password, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email, "isAdmin";
    `,
      [name, hashedPassword, email]
    );

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

    if (passwordsMatch) {
      delete user.password;
      return user;
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

    return user;
  } catch (error) {
    throw error;
  }
}

//delete user and all their orders, reviews, and products, and orders_products associated with those user ids
//will need to be edited once we have reviews, products and orders
async function deleteUser(userId) {
  try {
    const { rows: user } = await client.query(`
      DELETE FROM users
      WHERE id=${userId}
      RETURNING *;
    `);
    return user;
  } catch (error) {
    throw error;
  }
}
