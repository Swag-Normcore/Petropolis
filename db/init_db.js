const {
  client,
  // declare your model imports here
  // for example, User
} = require('./');

async function buildTables() {
  try {
    client.connect();
    console.log("Dropping all tables...");

    // drop tables in correct order

    await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS order_history;
    DROP TABLE IF EXISTS cart_products;
    DROP TABLE IF EXISTS shopping_cart;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS users;
  `)
    console.log("Dropped tables successfully.");

    // build tables in correct order

    console.log("Starting to build tables...")
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      "isAdmin" BOOLEAN DEFAULT false
      );
    `)
    await client.query(`
    CREATE TABLE categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255)
      );
    `)
    await client.query(`
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      image VARCHAR(255),
      "categoryId" INTEGER REFERENCES categories(id)
      );
    `)
    await client.query(`
    CREATE TABLE favorites(
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      "userId" INTEGER REFERENCES users(id) NOT NULL,
      CONSTRAINT UC_favorites UNIQUE ("productId", "userId")
    );
    `)
    await client.query(`
    CREATE TABLE shopping_cart(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id) NOT NULL UNIQUE,
      "expirationDate" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP + interval '1 week'
      );
    `)
    await client.query(`
    CREATE TABLE cart_products(
      id SERIAL PRIMARY KEY,
      "shoppingId" INTEGER REFERENCES shopping_cart(id) NOT NULL,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      quatitiy INTEGER NOT NULL,
      CONSTRAINT UC_cart_products UNIQUE ("shoppingId", "productId")
    );
    `)
    await client.query(`
    CREATE TABLE order_history(
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      "userId" INTEGER REFERENCES users(id) NOT NULL,
      quatity INTEGER NOT NULL,
      completed BOOLEAN DEFAULT false,
      "dateCreated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT UC_order_history UNIQUE ("productId", "userId")
    )
    `)
    await client.query(`
    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id) NOT NULL,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      "isAnonymous" BOOLEAN DEFAULT false,
      CONSTRAINT UC_reviews UNIQUE ("userId", "productId")
    );
    `)
    console.log("Created tables successfully.");

  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
