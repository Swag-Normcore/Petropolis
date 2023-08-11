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
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS products;
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
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      image VARCHAR(255)
      );
    `)
    await client.query(`
    CREATE TABLE categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255)
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
