const { useAtom } = require("jotai");
const { useEffect, useState } = require("react");
const { favoritesAtom } = require("../atoms");
const { getAllFavorites } = require("../axios-services");
const { default: Form } = require("react-bootstrap/Form");

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
    const result = await deleteFavorite(id);
    setFavorites(result);
  };

  return (
    <div id="favorites-page">
      <div id="favorites-container">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="mb-3">
            <Form.Check
              id={`${favorite.id}`}
              label={`${favorite.name}`}
              checked={favorite.id === checkedId}
              onChange={() => handleCheckboxChange(favorite.id)}
            />
            <button onClick={() => handleDelete(favorite.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

module.exports = FavoritesPage;
