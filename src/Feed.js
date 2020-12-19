import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import Post from "./Post";

import "./Feed.css";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function Feed() {
  const [post, setPost] = useState([]);
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();

  // useEffect(() => {
  //   db.collection("posts")
  //     .orderBy("timestamp", "desc")
  //     .onSnapshot((snapshot) => {
  //       setPost(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
  //     });
  // }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (snapshot) => {
          setPost(
            snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
          );
        },
        (onerror) => console.log(onerror)
      );

    return () => {
      unsubscribe();
    };
  }, []);

  const logOut = () => {
    auth.signOut();
    dispatch({
      type: "SET_USER",
      user: null,
    });
    history.push("/");
  };

  const handleUpload = () => {
    history.push("/imageUpload");
  };

  return (
    <div>
      {user ? (
        <div className="feed">
          <div className="feed__header">
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
            <div className="feed__headerButtons">
              <Button onClick={handleUpload}>Upload Post</Button>
              <Button onClick={logOut}>LogOut</Button>
            </div>
          </div>
          <div className="feed__posts">
            {post.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            ))}
          </div>
        </div>
      ) : (
        <h2> You are not authenticated</h2>
      )}
    </div>
  );
}

export default Feed;
