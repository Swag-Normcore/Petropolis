const client = require("../client");

// This is probably the function I'm least sure of and will likely just need testing
// I think it would be nice to be able to take multiple imageUrls at once, in this case an array
// and add them all into the images reference table, but iterating over the array
// and creating different rows for each URL is a little confusing so lets test!
async function addImages(productId, imageUrls = []) {
  try {
    const values = imageUrls.map((url) => [productId, url]);

    const query = `
      INSERT INTO images("productId", "imageUrl")
      VALUES ($1, $2)
    ;`;

    const insertPromises = values.map((params) => client.query(query, params));
    await Promise.all(insertPromises);

    console.log("Mapping over images", insertPromises);
  } catch (error) {
    console.error(error);
  }
}

//wondering if this should be in products
async function getImagesByProduct(productId) {
  try {
    // const {
    //   rows: [product],
    // } = await client.query(
    //   `
    // SELECT * FROM products
    // WHERE id=$1;`,
    //   [productId]
    // );
    const { rows: images } = await client.query(
      `
      SELECT * FROM images
      WHERE "productId"=$1
    ;`,
      [productId]
    );
    if (images.length === 0) {
      throw new Error("Couldn't retrieve images.");
    } else {
      // product.images = images;
      console.log("GET IMAGES BY PRODUCT", images);
      return images;
    }
  } catch (error) {
    console.error(error);
  }
}

async function deleteImage(imageId) {
  try {
    const {
      rows: [image],
    } = await client.query(
      `
      DELETE FROM images
      WHERE id=$1
      RETURNING *
    ;`,
      [imageId]
    );
    if (!image) {
      throw new Error("Couldn't delete images.");
    } else {
      console.log("DELETE IMAGE", image);
      return image;
    }
  } catch (error) {
    console.error(error);
  }
}

//we didn't have this one in the TODO but I figured it wouldn't hurt
// & would probably be necessary for deleting a product
async function deleteAllImagesForAProduct(productId) {
  try {
    const { rows: images } = await client.query(
      `
      DELETE FROM images
      WHERE "productId"=$1
      RETURNING *
    ;`,
      [productId]
    );
    if (images.length === 0) {
      throw new Error("Couldn't delete images.");
    } else {
      console.log("DELETE IMAGE", images);
      return images;
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addImages,
  getImagesByProduct,
  deleteImage,
  deleteAllImagesForAProduct,
};
