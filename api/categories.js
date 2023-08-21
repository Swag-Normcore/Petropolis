const express = require("express");
const categoriesRouter = express.Router();
const { getAllCategories } = require("../db");
const { requireAdmin } = require("./utils");

// GET /api/categories
categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.send({
      categories,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//patch /api/categories/:categoryId
//must be admin
categoriesRouter.patch("/:categoryId", requireAdmin, async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await updateCategory({ id: categoryId, name });
    res.send(updatedCategory);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//post /api/categories
//must be admin
categoriesRouter.post("/", requireAdmin, async (req, res, next) => {
  const { name } = req.body;
  try {
    const newCategory = await createCategory({ name });
    res.send(newCategory);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//delete /api/categories/:categoryId
//must be admin
categoriesRouter.delete(
  "/:categoryId",
  requireAdmin,
  async (req, res, next) => {
    const { categoryId } = req.params;
    try {
      const deletedCategory = await deleteCategory(categoryId);
      res.send(deletedCategory);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = categoriesRouter;
