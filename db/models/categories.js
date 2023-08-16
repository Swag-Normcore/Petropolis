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
    console.log("createCategory: ", category);
    if (!category) {
      throw new Error("Unable to create category");
    }
    return category;
  } catch (error) {
    throw error;
  }
}

async function getAllCategories() {
  try {
    const { rows: categories } = await client.query(`
  SELECT * FROM categories;
  `);
    console.log("categories: ", categories);
    if (!categories) {
      throw new Error("Unable to get categories");
    }
    return category;
  } catch (error) {
    throw error;
  }
}

async function getCategoryById(id) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
  SELECT * FROM categories
  WHERE id=$1;
  `,
      [id]
    );
    console.log("getCategoryById: ", category);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw error;
  }
}

async function updateCategory(id, fields = {}) {
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
    console.log("updateCategory: ", category);
    if (!category) {
      throw new Error("Unable to update category");
    }
    return category;
  } catch (error) {
    throw error;
  }
}

async function deleteCategory(id) {
  try {
    const {
      rows: [category],
    } = await client.query(
      `
    DELETE FROM categories, 
    WHERE id=$1;
    RETURNING *;
  `,
      [id]
    );
    const {
      rows: [products],
    } = await client.query(
      `
      UPDATE products
      SET "categoryId"=$1
      WHERE "categoryId"=$2;
      `,
      [null, categoryId]
    );

    console.log("deleteCategory: ", category);
    if (!category) {
      throw new Error("Unable to delete category");
    }
    return category && products;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
