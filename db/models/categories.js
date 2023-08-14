const client = require("../client");

async function createCategory({ name, description }) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
  INSERT INTO categories (name, description)
  VALUES ($1, $2)
  RETURNING *;
  `,
      [name, description]
    );
    if (!category) {
      throw Error;
    } else {
      console.log("category: ", category);
      return category;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllCategories() {
  try {
    const { rows: categories } = await client.query(`
  SELECT * FROM categories;
  `);
    if (!categories) {
      throw Error;
    } else {
      console.log("categories: ", categories);
      return category;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getCategoryById(id) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
  SELECT * FROM categories
  WHERE id = $1;
  `,
      [id]
    );
    if (!category) {
      throw Error;
    } else {
      console.log("getCategoryById: ", category);
      return category;
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateCategory({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map(
      (key, index) =>
        `"${key}" = $${index + 1}
    `
    )
    .join(", ");
  try {
    const {
      rows: [category],
    } = await client.query(
      `
    UPDATE categories
    SET ${setString} 
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );
    if (!category) {
      throw Error;
    } else {
      return category;
    }
  } catch (err) {}
}

async function deleteCategory(id) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
  DELETE FROM categories
  WHERE id = $1;
  RETURNING *;
  `,
      [id]
    );
    if (!category) {
      throw Error;
    } else {
      console.log("deleteCategory: ", category);
      return category;
    }
  } catch (err) {}
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
