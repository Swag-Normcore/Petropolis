import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { categoriesAtom, productsAtom } from "../atoms";
import { getAllProducts, getAllCategories } from "../axios-services";
import Form from "react-bootstrap/Form";

const ProductsPage = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [products, setProducts] = useAtom(productsAtom);
  const [checkedId, setCheckedId] = useState(null);

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
    console.log("products in useEffect", products);
    console.log("categories in useEffect", categories);
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedId(id);
  };

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
      <div id="products-container">
        {products.map((product) => (
          <h2>{product.title}</h2>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
