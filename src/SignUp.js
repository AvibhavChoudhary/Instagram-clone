import { auth, db } from "./Firebase";
import React, { useEffect, useState } from "react";
import "./SignUp.css";
import { Button, Input } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const history = useHistory();

  const signUp = async (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        history.push("/feed");
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    await db
      .collection("users")
      .add({
        email: email,
        password: password,
        username: username,
      })
      .then(() => {
        console.log(email, password, username);
      });

    setEmail("");
    setUsername("");
    setPassword("");
  };
  return (
    <div>
      <form className="app__signup">
        <center>
          <img
            style={{ marginTop: "30px" }}
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>

        <Input
          className="app__input"
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          className="app__input"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          className="app__input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <center className="signup__submitButton ">
          <Button
            className="signup__button"
            variant="contained"
            color="primary"
            type="submit"
            disabled={!(username && email && password)}
            onClick={signUp}
          >
            Signup
          </Button>
        </center>
        <center className="signup__footer">
          <p>Already have an account?</p>
          <Link to="/login">
            <h4>Login Instead</h4>
          </Link>
        </center>
      </form>
    </div>
  );
}

export default SignUp;
