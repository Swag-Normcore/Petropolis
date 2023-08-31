import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { favoritesAtom } from "../atoms";
import { getAllFavorites } from "../axios-services";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  useEffect(async () => {
    const getFavorites = async () => {
      const result = await getAllFavorites();
      setFavorites(result);
    };
    getFavorites();
    console.log("favorites in useEffect", favorites);
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`/api/favorites/${id}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddToCart = async (id) => {
    try {
      const result = await axios.post(`/api/cart/${id}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="favorites-page">
      <div id="favorites-container">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="mb-3">
            <Card.Body>
              <Card.Title>{favorite.title}</Card.Title>
              <Card.Text>{favorite.description}</Card.Text>
              <Card.Text>{favorite.price}</Card.Text>
              <Card.Text>{favorite.image}</Card.Text>
              <Button
                variant="danger"
                onClick={() => handleDelete(favorite.id)}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAddToCart(favorite.id)}
              >
                Add to Cart
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
