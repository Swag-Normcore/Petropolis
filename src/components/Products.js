import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  categoriesAtom,
  productsAtom,
  userAtom,
  favoritesAtom,
  tokenAtom,
  shoppingCartAtom,
} from "../atoms";
import { addToFavorites, addProductToShoppingCart } from "../axios-services";
import Form from "react-bootstrap/Form";
import emptyHeart from "../images/heart-empty.svg";
import fullHeart from "../images/heart-fill.svg";

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
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);

  useEffect(() => {
    if (favorites) {
      const favoritesIdArray = favorites.map((favorite) => favorite.productId);
      setFavoritesIds(favoritesIdArray);
    }
  }, []);

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

  const handleFavorite = (productId) => {
    console.log("Handle favorites productId", productId);
    addToFavorites({ productId, token });
  };

  const handleCart = async (e) => {
    const result = await addProductToShoppingCart({
      shoppingId: shoppingCart.id,
      productId: e.target.value,
      quantity: 1,
    });
    setShoppingCart(result);
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
          {productsToDisplay
            ? productsToDisplay.map((product) => (
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
                      {token ? (
                        <button className="favorite-button" value={product.id}>
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
                        </button>
                      ) : null}
                    </div>
                    <button
                      className="cart-button"
                      value={product.id}
                      onClick={handleCart}
                    >
                      Add to Cart
                    </button>
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
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
