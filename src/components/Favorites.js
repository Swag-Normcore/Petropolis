import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { favoritesAtom } from "../atoms";
import { getAllFavorites } from "../axios-services";
import { Card, Button } from "react-bootstrap";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [checkedId, setCheckedId] = useState(null);

  useEffect(async () => {
    const getFavorites = async () => {
      const result = await getAllFavorites();
      setFavorites(result);
    };
    getFavorites();
    console.log("favorites in useEffect", favorites);
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedId(id);
  };
  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`/api/favorites/${id}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="favorites-page">
      <div id="favorites-container">
        {favorites.map((favorite) => (
          <Card key={favorite.id} style={{ width: "18rem" }}>
            <Card.Img variant="top" src={favorite.image} />
            <Card.Body>
              <Card.Title>{favorite.title}</Card.Title>
              <Card.Text>{favorite.price}</Card.Text>
              <Button variant="primary">Go somewhere</Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(favorite.id)}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

module.exports = FavoritesPage;
