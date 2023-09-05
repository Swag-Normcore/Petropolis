import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, adminAtom, userAtom, shoppingCartAtom } from "../atoms";
import {
  login,
  addProductToShoppingCart,
  removeProductFromShoppingCart,
} from "../axios-services";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useAtom(tokenAtom);
  const [admin, setAdmin] = useAtom(adminAtom);
  const [user, setUser] = useAtom(userAtom);
  const [message, setMessage] = useState("");
  const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = await login({ email, password });
    localStorage.setItem("token", userData.token);
    setToken(userData.token);
    setUser(userData.user);
    setAdmin(userData.user.isAdmin);
    setMessage(userData.message);
    setEmail("");
    setPassword("");
    if (shoppingCart) {
      await Promise.all(
        shoppingCart.products.map(async (cartProduct) => {
          await addProductToShoppingCart({
            shoppingId: userData.user.shoppingId,
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            token: userData.token,
          });
          await removeProductFromShoppingCart({
            shoppingId: shoppingCart.id,
            cartProductId: cartProduct.id,
            token: userData.token,
          });
        })
      );
    }
    window.location.href = "/"; å
  };

  return (
    <div className="login-register-container">
      <p className="login-redirect">
        New User? Register <Link to="/register">here</Link>
      </p>
      <Form
        id="register-form"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="mb-3">
          <label htmlFor="email-input" className="form-label">
            Email address:
          </label>
          <input
            type="email"
            className="form-control"
            id="email-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <label htmlFor="password-input" className="form-label">
          Password:
        </label>
        <input
          type="password"
          minLength={8}
          id="password-input"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </Form>
      {message ? <h3>{message}</h3> : null}
    </div>
  );
};

export default Login;
