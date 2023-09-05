import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  categoriesAtom,
  productsAtom,
  favoritesAtom,
  tokenAtom,
  shoppingCartAtom,
  favoritesIdsAtom,
  categoriesCanvasAtom,
  userAtom,
} from "../atoms";
import {
  addToFavorites,
  addProductToShoppingCart,
  getAllFavorites,
} from "../axios-services";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import emptyHeart from "../images/heart-empty.svg";
import fullHeart from "../images/heart-fill.svg";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import Offcanvas from "react-bootstrap/Offcanvas";

const ProductsPage = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [products, setProducts] = useAtom(productsAtom);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [checkedId, setCheckedId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState([]);
  const [favoritesIds, setFavoritesIds] = useAtom(favoritesIdsAtom);
  const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [categoriesCanvas, setCategoriesCanvas] = useAtom(categoriesCanvasAtom);

  // useEffect(() => {
  //   if (favorites) {
  //     const favoritesIdArray = favorites.map((favorite) => favorite.productId);
  //     setFavoritesIds(favoritesIdArray);
  //   }
  // }, []);

  const handleCheckboxChange = (id) => {
    if (id === "all") {
      setCheckedId(null);
      setFilteredProducts(products);
    } else {
      setCheckedId(id);
      const filtered = products.filter((product) => product.categoryId === id);
      setFilteredProducts(filtered);
    }
  };

  const searchProducts = () => {
    const filtered = products.filter((product) => {
      const lowerCaseQuery = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setSearchFilter(filtered);
  };

  const handleFavorite = async (productId) => {
    const userId = user.id;
    const result = await addToFavorites({ productId, token });
    console.log(result);
    const newFavorites = await getAllFavorites({ userId, token });
    setFavorites(newFavorites);
    const newFavoritesIds = newFavorites.map((favorite) => favorite.productId);
    setFavoritesIds(newFavoritesIds);
  };

  const handleCart = async (productId) => {
    console.log(shoppingCart.id, productId, token);
    const result = await addProductToShoppingCart({
      shoppingId: shoppingCart.id,
      productId,
      quantity: 1,
      token,
    });
    setShoppingCart(result);
  };

  const productsToDisplay = searchTerm.length
    ? searchFilter
    : filteredProducts
    ? filteredProducts
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsToDisplay.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginationItems = [];
  for (
    let number = 1;
    number <= productsToDisplay.length / productsPerPage + 1;
    number++
  ) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={(e) => {
          console.log(number);
          setCurrentPage(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleClose = () => setCategoriesCanvas(false);
  const handleShow = () => setCategoriesCanvas(true);

  return (
    <div id="products-page">
      <Offcanvas show={categoriesCanvas} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h3>Categories:</h3>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form id="category-form">
            <Form.Check
              className="mb-3"
              id="all"
              label="All Categories"
              checked={checkedId === null}
              onChange={() => handleCheckboxChange("all")}
            />
            {categories
              ? categories.map((category) => (
                  <div key={category.id} className="mb-3">
                    <Form.Check
                      id={`${category.id}`}
                      label={`${category.name}`}
                      checked={category.id === checkedId}
                      onChange={() => handleCheckboxChange(category.id)}
                    />
                  </div>
                ))
              : null}
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <div id="search-container">
        <div className="search">
          <Button className="site-button me-2" onClick={handleShow}>
            Categories
          </Button>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchProducts();
            }}
          />
          <Button id="search-button" className="ms-2">
            SEARCH
          </Button>
        </div>
        <div id="products-container">
          {currentProducts
            ? currentProducts.map((product) => {
                return product.isActive ? (
                  <Card
                    className="card"
                    style={{ width: "18rem", height: "19rem" }}
                    key={product.id}
                  >
                    <Link to={`/products/${product.id}`}>
                      <Card.Img
                        className="card-img-top"
                        src={product.image}
                        alt={product.title}
                        // onClick={(e) => {
                        //   console.log("running onclick")
                        //   setSingleProductId(product.id);
                        //   console.log(product);
                        //   localStorage.setItem("singleProductId", product.id);
                        //   setSingleProduct(product);
                        // }}
                      />
                    </Link>
                    <Card.Body>
                      <div className="title-block">
                        <Card.Title>{product.title}</Card.Title>
                        {token ? (
                          <Button
                            className="favorite-button"
                            value={product.id}
                          >
                            {favoritesIds.includes(product.id) ? (
                              <img
                                src={fullHeart}
                                value={product.id}
                                width="20"
                                height="20"
                                className="d-inline-block align-top"
                              />
                            ) : (
                              <img
                                src={emptyHeart}
                                value={product.id}
                                width="20"
                                height="20"
                                className="d-inline-block align-top"
                                onClick={() => handleFavorite(product.id)}
                              />
                            )}
                          </Button>
                        ) : null}
                      </div>
                      <Button
                        className="cart-button"
                        value={product.id}
                        onClick={(e) => {
                          handleCart(product.id);
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Card.Footer>
                        <p>${product.price / 100}</p>{" "}
                        {product.stock > 20 ? (
                          <p>In stock</p>
                        ) : product.stock > 0 ? (
                          <p>Low Stock</p>
                        ) : (
                          <p>Out of stock</p>
                        )}
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                ) : null;
              })
            : null}
        </div>
        <Pagination className="ms-5 justify-content-center">
          {paginationItems.map((item) => {
            return item;
          })}
        </Pagination>
      </div>
    </div>
  );
};

export default ProductsPage;
