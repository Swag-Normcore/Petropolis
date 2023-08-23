const express = require("express");
const apiRouter = express.Router();
const { getAllCategories } = require("../db");
const { requireUser, requireAdmin } = require("./utils");

// GET /api/categories
// Returns a list of all categories
apiRouter.get("/", async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.send(categories);
    if (!categories) {
      throw { error: "Couldn't get categories!" };
    }
  } catch ({ error }) {
    next(error);
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
    const fields = req.body;
    try {
      const updatedCategory = await updateCategory(categoryId, fields);
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
    const newCategory = await createCategory({ name, description });
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
      const deletedCategory = await deleteCategory(categoryId);
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
