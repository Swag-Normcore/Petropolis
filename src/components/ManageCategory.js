import Form from "react-bootstrap/Form";
import { Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import { useAtom } from "jotai";
import { categoriesAtom, tokenAtom } from "../atoms";
import {
  createCategory,
  deleteCategory,
  patchCategory,
} from "../axios-services";
import trashcan from "../images/trash-fill.svg";
import editIcon from "../images/edit-icon.svg";
import { Link } from "react-router-dom";

const ManageCategory = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [categoryId, setCategoryId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useAtom(tokenAtom);
  const [edit, setEdit] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (edit) {
      await patchCategory({
        categoryId,
        name,
        description,
        token,
      });
    } else {
      const result = await createCategory({ name, description, token });
    }
  };

  const handleDelete = async (categoryId) => {
    const result = await deleteCategory({ categoryId, token });
  };

  const handleEdit = (id, name, description) => {
    setEdit(true);
    setName(name);
    setCategoryId(id);
    setDescription(description);
  };

  return (
    <div id="category-dashboard" className="container-fluid">
      <Col xs={12} md={8}>
        <h2 className="my-4">Category Management</h2>
        <Form
          onSubmit={(e) => {
            handleCreateCategory(e);
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter the name for your new category here"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category Description</Form.Label>
            <Form.Control
              as="textarea"
              required
              type="text"
              placeholder="Enter some text describing the new category"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Form.Group>
          {edit ? (
            <Button type="submit">Update Category</Button>
          ) : (
            <Button type="submit">Create New Category</Button>
          )}
        </Form>
        <h2 className="my-4">Existing Categories</h2>
        <div className="categories-dashboard-parent">
          {categories
            ? categories.map((category) => (
                <div key={category.id} className="category-div">
                  <Row>
                    <Col sm={3}>
                      <h4 className="ms-2 fs-5 mt-1">{category.name}</h4>
                    </Col>
                    <Col sm={7}>
                      <p className="mt-1">{category.description}</p>
                    </Col>
                    <Col sm={1}>
                      <Link to="#" onClick={() => handleDelete(category.id)}>
                        <img src={trashcan} />
                      </Link>
                    </Col>
                    <Col sm={1}>
                      <Link
                        to="#"
                        onClick={() =>
                          handleEdit(
                            category.id,
                            category.name,
                            category.description
                          )
                        }
                      >
                        <img src={editIcon} />
                      </Link>
                    </Col>
                  </Row>
                </div>
              ))
            : null}
        </div>
      </Col>
    </div>
  );
};

export default ManageCategory;
