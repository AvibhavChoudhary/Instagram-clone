import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { db, storage } from "./Firebase";
import "./ImageUpload.css";

function ImageUpload({ user }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.lof(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: user.displayName,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="image__progress" value={progress} max="100" />

      <input
        className="image__caption"
        type="text"
        value={caption}
        placeholder="Enter caption..."
        onChange={(event) => setCaption(event.target.value)}
      />
      <input className="image__file" type="file" onChange={handleChange} />
      <center>
        <Button
          className="image__uploadButton"
          disabled={!image}
          size="medium"
          variant="contained"
          color="primary"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </center>
    </div>
  );
}

export default ImageUpload;
