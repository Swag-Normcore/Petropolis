import { register } from "../axios-services";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom } from "../atoms";

const Register = () => {
  const [token, setToken] = useAtom(tokenAtom);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [email, setEmail] = useState("");
  const isAdmin = false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name, email, password);
    const result = await register({ name, email, password, isAdmin });
    console.log(result);
    // setToken(result.token);
  };

  return (
    <div className="login-register-container">
      <Form id="register-form" onSubmit={handleSubmit}>
        <div className="name">
          <label htmlFor="name-input">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name-input"
            placeholder="Enter your name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        {password !== passConfirm ? <p>Passwords do not match</p> : null}
      </Form>
    </div>
  );
};

export default Register;
