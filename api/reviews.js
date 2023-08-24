const express = require("express");
const apiRouter = express.Router();
const { User, Reviews, Products } = require("../db");
const { requireUser, requireCurrentUserOrAdmin } = require("./utils");

// /products/:productId (get)
apiRouter.get("/products/:productId", async (req, res, next) => {
  const { productId } = req.params.productId;
  try {
    const product = await Reviews.getReviewsByProduct(productId);
    if (!product) {
      throw { error: "Product not found!" };
    } else {
      res.send(product);
    }
  } catch ({ error }) {
    next({ error });
  }
});

// /products/:productId (post)
//must be logged in
apiRouter.post("/products/:productId", requireUser, async (req, res, next) => {
  const { productId } = req.params.productId;
  const { title, content, rating } = req.body;
  const { id } = req.user;
  try {
    const newReview = await Reviews.createReview({
      productId,
      title,
      content,
      rating,
      userId: id,
    });
    res.send(newReview);
    if (!newReview) {
      next({
        name: "ReviewNotFoundError",
        message: "Could not find a review with that reviewId",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// /users/:userId (get)
//must be logged in and be the current user or admin
apiRouter.get(
  "/users/:userId",
  requireUser,
  requireCurrentUserOrAdmin,
  async (req, res, next) => {
    const { userId } = req.params.userId;
    try {
      const user = await User.getUserById(userId);
      if (!user) {
        throw { error: "User not found!" };
      } else {
        res.send(user);
      }
    } catch ({ error }) {
      next({ error });
    }
  }
);

// /:reviewId (patch)
//must be logged in and be the current user or admin
apiRouter.patch("/:reviewId", requireUser, async (req, res, next) => {
  const { reviewId } = req.params.reviewId;
  const { title, content, rating } = req.body;
  const { review } = await Reviews.getReviewById(reviewId);
  if (review.userId !== req.user.id) {
    next({
      error: "You must be the current logged in user or an admin.",
    });
  }

  try {
    const updatedReview = await Reviews.updateReview({
      id: reviewId,
      title,
      content,
      rating,
    });
    res.send(updatedReview);
    if (!updatedReview) {
      next({
        name: "ReviewNotFoundError",
        message: "Could not find a review with that reviewId",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// /:reviewId (delete)
//must be logged in and be the current user or admin
apiRouter.delete("/:reviewId", requireUser, async (req, res, next) => {
  const { reviewId } = req.params.reviewId;
  const { review } = await Reviews.getReviewById(reviewId);
  if (review.userId !== req.user.id) {
    next({
      error: "You must be the current logged in user or an admin.",
    });
  }

  try {
    const deletedReview = await Reviews.deleteReview(reviewId);
    res.send(deletedReview);
    if (!deletedReview) {
      next({
        name: "ReviewNotFoundError",
        message: "Could not find a review with that reviewId",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = apiRouter;
