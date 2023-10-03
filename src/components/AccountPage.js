import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { userAtom, tokenAtom, ordersAtom } from "../atoms";
import {
    Button,
    Card,
    Form,
} from "react-bootstrap";
import { updateUser, getUser, login } from "../axios-services";

const AccountPage = () => {
    const [user, setUser] = useAtom(userAtom);
    const [name, setName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [token, setToken] = useAtom(tokenAtom);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // useEffect(async () => {
    //   // const getOrders = async () => {
    //   //   const result = await getAllOrdersByUser();
    //   //   setOrder(result);
    //   // };

    // });

    const handleUpdateName = async () => {
        const userToUpdate = await updateUser({ userId: user.id, name, token });
        if (userToUpdate) {
            alert("Successfully updated name!");
            const newUser = await getUser({ token });
            setUser(newUser);
            setName("");
            setIsUpdatingName(false);
        } else {
            alert("Failed to update user!");
        }
    };

    const handleUpdatePassword = async (event) => {
        if (newPassword === confirmNewPassword) {
            const userConfirmation = await login({ email: user.email, password: oldPassword });
            if (userConfirmation) {
                const userToUpdate = await updateUser({ userId: user.id, password: newPassword, token });
                if (userToUpdate) {
                    alert("Successfully updated password!");
                    const newUser = await getUser({ token });
                    setUser(newUser);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setIsUpdatingPassword(false);
                } else {
                    alert("Failed to update password!");
                }
            } else {
                alert("Failed to confirm password!");
            }
        } else {
            alert("Confirm password must match new password!");
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log(name, password);
    //     const result = await updatedUser({ name, password });
    //     console.log(result);
    //     localStorage.setItem("token", result.token);
    //     setToken(result.token);
    //     setUser(result.user);
    //     setName("");
    //     setPassword("");
    // };

    // const handleLogout = () => {
    //   localStorage.removeItem(`token`);
    //   window.location.href = `/login`;
    // };

    return (
        <div id="account-page" className="d-flex flex-column align-items-center">
            <Card
                border="primary"
                style={{ width: "25rem", height: "25rem" }}
            >
                <Card.Header style={{ textAlign: "center", fontSize: "30px" }}>
                    Account Information{" "}
                </Card.Header>
                <Card.Body
                    style={{
                        textAlign: "center",
                        fontSize: "25px",
                    }}
                >
                    <Card.Text>
                        <strong>Name:</strong>
                    </Card.Text>
                    <Card.Text>
                        {user.name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Email:</strong>
                    </Card.Text>
                    <Card.Text>
                        {user.email}
                    </Card.Text>
                    <Button
                        className="m-1 site-button"
                        varient="warning"
                        onClick={(e) => {
                            setIsUpdatingName(!isUpdatingName);
                            setIsUpdatingPassword(false);
                        }}
                    >
                        Update Name
                    </Button>
                    <Button
                        className="m-1 site-button"
                        varient="warning"
                        onClick={(e) => {
                            setIsUpdatingPassword(!isUpdatingPassword);
                            setIsUpdatingName(false);
                        }}
                    >
                        Update Password
                    </Button>
                </Card.Body>
            </Card>
            {
                isUpdatingName ?
                    <Form
                        className="m-4 border border-3 border-primary rounded text-bg-light"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateName();
                        }}>
                        <Form.Group className="m-2">
                            <Form.Label htmlFor="name">Name:</Form.Label>
                            <Form.Control
                                id="name"
                                type="text"
                                placeholder="enter name"
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Button type="submit" className="site-button mx-3">Update Name</Button>
                    </Form> : null
            }
            {
                isUpdatingPassword ?
                    <Form
                        className="m-4 border border-3 border-primary rounded text-bg-light"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdatePassword();
                        }}>
                        <Form.Group className="m-2">
                            <Form.Label htmlFor="password">Password:</Form.Label>
                            <Form.Control
                                id="password"
                                type="password"
                                minLength={6}
                                placeholder="enter password"
                                required
                                value={oldPassword}
                                onChange={(e) => {
                                    setOldPassword(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="m-2">
                            <Form.Label htmlFor="newPassword">New Password:</Form.Label>
                            <Form.Control
                                id="newPassword"
                                type="password"
                                minLength={6}
                                placeholder="enter new password"
                                required
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="m-2">
                            <Form.Label htmlFor="confirmNewPassword">Confirm New Password:</Form.Label>
                            <Form.Control
                                id="confirmNewPassword"
                                type="password"
                                minLength={6}
                                placeholder="confirm password"
                                required
                                value={confirmNewPassword}
                                onChange={(e) => {
                                    setConfirmNewPassword(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Button type="submit" className="site-button mx-3">Update Name</Button>
                    </Form> : null
            }
            <Card
                border="primary"
                style={{ width: "25rem", height: "25rem" }}
            >
                <Card.Header style={{ textAlign: "center", fontSize: "30px" }}>
                    Customer Service
                </Card.Header>
                <Card.Body style={{ textAlign: "center", fontSize: "20px" }}>
                    <Card.Text>
                        <strong>Contact Us</strong>
                    </Card.Text>
                    <Card.Text>
                        <strong>Email:</strong>
                    </Card.Text>
                    <Card.Text>
                        graceShopper@pets4you.com
                    </Card.Text>
                    <Card.Text>
                        <strong>Phone:</strong>
                    </Card.Text>
                    <Card.Text>
                        636-575-PETS
                    </Card.Text>
                    <Card.Text>
                        <strong>Address:</strong>
                    </Card.Text>
                    <Card.Text>
                        5555 Shephard Ave. Crusty, ID 89045
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AccountPage;
