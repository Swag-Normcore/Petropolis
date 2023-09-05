import React from "react";
import ProductForm from "./ProductForm";
import ManageUser from "./ManageUser";
import { useAtom } from "jotai";
import { usersAtom, tokenAtom } from "../atoms";
import { useEffect } from "react";
import { getUser } from "../axios-services";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

import { useState } from "react";
import { deleteUser } from "../axios-services";
import { useHistory } from "react-router-dom";

// Dashboard should include these functionalities:
// Create, update and delete products
// Delete user or make them admin
// Create, update and delete categories
// View all orders and change status (Created, Processing, Cancelled, Completed) and filter by status
// Optional dashboard features
// Edit orders
// Delete all guest shopping carts
// View all users and filter by admin status
// View all categories and filter by product
// View all products and filter by category
// View all products and filter by price range
// View all products and filter by stock
// View all products and filter by rating
// View all products and filter by title
// View all products and filter by description
// View all products and filter by availability
// View all products and filter by date created
// View all products and filter by date updated
// View all products and filter by date deleted
// View all products and filter by date restored
// View all products and filter by date permanently deleted

const DashboardPage = () => {
  const [users, setUsers] = useAtom(usersAtom);
  const [token] = useAtom(tokenAtom);
  const [key, setKey] = useState("users");
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      getUser(token)
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, setUsers]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        return user.email.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, users]);

  const handleDelete = (id) => {
    deleteUser(id, token)
      .then((res) => {
        console.log(res);
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAdmin = (id) => {
    const user = users.find((user) => user.id === id);
    const updatedUser = { ...user, isAdmin: !user.isAdmin };
    const updatedUsers = users.map((user) =>
      user.id === id ? updatedUser : user
    );
    setUsers(updatedUsers);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            <Tab eventKey="users" title="Users">
              <Row>
                <Col>
                  <h2>Users</h2>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search by email"
                    value={search}
                    onChange={handleSearch}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <ManageUser
                          key={user.id}
                          user={user}
                          handleDelete={handleDelete}
                          handleAdmin={handleAdmin}
                        />
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="products" title="Products">
              <Row>
                <Col>
                  <h2>Products</h2>
                </Col>
                <Col>
                  <Link to="/dashboard/products/new">
                    <Button variant="primary">Add Product</Button>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Product 1</td>
                        <td>100</td>
                        <td>10</td>
                        <td>
                          <Link to="/dashboard/products/1">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Product 2</td>
                        <td>200</td>
                        <td>20</td>
                        <td>
                          <Link to="/dashboard/products/2">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Product 3</td>
                        <td>300</td>
                        <td>30</td>
                        <td>
                          <Link to="/dashboard/products/3">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="categories" title="Categories">
              <Row>
                <Col>
                  <h2>Categories</h2>
                </Col>
                <Col>
                  <Link to="/dashboard/categories/new">
                    <Button variant="primary">Add Category</Button>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Category 1</td>
                        <td>
                          <Link to="/dashboard/categories/1">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Category 2</td>
                        <td>
                          <Link to="/dashboard/categories/2">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Category 3</td>
                        <td>
                          <Link to="/dashboard/categories/3">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="orders" title="Orders">
              <Row>
                <Col>
                  <h2>Orders</h2>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search by email"
                    value={search}
                    onChange={handleSearch}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Order 1</td>
                        <td>100</td>
                        <td>10</td>
                        <td>
                          <Link to="/dashboard/orders/1">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Order 2</td>
                        <td>200</td>
                        <td>20</td>
                        <td>
                          <Link to="/dashboard/orders/2">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Order 3</td>
                        <td>300</td>
                        <td>30</td>
                        <td>
                          <Link to="/dashboard/orders/3">
                            <Button variant="primary">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
