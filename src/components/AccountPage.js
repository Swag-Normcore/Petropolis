import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { userAtom, tokenAtom, ordersAtom } from "../atoms";
import {
  Button,
  Card,
  Form,
  CardGroup,
  FormLabel,
  FormGroup,
  FormControl,
} from "react-bootstrap";
import { getAllOrdersByUser } from "../axios-services";
import { updatedUser } from "../axios-services";

const AccountPage = () => {
  const [user, setUser] = useAtom(userAtom);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useAtom(tokenAtom);
  const [orders, setOrders] = useAtom(ordersAtom);
  const { isupdating, setIsUpdating } = useState(false);

  // useEffect(async () => {
  //   // const getOrders = async () => {
  //   //   const result = await getAllOrdersByUser();
  //   //   setOrder(result);
  //   // };

  // });

  const handleNameChange = (event) => {
    setName(event.target.value);
    console.log(name);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    console.log("Password changed successfully!");
  };

  const handleUpdateAccount = (event) => {
    setUpdate(event.target.value);
    updatedUser({ name, password });
    console.log("Account Updated!");
  };

  const handleUpdateOrders = (event) => {
    setOrders(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name, password);
    const result = await updatedUser({ name, password });
    console.log(result);
    localStorage.setItem("token", result.token);
    setToken(result.token);
    setUser(result.user);
    setName("");
    setPassword("");
  };

  // const handleLogout = () => {
  //   localStorage.removeItem(`token`);
  //   window.location.href = `/login`;
  // };

  return (
    <div id="account-page">
      <div id="account-container">
        <Card
          className="bg-info"
          border="dark"
          style={{ width: "25rem", height: "25rem" }}
        >
          <Card.Title style={{ textAlign: "center", fontSize: "30px" }}>
            Account Information{" "}
          </Card.Title>
          <Card.Body
            style={{
              textAlign: "center",
              fontSize: "25px",
            }}
          >
            <strong>Name:</strong>
            {user.name}
            <strong>Email:</strong>
            {user.email}
            <strong>Order History:</strong>
            {orders.Id}
          </Card.Body>
        </Card>

        <div id="update-account">
          <Form>
            <Card
              className="bg-success"
              border="dark"
              style={{
                width: "25rem",
                height: "25rem",
                textAlign: "center",
                fontSize: "25px",
              }}
            >
              <Card.Title style={{ textAlign: "center", fontSize: "30px" }}>
                Update Account
              </Card.Title>
              <Card.Body>
                <strong>Click the button below to update your account.</strong>
                <Button
                  varient="warning"
                  onClick={(handleSubmit) => {
                    setIsUpdating(!isupdating);
                  }}
                >
                  Update Account
                </Button>
              </Card.Body>
            </Card>
          </Form>

          <div id="customer-service">
            <Form>
              <Card
                className="bg-warning"
                border="dark"
                style={{ width: "25rem", height: "25rem" }}
              >
                <Card.Title style={{ textAlign: "center", fontSize: "30px" }}>
                  Customer Service
                </Card.Title>
                <Card.Body style={{ textAlign: "center", fontSize: "20px" }}>
                  <strong>Contact Us</strong>
                  <strong>Email:</strong>
                  graceShopper@pets4you.com
                  <strong>Phone:</strong>
                  636-575-PETS
                  <strong>Address:</strong>
                  5555 Shephard Ave. Crusty, ID 89045
                </Card.Body>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
