const apiRouter = require("express").Router();
const { Images } = require("../db");
const { requireAdmin } = require("./utils");

apiRouter.get("/", async (req, res, next) => {
  try {
    const images = await Images.getAllImages();
    res.send(images);
    if (!images) {
      throw { error: "Unable to get images" };
    }
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { url } = req.body;
    const newImage = await Images.createImage({ url });
    res.send(newImage);
    if (!newImage) {
      throw { error: "Unable to create image" };
    }
  } catch (error) {
    next(error);
  }
});

apiRouter.delete("/:imageId", requireAdmin, async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const deletedImage = await Images.deleteImage(imageId);
    res.send(deletedImage);
    if (!deletedImage) {
      throw { error: "Unable to delete image" };
    }
  } catch (error) {
    next(error);
  }
});

module.exports = apiRouter;
