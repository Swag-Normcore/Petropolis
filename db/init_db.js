const {
  client,
  Category,
  // declare your model imports here
  // for example, User
  User,
  Reviews,
  Orders,
  Products,
  Order_Products,
} = require("./");
const { createNewProduct } = require("./models/products");

async function buildTables() {
  try {
    client.connect();
    console.log("Starting to drop tables...");

    // drop tables in correct order

    await client.query(`

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
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      image VARCHAR(255),
      "categoryId" INTEGER REFERENCES categories(id),
      "isActive" BOOLEAN DEFAULT true
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
      "userId" INTEGER REFERENCES users(id) NOT NULL UNIQUE
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
    console.log("Creating Categories...");

    const categoryOne = await Category.createCategory({
      name: "Beds",
      description: "Beds for your furry friend",
    });

    const categoryTwo = await Category.createCategory({
      name: "Clothes",
      description: "Find all your fury friends needs",
    });

    const categoryThree = await Category.createCategory({
      name: "Food",
      description: "S-XL bags of food for cats and dogs",
    });

    console.log("Finshed creating categories.");
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })

    console.log("Starting to create users...");

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

    // Need to create categories first probably
    console.log("Starting to create products");

    const fakeProduct1 = await Products.createProduct({
      title: "Large Brown Dog Bed",
      description: "Soft polyester lining and walls will make your pet happy!",
      price: 2099,
      stock: 20,
      imageUrl: "https://m.media-amazon.com/images/I/61gxx3o19RL._AC_SL1500_.jpg",
      categoryId: 1
    })

    const fakeProduct2 = await Products.createProduct({
      title: "Bone chew toy",
      description: "Splinter free for pet safety!",
      price: 999,
      stock: 950,
      imageUrl: "https://franklypet.com/wp-content/uploads/DDP180194_V2_ChickenBoneLarge-scaled.jpg",
      categoryId: 2
    })

    const fakeProduct3 = await Products.createProduct({
      title: "Stuffed cat treats",
      description: "Delicious salmon filled treats with no filler products!",
      price: 999,
      stock: 250,
      imageUrl: "https://i0.wp.com/catladyfitness.com/wp-content/uploads/2018/11/final-treats-puppy.jpg?w=665",
      categoryId: 3
    })

    console.log("Finished creating products!")

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

    console.log("Starting to add products to order...")
    await Order_Products.addProductToOrder({
      orderId: 1,
      productId: 1,
      quantity: 1,
    })
    await Order_Products.addProductToOrder({
      orderId: 2,
      productId: 2,
      quantity: 2,
    })
    await Order_Products.addProductToOrder({
      orderId: 3,
      productId: 3,
      quantity: 3,
    })
    await Order_Products.addProductToOrder({
      orderId: 4,
      productId: 1,
      quantity: 4,
    })
    await Order_Products.addProductToOrder({
      orderId: 1,
      productId: 2,
      quantity: 2,
    })
    await Order_Products.addProductToOrder({
      orderId: 1,
      productId: 3,
      quantity: 3,
    })
    console.log("Finished adding products to order!")

    console.log("Starting to get orders...");
    await Orders.getOrderById(order1.id);
    await Orders.getOrderById(order2.id);
    await Orders.getOrderById(order3.id);
    await Orders.getOrderById(order4.id);
    console.log("Finished getting orders!");

    console.log("Starting to get orders by user...");
    await Orders.getAllOrdersByUser(fakeUser1.id);
    await Orders.getAllOrdersByUser(fakeUser2.id);
    await Orders.getAllOrdersByUser(fakeUser3.id);
    await Orders.getAllOrdersByUser(fakeUser4.id);
    console.log("Finished getting orders by user!");
  } catch (error) {
    console.error("Error creating categories");
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
