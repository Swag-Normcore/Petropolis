const client = require("../client");

async function createReview({ userId, productId, rating, comment, isAnonymous }) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
    INSERT INTO reviews("userId", "productId", rating, comment, "isAnonymous")
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `,
      [userId, productId, rating, comment, isAnonymous]
    );
    if (!review) {
      throw new Error("Issue creating review");
    }
    console.log("CREATE REVIEW RESULT: ", review);
    return review;
  } catch (error) {
    console.error(error);
  }
}

async function getReviewsByUser(userId) {
  try {
    const { rows: reviews } = await client.query(
      `
    SELECT reviews.*, products.title
    FROM reviews
    JOIN products ON reviews."productId"=products.id
    WHERE reviews."userId"=$1;
    `,
      [userId]
    );
    if (!reviews) {
      throw new Error("Issue getting reviews");
    }
    console.log("GET REVIEWS BY USER RESULT: ", reviews);
    return reviews;
  } catch (error) {
    console.error(error);
  }
}

//TODO do a join to show name for review display
async function getReviewsByProduct(productId) {
  try {
    const { rows: reviews } = await client.query(
      `
    SELECT reviews.*, users.name
    FROM reviews
    JOIN users ON reviews."userId"=users.id
    WHERE reviews."productId" = $1;
    `,
      [productId]
    );
    if (!reviews) {
      throw new Error("Issue getting reviews");
    }
    const filteredReviews = reviews.map((review) => {
      if (review.isAnonymous) {
        review.name = "Anonymous";
      }
      return review;
    })
    console.log("GET REVIEWS BY PRODUCT RESULT: ", filteredReviews);
    return filteredReviews;
  } catch (error) {
    console.error(error);
  }
}

async function deleteReview(id) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
    DELETE FROM reviews
    WHERE id=$1
    RETURNING *;
    `,
      [id]
    );
    if (!review) {
      throw new Error("Issue deleting review");
    }
    console.log("DELETE REVIEW RESULT: ", review);
    return review;
  } catch (error) {
    console.error(error);
  }
}

async function updateReview(id, fields = {}) {
  const placeholders = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (placeholders.length === 0) {
    return;
  }
  try {
    const {
      rows: [review],
    } = await client.query(
      `
    UPDATE reviews
    SET ${placeholders}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    if (!review) {
      throw new Error("Issue updating review");
    }
    console.log("UPDATE REVIEW RESULT: ", review);
    return review;
  } catch (error) {
    console.error(error);
  }
}

async function deleteReviewsByUser(userId) {
  try {
    const { rows: reviews } = await client.query(
      `
    DELETE FROM reviews
    WHERE "userId"=$1
    RETURNING *
    ;`,
      [userId]
    );
    if (!reviews) {
      throw new Error("Issue deleting reviews");
    }
    console.log("DELETE REVIEWS BY USER RESULT: ", reviews);
    return reviews;
  } catch (error) {
    console.error(error);
  }
}

async function getReviewById(id) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
    SELECT * FROM reviews
    WHERE id=$1;
    `,
      [id]
    );
    if (!review) {
      throw new Error("Issue getting review");
    }
    console.log("GET REVIEW BY ID RESULT: ", review);
    return review;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewsByUser,
  deleteReview,
  updateReview,
  deleteReviewsByUser,
  getReviewById,
};
