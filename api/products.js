const productsRouter = require("express").Router();
const { Products } = require("../db");
const { requireAdmin } = require("./utils");

productsRouter.use("/", (req, res, next) => {
  console.log("a request sent is being made to /products");
  next();
});

productsRouter.get("/", async (req, res, next) => {
  console.log("Get / request sent.");
  try {
    const allProducts = await Products.getAllProducts();
    if (!allProducts) {
      res.send({ error: "Could not get all products" });
    } else {
      const allActiveProducts = allProducts.filter(
        (product) => product.isActive === true
      );
      res.send(allActiveProducts);
    }
  } catch (error) {
    next({ error });
  }
});

// I forget if this should be req.params.productId or just req.params
// I think in some past projects it has just been req.params so it'll be worth
// console.logging the params object to see what info it's giving when testing
productsRouter.get("/:productId", async (req, res, next) => {
  console.log("Get /:productId request sent.");
  console.log(req.params);
  const productId = req.params.productId;
  try {
    const productById = await Products.getProductById(productId);
    if (!productById) {
      res.send({ error: "Could not get a product by that id." });
    } else {
      res.send(productById);
    }
  } catch ({ error }) {
    next({ error });
  }
});

productsRouter.get("/:categoryId", async (req, res, next) => {
  console.log("Get /:categoryId request sent.");
  console.log(req.params);
  const categoryId = req.params.categoryId;
  try {
    const productsByCategoryId = await Products.getProductByCateogryId(
      categoryId
    );
    if (!productsByCategoryId) {
      res.send({ error: "Could not get products for that category id." });
    } else {
      res.send(productsByCategoryId);
    }
  } catch ({ error }) {
    next({ error });
  }
});

productsRouter.post("/", requireAdmin, async (req, res, next) => {
  console.log("Post / request sent.");
  const { title, description, price, stock, imageUrl, categoryId } = req.body;
  console.log(req.body);
  try {
    const newProduct = await Products.createProduct({
      title,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
    });
    res.send(newProduct);
  } catch (error) {
    next({ error });
  }
});

productsRouter.patch("/:productId", requireAdmin, async (req, res, next) => {
  console.log("Patch /:productId request sent.");
  const productId = req.params.productId;
  const fields = req.body;
  try {
    const updatedProduct = await Products.updateProduct(productId, fields);
    res.send(updatedProduct);
  } catch (error) {
    next({ error });
  }
});

// I made this inactive since idk if there will be reason to ever truly
// delete a product, but could change this depending on what we need.
productsRouter.delete("/:productId", requireAdmin, async (req, res, next) => {
  console.log("Delete /:productId request sent.");
  const productId = req.params.productId;
  try {
    const inactiveProduct = await Products.makeProductInactive(productId);
    res.send(inactiveProduct);
  } catch (error) {
    next({ error });
  }
});
