const { faker } = require('@faker-js/faker');
const { User, Category, Products, Reviews, Orders } = require("./db");

// const {
//   createUser,
//   createCategory,
//   createProduct,
//   createReview,
//   createOrder,
// } = require("./db/models");

const NUM_USERS = 20;
const NUM_CATEGORIES = 10;
const NUM_PRODUCTS = 100;
// const NUM_REVIEWS = 50;
// const NUM_ORDERS = 20;

async function createFakeData() {
  try {
    // create users
    const users = await Promise.all(
      [...Array(NUM_USERS)].map(async (_) => {
        return await User.createUser({
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          isAdmin: false,
        });
      })
    );

    // create categories
    const categories = await Promise.all(
      [...Array(NUM_CATEGORIES)].map(async (_) => {
        return await Category.createCategory({
          name: faker.commerce.department(),
        });
      })
    );

    // create products
    const products = await Promise.all(
      [...Array(NUM_PRODUCTS)].map(async (_) => {
        return await Products.createProduct({
          title: faker.commerce.productName(),
          // title: faker.animal.type(),
          description: faker.commerce.productDescription(),
          price: faker.number.int(100000),
          stock: faker.number.int(1000),
          categoryId: faker.helpers.arrayElement(categories).id,
          imageUrl: faker.image.urlLoremFlickr({ category: "animal" }),
          animalType: faker.helpers.arrayElement(['dog', 'cat']),
        });
      })
    );

    // create reviews
    // const reviews = await Promise.all(
    //   [...Array(NUM_REVIEWS)].map(async (_) => {
    //     return await Reviews.createReview({
    //       title: faker.commerce.productName(),
    //       comment: faker.commerce.productDescription(),
    //       rating: faker.number.int({ min: 1, max: 5 }),
    //       userId: faker.helpers.arrayElement(users).id,
    //       productId: faker.helpers.arrayElement(products).id,
    //       isAnonymous: faker.datatype.boolean()
    //     });
    //   })
    // );

    // create orders
    // const orders = await Promise.all(
    //   [...Array(NUM_ORDERS)].map(async (_) => {
    //     return await Orders.createOrder({
    //       userId: faker.helpers.arrayElement(users).id,
    //       status: faker.helpers.arrayElement(['complete', 'shipped']),
    //       totalPrice: 0
    //     });
    //   })
    // );

    console.log("Finished creating fake data!");
  } catch (error) {
    console.error(error);
  }
}

module.exports = createFakeData;
