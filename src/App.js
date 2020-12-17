import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./Firebase";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function App() {
  const [post, setPost] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openUploadImage, setOpenUploadImage] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPost(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
      });
  }, []);

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
    setEmail("");
    setPassword("");
  };

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    db.collection("users").add({
      email: email,
      password: password,
      username: username,
    });
    setOpenSignIn(false);
    setEmail("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="App">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ? (
          <div>
            {openUploadImage ? (
              <Button onClick={() => setOpenUploadImage(false)}>Back</Button>
            ) : (
              <Button onClick={() => setOpenUploadImage(true)}>
                Upload Post
              </Button>
            )}

            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="login__container">
            <Button
              onClick={() => {
                setOpenSignIn(true);
                setEmail("");
                setPassword("");
                setUsername("");
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setOpenSignIn(false);
                setEmail("");
                setPassword("");
              }}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>

      {openUploadImage ? (
        <ImageUpload user={user} />
      ) : (
        <div>
          {user ? (
            <div className="app__posts">
              <div className="app__postLeft">
                <h2 style={{ padding: "5px", width: "auto", height: "auto" }}>
                  App users:
                </h2>
                {post.map(({ id, post }) => (
                  <Post
                    key={id}
                    postId={id}
                    user={user}
                    username={post.username}
                    caption={post.caption}
                    imageUrl={post.imageUrl}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="app__NotSignin">
              <h1>Please SignUp or Login</h1>

              {!openSignIn ? (
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

                    <center>
                      <Button
                        className="app__submitButton"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!(username && email && password)}
                        onClick={signUp}
                      >
                        Signup
                      </Button>
                    </center>
                  </form>
                </div>
              ) : (
                <div>
                  <form className="app__signup">
                    <center>
                      <img
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
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <center>
                      <Button
                        className="app__submitButton"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!(email && password)}
                        onClick={signIn}
                      >
                        Login
                      </Button>
                    </center>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
