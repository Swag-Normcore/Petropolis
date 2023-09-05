const express = require("express");
const apiRouter = express.Router();
const { Category } = require("../db");
const { requireUser, requireAdmin } = require("./utils");

// GET /api/categories
// Returns a list of all categories
apiRouter.get("/", async (req, res, next) => {
  try {
    const categories = await Category.getAllCategories();
    if (!categories) {
      throw { error: "Couldn't get categories!" };
    } else {
      res.send(categories);
    }
  } catch ({ error }) {
    next({ error });
  }
});

//patch /api/categories/:categoryId
//must be admin
apiRouter.patch(
  "/:categoryId",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
      const updatedCategory = await Category.updateCategory(
        categoryId,
        req.body
      );
      if (!updatedCategory) {
        throw { error: "Couldn't update category!" };
      } else {
        res.send(updatedCategory);
      }
    } catch ({ error }) {
      next({ error });
    }
  }
);

//post /api/categories
//must be admin
apiRouter.post("/", requireUser, requireAdmin, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newCategory = await Category.createCategory({
      name,
      description,
    });
    if (!newCategory) {
      throw { error: "Couldn't create category!" };
    } else {
      res.send(newCategory);
    }
  } catch ({ error }) {
    next({ error });
  }
});

//delete /api/categories/:categoryId
//must be admin
apiRouter.delete(
  "/:categoryId",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
      const deletedCategory = await Category.deleteCategory(categoryId);
      if (!deletedCategory) {
        throw { error: "Couldn't delete category!" };
      } else {
        res.send(deletedCategory);
      }
    } catch ({ error }) {
      next({ error });
    }
  }
);

module.exports = apiRouter;
