const faker = require("faker");

const {
  createUser,
  createCategory,
  createProduct,
  createReview,
  createOrder,
} = require("./db/models");

const NUM_USERS = 20;
const NUM_CATEGORIES = 20;
const NUM_PRODUCTS = 50;
const NUM_REVIEWS = 50;
const NUM_ORDERS = 20;

async function createFakeData() {
  try {
    // create users
    const users = await Promise.all(
      [...Array(NUM_USERS)].map((_) => {
        return createUser({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          isAdmin: faker.datatype.boolean(),
        });
      })
    );

    // create categories
    const categories = await Promise.all(
      [...Array(NUM_CATEGORIES)].map((_) => {
        return createCategory({
          name: faker.commerce.department(),
        });
      })
    );

    // create products
    const products = await Promise.all(
      [...Array(NUM_PRODUCTS)].map((_) => {
        return createProduct({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          quantity: faker.datatype.number(),
          categoryId: faker.random.arrayElement(categories).id,
        });
      })
    );

    // create reviews
    const reviews = await Promise.all(
      [...Array(NUM_REVIEWS)].map((_) => {
        return createReview({
          title: faker.commerce.productName(),
          content: faker.commerce.productDescription(),
          stars: faker.datatype.number({ min: 1, max: 5 }),
          userId: faker.random.arrayElement(users).id,
          productId: faker.random.arrayElement(products).id,
        });
      })
    );

    // create orders
    const orders = await Promise.all(
      [...Array(NUM_ORDERS)].map((_) => {
        return createOrder({
          userId: faker.random.arrayElement(users).id,
        });
      })
    );

    console.log("Finished creating fake data!");
  } catch (error) {
    console.error(error);
  }
}

module.exports = createFakeData;
