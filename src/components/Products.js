import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { categoriesAtom, productsAtom, userAtom } from "../atoms";
import {
  getAllProducts,
  getAllCategories,
  addToFavorites,
} from "../axios-services";
import Form from "react-bootstrap/Form";
import emptyHeart from "../images/heart-empty.svg";
import fullHeart from "../images/heart-fill.svg";

const ProductsPage = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [products, setProducts] = useAtom(productsAtom);
  const [checkedId, setCheckedId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState([]);
  const [productId, setProductId] = useState(null);
  const [user, setUser] = useAtom(userAtom);

  useEffect(async () => {
    const getProducts = async () => {
      const result = await getAllProducts();
      setProducts(result);
    };
    const getCategories = async () => {
      const result = await getAllCategories();
      setCategories(result);
    };
    getProducts();
    getCategories();
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedId(id);
    const filtered = products.filter((product) => product.categoryId === id);
    setFilteredProducts(filtered);
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

  const handleFavorite = (e) => {
    const userId = user.id;
    setProductId(e.target.value);
    addToFavorites(userId, productId);
  };

  const handleCart = (e) => {
    setProductId(e.target.value);
  };

  const productsToDisplay = searchTerm.length
    ? searchFilter
    : filteredProducts
    ? filteredProducts
    : products;

  return (
    <div id="products-page">
      <div id="category-nav" bg="info">
        <Form id="category-form">
          {categories.map((category) => (
            <div key={category.id} className="mb-3">
              <Form.Check
                id={`${category.id}`}
                label={`${category.name}`}
                checked={category.id === checkedId}
                onChange={() => handleCheckboxChange(category.id)}
              />
            </div>
          ))}
        </Form>
      </div>
      <div id="search-container">
        <div className="search">
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchProducts();
            }}
          />
          <button id="search-button">SEARCH</button>
        </div>
        <div id="products-container">
          {productsToDisplay.map((product) => (
            <div className="card" key={product.id}>
              <a href={`/api/products/${product.id}`}>
                <img
                  className="card-img-top"
                  src={product.image}
                  alt={product.title}
                />
              </a>
              <div className="card-body">
                <div className="title-block">
                  <h5 className="card-title">{product.title}</h5>
                  <button
                    className="favorite-button"
                    value={product.id}
                    onClick={handleFavorite}
                  >
                    <img
                      src={emptyHeart}
                      width="20"
                      height="20"
                      className="d-inline-block align-top"
                    />
                  </button>
                </div>
                <button
                  className="cart-button"
                  value={product.id}
                  onClick={handleCart}
                >
                  Add to Cart
                </button>
              </div>
              <div className="card-footer">
                <p>${product.price / 100}</p>{" "}
                {product.stock > 20 ? (
                  <p>In stock</p>
                ) : product.stock > 0 ? (
                  <p>Low Stock</p>
                ) : (
                  <p>Out of stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
