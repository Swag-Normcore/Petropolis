const { Products } = require("./index.js");
const products = [
  {
    title: "Cozy Cat Bed",
    description: "Soft and warm for your furry friend",
    price: 1999,
    stock: 50,
    imageUrl: "https://m.media-amazon.com/images/I/61+JIqhpz+L.jpg",
    categoryId: 1,
  },
  {
    title: "Dog Chew Toy",
    description: "Durable toy for hours of play",
    price: 999,
    stock: 75,
    imageUrl:
      "https://i5.walmartimages.com/asr/4c38a5ce-6dad-4202-acb7-fce6135322bd.dc7c3ca268bdd73a6a6a23ea4be2c570.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    categoryId: 4,
  },
  {
    title: "Fish Flakes",
    description: "Delicious treats for your aquatic pets",
    price: 599,
    stock: 100,
    imageUrl: "https://m.media-amazon.com/images/I/81FmFO1ZsmL.jpg",
    categoryId: 3,
  },
  {
    title: "Bird Cage",
    description: "Spacious and comfortable home for your birds",
    price: 4999,
    stock: 20,
    imageUrl:
      "https://www.birdcagesnow.com/cdn/shop/products/9004836-Platinum.png?v=1524674583",
    categoryId: 5,
  },
  {
    title: "Squeaky Mouse Toy",
    description: "Interactive fun for your cat",
    price: 399,
    stock: 60,
    imageUrl:
      "https://cdn11.bigcommerce.com/s-asivtkjxr8/images/stencil/original/products/2115/7014/bly00acn3mrwvaiceph8__78953.1630111762.jpg?c=1",
    categoryId: 4,
  },
  {
    title: "Dog Leash",
    description: "Durable leash for daily walks",
    price: 1299,
    stock: 40,
    imageUrl: "https://m.media-amazon.com/images/I/81S1t0ZtzVL.jpg",
    categoryId: 2,
  },
  {
    title: "Rabbit Hutch",
    description: "Cozy shelter for your bunnies",
    price: 3999,
    stock: 15,
    imageUrl: "https://m.media-amazon.com/images/I/61gdJnB67cL._AC_SL1024_.jpg",
    categoryId: 5,
  },
  {
    title: "Hamster Wheel",
    description: "Exercise wheel for small rodents",
    price: 699,
    stock: 50,
    imageUrl: "https://m.media-amazon.com/images/I/61KFElqVLdL.jpg",
    categoryId: 4,
  },
  {
    title: "Catnip Toy",
    description: "Enticing toy to amuse your cat",
    price: 499,
    stock: 70,
    imageUrl: "https://m.media-amazon.com/images/I/71AP92R4syL._AC_SL1500_.jpg",
    categoryId: 4,
  },
  {
    title: "Fish Tank",
    description: "A beautiful home for your fish",
    price: 2999,
    stock: 10,
    imageUrl:
      "https://i5.walmartimages.com/seo/Aqua-Culture-55-Gallon-Glass-Fish-Tank-LED-Aquarium-Kit-Online-Only-Price_c7e50929-8c81-4b80-86e6-4e93bf3f445c_1.86856ac2d8dd8c4a44aa29cecea98cfa.jpeg",
    categoryId: 5,
  },
  {
    title: "Dog Treats",
    description: "Healthy snacks for your pup",
    price: 899,
    stock: 80,
    imageUrl: "https://cdn.jwplayer.com/v2/media/V1EkT2d1/poster.jpg?width=720",
    categoryId: 3,
  },
  {
    title: "Dog Bed",
    description: "Orthopedic comfort for your canine",
    price: 3499,
    stock: 30,
    imageUrl:
      "https://saatva.imgix.net/products/dog-bed/front-model/medium/dog-bed-front-model-medium-16-9.jpg?w=1200&fit=crop&auto=format",
    categoryId: 1,
  },
  {
    title: "Guinea Pig Cage",
    description: "Spacious cage for guinea pigs",
    price: 2799,
    stock: 20,
    imageUrl:
      "https://i5.walmartimages.com/asr/0cb7dbcd-7b87-40f7-b6bb-2a87db63ad09.828353601ee11c7197f1b3acaa76c6cb.jpeg",
    categoryId: 5,
  },
  {
    title: "Pet Carrier",
    description: "Sturdy and comfortable for travel",
    price: 2399,
    stock: 35,
    imageUrl:
      "https://m.media-amazon.com/images/I/718pOOCNXtL._AC_UF1000,1000_QL80_.jpg",
    categoryId: 5,
  },
  {
    title: "Dog Collar",
    description: "Stylish and adjustable for your pup",
    price: 999,
    stock: 50,
    imageUrl:
      "https://www.thefoggydog.com/cdn/shop/products/BeMyBoo_Collar_Front_1_grande.jpg?v=1665101410",
    categoryId: 2,
  },
  {
    title: "Dog Frisbee",
    description: "Interactive fun for active dogs",
    price: 699,
    stock: 40,
    imageUrl:
      "https://doglab.com/wp-content/uploads/Border-collie-leaping-and-catching-red-platic-frisbee-in-mouth.jpg",
    categoryId: 4,
  },
  {
    title: "Rabbit Food",
    description: "Nutritious pellets for your rabbits",
    price: 799,
    stock: 35,
    imageUrl:
      "https://andy.pet/cdn/shop/articles/rabbits-eating-pellets_600x600_crop_center.jpg?v=1664220955",
    categoryId: 3,
  },
  {
    title: "Dog Training Treats",
    description: "Reward treats for training sessions",
    price: 399,
    stock: 70,
    imageUrl:
      "https://www.cesarsway.com/wp-content/uploads/2016/01/Tricks-for-treats-Training-your-dog-with-food.jpg",
    categoryId: 3,
  },
  {
    title: "Dog Tug Toy",
    description: "Strong toy for tug-of-war games",
    price: 899,
    stock: 40,
    imageUrl:
      "https://outwardhound.com/furtropolis/wp-content/uploads/2021/06/OH_ToysDogsCrave_Ropiez-4-Knot-Tug_BlueRed.jpg",
    categoryId: 4,
  },
];

async function createFirstTwenty() {
  try {
    const createdProducts = await Promise.all(
      products.map((product) => Products.createProduct(product))
    );
    console.log("Finished creating first 20 products");
  } catch (error) {
    console.error(error);
  }
}

module.exports = createFirstTwenty;
