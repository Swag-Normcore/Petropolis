import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, adminAtom, userAtom } from "../atoms";
import { login } from "../axios-services";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useAtom(tokenAtom);
  const [admin, setAdmin] = useAtom(adminAtom);
  const [user, setUser] = useAtom(userAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    const result = await login({ email, password });
    console.log(result);
    setToken(result.token);
    setAdmin(result.user.isAdmin);
    setUser(result.user);
  };

  return (
    <div className="login-register-container">
      <Form id="register-form" onSubmit={handleSubmit}>
        <p>
          New User? Register <Link to="/register">here</Link>
        </p>
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
    </div>
  );
};

export default Login;
