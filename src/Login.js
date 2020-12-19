import { Button, Input } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "./Firebase";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        history.push("/feed");
      })
      .catch((error) => alert(error.message));

    setEmail("");
    setPassword("");
  };
  return (
    <div>
      <form className="login">
        <center>
          <img
            className="login__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>

        <Input
          className="login__input"
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          className="login__input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <center className="login__submitButton">
          <Button
            className="login__button"
            variant="contained"
            color="primary"
            type="submit"
            disabled={!(email && password)}
            onClick={signIn}
          >
            Login
          </Button>
        </center>
        <center className="login__footer">
          <p>Don't have an account?</p>
          <Link to="/">
            <h4>SignUp here!</h4>
          </Link>
        </center>
      </form>
    </div>
  );
}

export default Login;
