import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  favoritesAtom,
  tokenAtom,
  shoppingCartAtom,
  // singleProductIdAtom
} from "../atoms";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import trashCan from "../images/trash-fill.svg";
import { removeFavorite, addProductToShoppingCart } from "../axios-services";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);
  // const [singleProductId, setSingleProductId] = useAtom(singleProductIdAtom);

  const handleDelete = async (id) => {
    const favoriteId = id;
    try {
      const result = await removeFavorite({ favoriteId, token });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (id) => {
    const result = await addProductToShoppingCart({
      shoppingId: shoppingCart.id,
      productId: id,
      quantity: 1,
      token
    });
    setShoppingCart(result);
  };

  return (
    <div id="favorites-page">
      <div id="favorites-container">
        {favorites.length ? (
          favorites.map((favorite) => (
            <Card
              key={favorite.id}
              className="mb-3 text-center"
              style={{ width: "18rem" }}
            >
              <Link to={`/products/${favorite.productId}`}>
                <Card.Img variant="top" src={favorite.image}
                // onClick={(e) => {
                //   console.log("running onclick")
                //   localStorage.setItem("singleProductId", favorite.productId);
                //   setSingleProductId(favorite.productId);
                // }}
                />
              </Link>
              <Card.Body>
                <Card.Title className="favorite-title mb-0 mt-2">
                  {favorite.title}
                </Card.Title>
                <Card.Text></Card.Text>
                <div className="favorite-footer">
                  <Button
                    className="m-1 ms-3"
                    variant="danger"
                    onClick={() => handleDelete(favorite.id)}
                  >
                    <img src={trashCan} />
                  </Button>
                  <Button
                    className="m-1 site-button"
                    onClick={() => handleAddToCart(favorite.productId)}
                  >
                    Add to Cart
                  </Button>
                  <Card.Text className="mt-2 ms-2">
                    ${favorite.price / 100}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No Favorites! Go Heart Something!</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
