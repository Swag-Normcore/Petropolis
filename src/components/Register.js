import { register, addProductToShoppingCart, removeProductFromShoppingCart } from "../axios-services";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, adminAtom, userAtom, shoppingCartAtom } from "../atoms";
import { Link } from "react-router-dom";

const Register = () => {
  const [token, setToken] = useAtom(tokenAtom);
  const [admin, setAdmin] = useAtom(adminAtom);
  const [user, setUser] = useAtom(userAtom);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [shoppingCart, setShoppingCart] = useAtom(shoppingCartAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = await register({ name, email, password });
    if (userData) {
      setToken(userData.token);
      localStorage.setItem("token", userData.token);
      setAdmin(userData.user.isAdmin);
      setMessage(userData.message);
      setUser(userData.user);
      setName("");
      setEmail("");
      setPassConfirm("");
      setPassword("");
      if (shoppingCart) {
        await Promise.all(shoppingCart.products.map(async (cartProduct) => {
          await addProductToShoppingCart({
            shoppingId: userData.user.shoppingId,
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            token: userData.token
          });
          await removeProductFromShoppingCart({
            shoppingId: shoppingCart.id,
            cartProductId: cartProduct.id,
            token: userData.token
          });
        }));
      }
      window.location.href = "/";
    }
  };

  return (
    <div className="login-register-container">
      <p className="login-redirect">
        Already a user? Login <Link to="/login">here</Link>
      </p>
      <Form id="register-form" onSubmit={handleSubmit}>
        <div className="name mb-3">
          <label htmlFor="name-input" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name-input"
            placeholder="Enter your name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3 email">
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
        <div id="passwordHelpBlock" className="form-text">
          Your password must be 8-20 characters long.
        </div>
        <label htmlFor="password2-input" className="form-label">
          Re-enter password:
        </label>
        <input
          type="password"
          minLength={8}
          id="password2-input"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          value={passConfirm}
          onChange={(e) => setPassConfirm(e.target.value)}
        />
        <button type="submit">Register</button>
      </Form>
      {password !== passConfirm ? <p>Passwords do not match</p> : null}
      {message ? <h3>{message}</h3> : null}
    </div>
  );
};

export default Register;
