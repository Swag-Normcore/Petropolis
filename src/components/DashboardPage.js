import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import ProductForm from "./ProductForm";
import ManageUser from "./ManageUser";
import ManageCategory from "./ManageCategory";

const DashboardPage = () => {
  const [activeComponent, setActiveComponent] = useState("");

  useEffect(() => {
    setActiveComponent(localStorage.getItem("admin component"));
  }, []);

  const showComponent = (component) => {
    setActiveComponent(component);
    localStorage.setItem("admin component", component);
  };

  return (
    <div id="dashboard-page">
      <Navbar bg="dark" variant="dark" expand="lg">
        <div className="container">
          <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                href="#"
                onClick={() => showComponent("productForm")}
                active={activeComponent === "productForm"}
              >
                Product Form
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => showComponent("manageUser")}
                active={activeComponent === "manageUser"}
              >
                Manage User
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={() => showComponent("manageCategory")}
                active={activeComponent === "manageCategory"}
              >
                Manage Category
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      {activeComponent === "productForm" && <ProductForm />}
      {activeComponent === "manageUser" && <ManageUser />}
      {activeComponent === "manageCategory" && <ManageCategory />}
      {!activeComponent && <ProductForm />}
    </div>
  );
};

export default DashboardPage;
