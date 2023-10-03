const {
  client,
  Category,
  User,
  Reviews,
  Orders,
  Products,
  Order_Products,
  Favorites,
  Images,
  ShoppingCart,
} = require("./");
const { createNewProduct } = require("./models/products");
const createFirstTwenty = require("./data");

// const faker = require("@faker-js/faker");
const createFakeData = require("../faker");
const { create } = require("domain");

async function buildTables() {
  try {
    client.connect();
    console.log("Starting to drop tables...");

    // drop tables in correct order

    await client.query(`
    DROP TABLE IF EXISTS images;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS order_products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_products;
    DROP TABLE IF EXISTS shopping_cart;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS users;
  `);
    console.log("Dropped tables successfully.");

    // build tables in correct order
    console.log("Starting to build tables...");
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      "isAdmin" BOOLEAN DEFAULT false
      );
    `);
    await client.query(`
    CREATE TABLE categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255)
      );
    `);
    await client.query(`
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      "animalType" VARCHAR(255),
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      image VARCHAR(255),
      "categoryId" INTEGER REFERENCES categories(id),
      "isActive" BOOLEAN DEFAULT true
      );
    `);
    await client.query(`
    CREATE TABLE images(
      id SERIAL PRIMARY KEY,
      "imageUrl" VARCHAR(255) NOT NULL,
      "productId" INTEGER REFERENCES products(id) NOT NULL
    );
    `);
    await client.query(`
    CREATE TABLE favorites(
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      "userId" INTEGER REFERENCES users(id) NOT NULL,
      CONSTRAINT UC_favorites UNIQUE ("productId", "userId")
    );
    `);
    await client.query(`
    CREATE TABLE shopping_cart(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id) UNIQUE
      );
    `);
    await client.query(`
    CREATE TABLE cart_products(
      id SERIAL PRIMARY KEY,
      "shoppingId" INTEGER REFERENCES shopping_cart(id) NOT NULL,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL,
      CONSTRAINT UC_cart_products UNIQUE ("shoppingId", "productId")
    );
    `);
    await client.query(`
    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id) NOT NULL,
      status VARCHAR(255) NOT NULL,
      "totalPrice" INTEGER NOT NULL,
      "dateCreated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    `);
    await client.query(`
    CREATE TABLE order_products(
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES orders(id) NOT NULL,
      "productId" INTEGER REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL,
      "subTotal" INTEGER NOT NULL,
      CONSTRAINT UC_order_products UNIQUE ("orderId", "productId")
    );
    `);
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
    `);
    console.log("Built tables successfully.");
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
    console.log(
      "Starting to test database functions ******************************************************"
    );

    console.log("Starting to create users ...");
    const fakeUser1 = await User.createUser({
      email: "wizardboi@hogwarts.wiz",
      password: "lumosmaxima",
      name: "Albus Dumbledore",
      isAdmin: true,
    });
    const fakeUser2 = await User.createUser({
      email: "thechosenone@hogwarts.wiz",
      password: "expelliarmus",
      name: "Harry Potter",
      isAdmin: false,
    });
    const fakeUser3 = await User.createUser({
      email: "Tyrannosaurus@Zordon.Go",
      password: "Dragonzord",
      name: "Red Ranger",
      isAdmin: false,
    });
    const fakeUser4 = await User.createUser({
      email: "Triceratops@Zordon.Go",
      password: "PinkRanger",
      name: "Blue Ranger",
      isAdmin: false,
    });
    console.log("Finished creating users!");

    console.log("Starting to check users functions...");
    const updatedUser1 = await User.updateUser(fakeUser1.id, {
      name: "The Albus Dumbledore",
    });
    const updatedUser2 = await User.updateUser(fakeUser2.id, { isAdmin: true });
    const adminUser1 = await User.isAdmin(fakeUser2.id);
    const adminUser2 = await User.isAdmin(fakeUser3.id);
    console.log("Finished updating users!");

    console.log("Creating categories...");
    const categoryOne = await Category.createCategory({
      name: "Beds",
      description: "Beds for your furry friend",
    });
    const categoryTwo = await Category.createCategory({
      name: "Equipment/Clothes",
      description: "From collars and leashes to cute outfits",
    });
    const categoryThree = await Category.createCategory({
      name: "Food",
      description: "S-XL bags of food for cats and dogs",
    });
    const categoryFour = await Category.createCategory({
      name: "Toys",
      description: "Fun playthings for any animal",
    });
    const categoryFive = await Category.createCategory({
      name: "Houses/Enclosures",
      description:
        "Keep your pet safe with our high-quality houses, cages, and more",
    });
    console.log("Finshed creating categories.");

    console.log("Starting to create products");
    const fakeProduct1 = await Products.createProduct({
      title: "Large Brown Dog Bed",
      description: "Soft polyester lining and walls will make your pet happy!",
      price: 2099,
      stock: 20,
      imageUrl:
        "https://m.media-amazon.com/images/I/61gxx3o19RL._AC_SL1500_.jpg",
      categoryId: 1,
      animalType: "dog",
    });
    // const fakeProduct2 = await Products.createProduct({
    //   title: "Bone chew toy",
    //   description: "Splinter free for pet safety!",
    //   price: 999,
    //   stock: 950,
    //   imageUrl:
    //     "https://target.scene7.com/is/image/Target/GUEST_c7f07978-3f6d-47f8-9f07-161fa101de27",
    //   categoryId: 2,
    //   animalType: "dog",
    // });
    const fakeProduct3 = await Products.createProduct({
      title: "Stuffed cat treats",
      description: "Delicious salmon filled treats with no filler products!",
      price: 999,
      stock: 250,
      imageUrl:
        "https://i0.wp.com/catladyfitness.com/wp-content/uploads/2018/11/final-treats-puppy.jpg?w=665",
      categoryId: 3,
      animalType: "cat",
    });
    console.log("Finished creating products!");

    console.log("Starting to create orders...");
    const order1 = await Orders.createOrder({
      userId: fakeUser1.id,
      status: "pending",
      totalPrice: 0,
    });
    const order2 = await Orders.createOrder({
      userId: fakeUser2.id,
      status: "pending",
      totalPrice: 0,
    });
    const order3 = await Orders.createOrder({
      userId: fakeUser3.id,
      status: "pending",
      totalPrice: 0,
    });
    const order4 = await Orders.createOrder({
      userId: fakeUser4.id,
      status: "pending",
      totalPrice: 0,
    });
    console.log("Finished creating orders!");

    console.log("Starting to add products to order...");
    await Order_Products.addProductToOrder({
      orderId: 1,
      productId: 1,
      quantity: 1,
    });
    await Order_Products.addProductToOrder({
      orderId: 2,
      productId: 2,
      quantity: 2,
    });
    await Order_Products.addProductToOrder({
      orderId: 3,
      productId: 3,
      quantity: 3,
    });
    await Order_Products.addProductToOrder({
      orderId: 4,
      productId: 1,
      quantity: 4,
    });
    await Order_Products.addProductToOrder({
      orderId: 1,
      productId: 2,
      quantity: 2,
    });
    await Order_Products.addProductToOrder({
      orderId: 1,
      productId: 3,
      quantity: 3,
    });
    console.log("Finished adding products to order!");

    console.log("Starting to test all orders functions...");
    await Orders.getOrderById(order1.id);
    await Orders.getAllOrdersByUser(fakeUser1.id);
    await Orders.updateOrder(1, { status: "completed" });
    await Orders.deleteOrder(4);
    await Orders.deleteOrdersByUser(3);
    await Order_Products.getOrderProductsByOrder(1);
    await Order_Products.updateOrderProductQuantity({
      orderProductId: 1,
      quantity: 5,
    });
    console.log("Finished testing orders functions!");

    console.log("Starting to test all category functions...");
    await Category.getAllCategories();
    await Category.getCategoryById(1);
    await Category.updateCategory(1, { name: "Pet Beds" });
    await Category.updateCategory(3, {
      description: "Bags of food for cats and dogs",
    });
    // await Category.deleteCategory(2);
    console.log("Finshied testing all category functions!");

    console.log("Starting to test all product functions...");
    await Products.getAllProducts();
    await Products.getProductById(1);
    await Products.getProductByTitle("Bone chew toy");
    await Products.updateProduct(2, { categoryId: 3 });
    await Products.getProductByCategoryId(3);
    // await Products.makeProductInactive(1);
    console.log("Finished testing all product functions!");

    console.log("Starting to test all favorites functions...");
    await Favorites.createFavorite({ userId: 1, productId: 1 });
    await Favorites.createFavorite({ userId: 1, productId: 3 });
    await Favorites.getAllFavorites(1);
    await Favorites.getFavorite(1);
    await Favorites.deleteFavorite(1);
    await Favorites.deleteFavoritesByUser(1);
    console.log("Finished testing all favorites functions!");

    console.log("Starting to test all reviews functions...");
    await Reviews.createReview({
      userId: 1,
      productId: 1,
      rating: 5,
      comment: "It's good, init",
      isAnonymous: false,
    });
    await Reviews.createReview({
      userId: 2,
      productId: 1,
      rating: 3,
      comment: "It's mid, init",
      isAnonymous: false,
    });
    await Reviews.createReview({
      userId: 3,
      productId: 1,
      rating: 1,
      comment: "It's bad, init",
      isAnonymous: true,
    });
    await Reviews.getReviewsByUser(3);
    await Reviews.getReviewsByProduct(1);
    await Reviews.updateReview(2, {
      rating: 4,
      comment: "Ok it's pretty good, init",
    });
    await Reviews.getReviewById(1);
    await Reviews.deleteReview(3);
    await Reviews.deleteReviewsByUser(1);
    await Reviews.getReviewsByProduct(1);
    console.log("Finished testing all reviews functions!");

    console.log("Starting to test all images functions...");
    await Images.addImages(1, [
      "https://image.chewy.com/is/image/catalog/191823_MAIN._AC_SL1200_V1565795239_.jpg",
      "https://www.impactdogcrates.com/cdn/shop/products/CommenceStudio2022-ImpactDogCrates-1276_1800x1800.jpg?v=1663264963",
      "https://i5.walmartimages.com/seo/Vibrant-Life-Small-Cuddler-Dog-Bed-Gray_664bc6a9-ea04-4248-bdca-49e86f99aa68.7e65d8b17d5cfaeb7494617d2f25c735.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF",
    ]);
    await Images.getImagesByProduct(1);
    // await Images.deleteImage(1);
    // await Images.deleteAllImagesForAProduct(1);
    console.log("Finished testing images functions!");

    console.log("Starting to test all shopping cart functions...");
    await ShoppingCart.createShoppingCart({ productId: 1, userId: null });
    await ShoppingCart.deleteShoppingCart(5);
    console.log("Finished testing all shopping cart functions!");

    console.log("Starting to test delete...");
    // await User.deleteUser(4);
    // await Products.deleteProduct(2);
    console.log("Finished testing delete!");

    console.log("Starting to create first 20 products");
    await createFirstTwenty();

    console.log("Starting to create fake data using faker...");
    await createFakeData();
    console.log("Finished creating fake data using faker!");

    console.log(
      "Finished testing database functions ******************************************************"
    );
  } catch (error) {
    console.error("Error creating categories");
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
