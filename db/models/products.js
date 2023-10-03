const client = require("../client");

async function getAllProducts() {
  try {
    const { rows: products } = await client.query(`
    SELECT * FROM products;`);
    if (!products) {
      throw new Error("Issue getting products");
    }
    console.log("GET ALL PRODUCTS: ", products);
    return products;
  } catch (error) {
    console.error(error);
  }
}

async function createProduct({
  title,
  description,
  price,
  stock,
  imageUrl,
  categoryId,
  animalType,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    INSERT INTO products(title, description, price, stock, image, "categoryId", "animalType")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `,
      [title, description, price, stock, imageUrl, categoryId, animalType]
    );
    if (!product) {
      throw new Error("Issue creating product");
    }
    console.log("CREATE NEW PRODUCTS: ", product);
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function getProductById(productId) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    SELECT * FROM products
    WHERE id=$1;
    `,
      [productId]
    );
    if (!product) {
      throw new Error("Issue getting product");
    }
    console.log("GET PRODUCT BY ID", product);
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function getProductByTitle(title) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    SELECT * FROM products
    WHERE title=$1;
    `,
      [title]
    );
    if (!product) {
      throw new Error("Issue getting product");
    }
    console.log("GET PRODUCT BY TITLE", product);
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function getProductByCategoryId(categoryId) {
  try {
    const {
      rows: products,
    } = await client.query(
      `
    SELECT * FROM products
    WHERE "categoryId"=$1;
    `,
      [categoryId]
    );
    if (!products) {
      throw new Error("Issue getting products");
    }
    console.log("GET PRODUCTS BY CATEGORY ID", products);
    return products;
  } catch (error) {
    console.error(error);
  }
}

async function updateProduct(id, fields = {}) {
  const placeholders = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (placeholders.length === 0) {
    return;
  }
  console.log("placeholders: ", placeholders);
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    UPDATE products
    SET ${placeholders}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    if (!product) {
      throw new Error("Issue updating product");
    }
    console.log("UPDATE PRODUCT", product);
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function makeProductInactive(productId) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    UPDATE products
    SET "isActive"=false
    WHERE id=$1
    RETURNING *;
    `,
      [productId]
    );
    if (!product) {
      throw new Error("Issue updating product");
    }
    console.log("MAKE PRODUCT INACTIVE", product);
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function deleteProduct(productId) {
  try {
    await client.query(`
      DELETE FROM cart_products
      WHERE "productId"=$1;
    `, [productId])
    await client.query(`
      DELETE FROM order_products
      WHERE "productId"=$1;
    `, [productId])
    await client.query(`
      DELETE FROM reviews
      WHERE "productId"=$1;
    `, [productId])
    await client.query(`
      DELETE FROM favorites
      WHERE "productId"=$1;
    `, [productId])
    await client.query(`
      DELETE FROM images
      WHERE "productId"=$1;
    `, [productId])
    const {
      rows: [product],
    } = await client.query(
      `
    DELETE FROM products
    WHERE id=$1
    RETURNING *;
    `,
      [productId]
    );
    if (!product) {
      throw new Error("Issue deleting product");
    }
    console.log("DELETE PRODUCT", product);
    return product;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  getProductByTitle,
  getProductByCategoryId,
  updateProduct,
  makeProductInactive,
  deleteProduct,
};
