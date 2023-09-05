import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAtom } from "jotai";
import {
  singleProductIdAtom,
  singleProductAtom,
  productImagesAtom,
  tokenAtom,
  userAtom,
  shoppingCartAtom,
  favoritesAtom,
  favoritesIdsAtom,
  productsAtom,
  categoriesAtom,
} from "../atoms";
import {
  getSingleProduct,
  getProductImages,
  addProductToShoppingCart,
  addToFavorites,
  removeFavorite,
  deleteProduct,
  updateProduct,
} from "../axios-services";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import "../style/SingleProduct.css";

const SingleProductView = () => {
  const [singleProductId, setSingleProductId] = useAtom(singleProductIdAtom);
  const [singleProduct, setSingleProduct] = useAtom(singleProductAtom);
  const [productImages, setProductImages] = useAtom(productImagesAtom);
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [favoritesIds, setFavoritesIds] = useAtom(favoritesIdsAtom);
  const [favoriteId, setFavoriteId] = useState(null);
  const [products, setProducts] = useAtom(productsAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [price, setPrice] = useState(null);
  const [stock, setStock] = useState(null);
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  let { productId } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      const productData = await getSingleProduct({ productId });
      const imagesData = await getProductImages({ productId });
      setSingleProduct(productData);
      setSingleProductId(productId);
      setProductImages(imagesData);
      setTitle(productData.title);
      setDescription(productData.description);
      setAnimalType(productData.animalType);
      setPrice(productData.price);
      setStock(productData.stock);
      setImage(productData.image);
      setCategoryId(productData.categoryId);
    }
    fetchProduct();
  }, []);

  useEffect(() => {
    if (favoritesIds.includes(Number(productId))) {
      favorites.forEach((favorite) => {
        if (favorite.productId === Number(productId)) {
          setFavoriteId(favorite.id);
        }
      });
    }
  }, [favoritesIds]);

  async function handleCart() {
    const result = await addProductToShoppingCart({
      shoppingId: shoppingCart.id,
      productId,
      quantity: 1,
      token,
    });
    setShoppingCart(result);
  }

  const handleAddFavorite = async () => {
    const result = await addToFavorites({ productId, token });
    setFavorites(result);
  };

  const handleRemoveFavorite = async () => {
    console.log(favoriteId, token);
    const result = await removeFavorite({ favoriteId, token });
  };

  const handleDeleteProduct = async () => {
    const result = await deleteProduct({ productId: Number(productId), token });
    if (result) {
      const newProducts = products.filter((product) => {
        return product.id !== result.id;
      });
      setProducts(newProducts);
    }
  };

  const handleUpdateProduct = async () => {
    const result = await updateProduct({
      productId,
      token,
      title,
      description,
      animalType,
      price,
      stock,
      image,
      categoryId,
    });
    if (result) {
      console.log("SUCCESS!!!");
    }
  };

  return (
    <div
      id="single-product-page"
      // className="d-flex flex-column align-items-center"
    >
      {singleProduct ? (
        <>
          <div id="carousel-container">
            <Carousel
              data-bs-theme="dark"
              interval={null}
              slide={false}
              style={{ Height: "500px", Width: "500px" }}
              className="container"
            >
              <Carousel.Item>
                <img
                  src={singleProduct.image}
                  className="object-fit-contain border rounded carousel-img"
                  height="800px"
                  width="800px"
                />
              </Carousel.Item>
              {productImages
                ? productImages.length
                  ? productImages.map((image, index) => {
                      return (
                        <Carousel.Item key={image.id}>
                          <img
                            src={image.imageUrl}
                            className="object-fit-contain border rounded carousel-img"
                            height="800px"
                            width="800px"
                          />
                        </Carousel.Item>
                      );
                    })
                  : null
                : null}
            </Carousel>
          </div>
          <div id="single-product-info">
            <Stack gap={3} className="align-items-center">
              <h1>{singleProduct.title}</h1>
              <Stack direction="horizontal" gap={3}>
                <h2 className="p-2">${singleProduct.price / 100}</h2>
                <h2 className="p-2 ms-auto">
                  {singleProduct.stock > 20
                    ? "In stock"
                    : singleProduct.stock > 0
                    ? "Low Stock"
                    : "Out of stock"}
                </h2>
              </Stack>
              <p className="p-2 h3">{singleProduct.description}</p>
              <Stack
                direction="horizontal"
                gap={3}
                className="justify-content-evenly"
              >
                <Button
                  className="site-button"
                  value={singleProduct.id}
                  onClick={(e) => {
                    handleCart();
                  }}
                >
                  Add to cart
                </Button>
                {token ? (
                  <>
                    {favoritesIds.includes(Number(productId)) ? (
                      <>
                        <Button
                          className="site-button"
                          onClick={() => {
                            handleRemoveFavorite();
                          }}
                        >
                          Remove from favorites
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="site-button"
                        onClick={() => {
                          handleAddFavorite();
                        }}
                      >
                        Add to favorites
                      </Button>
                    )}
                    {user.isAdmin ? (
                      <>
                        <Button
                          variant="warning"
                          onClick={() => {
                            setIsUpdating(!isUpdating);
                          }}
                        >
                          Edit product
                        </Button>
                        <Link to="/">
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleDeleteProduct();
                            }}
                          >
                            {" "}
                            Delete Product
                          </Button>
                        </Link>
                      </>
                    ) : null}
                  </>
                ) : null}
              </Stack>
              {isUpdating ? (
                <Stack>
                  <Form
                    className="m-4 p-3 border border-3 border-primary rounded text-bg-light"
                    onSubmit={(e) => {
                      handleUpdateProduct();
                    }}
                  >
                    <Form.Group className="m-2">
                      <Form.Label htmlFor="title">Title:</Form.Label>
                      <Form.Control
                        id="title"
                        type="text"
                        placeholder="enter title"
                        required
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="m-2">
                      <Form.Label htmlFor="description">
                        Description:
                      </Form.Label>
                      <Form.Control
                        id="description"
                        type="text"
                        placeholder="enter description"
                        required
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="m-2">
                      <Form.Label htmlFor="animalType">Animal Type:</Form.Label>
                      <Form.Control
                        id="animalType"
                        type="text"
                        placeholder="enter animal type"
                        defaultValue={animalType ? animalType : ""}
                        onChange={(e) => {
                          setAnimalType(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="m-2">
                      <Form.Label htmlFor="price">Price:</Form.Label>
                      <Form.Control
                        id="price"
                        type="number"
                        placeholder="enter price"
                        required
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="m-2">
                      <Form.Label htmlFor="stock">Stock:</Form.Label>
                      <Form.Control
                        id="stock"
                        type="number"
                        placeholder="enter stock"
                        required
                        value={stock}
                        onChange={(e) => {
                          setStock(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="m-2">
                      <Form.Label htmlFor="image">Image URL:</Form.Label>
                      <Form.Control
                        id="image"
                        type="text"
                        placeholder="enter image"
                        value={image}
                        onChange={(e) => {
                          setImage(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="m-2">
                      <Form.Label htmlFor="category">Category:</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          setCategoryId(e.target.value);
                        }}
                      >
                        <option value={""}>Select a category</option>
                        {categories.map((category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                    <Button type="submit" className="site-button">
                      Submit
                    </Button>
                  </Form>
                </Stack>
              ) : null}
            </Stack>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SingleProductView;
