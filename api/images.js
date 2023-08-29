const apiRouter = require("express").Router();
const { Images } = require("../db");
const { requireUser, requireAdmin } = require("./utils");

apiRouter.get("/product/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const images = await Images.getImagesByProduct(productId);
    if (!images) {
      throw { error: "Unable to get images" };
    }
    res.send(images);
  } catch (error) {
    next(error);
  }
});

apiRouter.post(
  "/product/:productId",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { url } = req.body;
      const newImage = await Images.createImage({ productId, url });
      if (!newImage) {
        throw { error: "Unable to create image" };
      }
      res.send(newImage);
    } catch (error) {
      next(error);
    }
  }
);

apiRouter.delete(
  "/:imageId",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { imageId } = req.params;
      const deletedImage = await Images.deleteImage(imageId);
      if (!deletedImage) {
        throw { error: "Unable to delete image" };
      }
      res.send(deletedImage);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = apiRouter;
