import { Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useAtom } from "jotai";
import { categoriesAtom, tokenAtom } from "../atoms";
import { createProduct, addImagesToProduct } from "../axios-services";

const ProductForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [categoryId, setCategoryId] = useState(undefined);
  const [animalType, setAnimalType] = useState(undefined);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [token, setToken] = useAtom(tokenAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = await createProduct({
      title,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      animalType,
      token: token,
    });
    const productId = newProduct.id;
    const addImages = await addImagesToProduct({
      productId,
      imageUrls,
      token: token,
    });
  };

  return (
    <div id="product-form-container">
      <Col xs={12} md={8}>
        <h2 className="my-4">Add New Product</h2>
        <Form onSubmit={handleSubmit} className="m-5 ms-3">
          <Form.Group className="mb-3">
            <Form.Label>Product Title</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              required
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Product Price</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="$Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Product Stock</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Primary Image Url</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="One URL only"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Other images</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
              placeholder="Each URL separated by a comma"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex flex-wrap">
            <Form.Label className="m-3">Category (pick one)</Form.Label>
            {categories
              ? categories.map((category) => (
                  <div key={category.id} className="m-3">
                    <Form.Check
                      id={`${category.id}`}
                      label={`${category.name}`}
                      value={category.id}
                      onChange={(e) => setCategoryId(e.target.value)}
                    />
                  </div>
                ))
              : null}
          </Form.Group>
          <Form.Group className="mb-3 d-flex">
            <Form.Label className="m-3">Animal Type</Form.Label>
            <Form.Check
              className="m-3"
              type="checkbox"
              label="Dog"
              value="dog"
              onChange={(e) => setAnimalType(e.target.value)}
            />
            <Form.Check
              className="m-3"
              type="checkbox"
              label="Cat"
              value="cat"
              onChange={(e) => setAnimalType(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create New Product
          </Button>
        </Form>
      </Col>
    </div>
  );
};

export default ProductForm;
