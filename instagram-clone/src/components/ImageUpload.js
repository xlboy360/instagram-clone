import { Button } from "@material-ui/core";
import React, { useState } from "react";
import firebase from "firebase";

import "./ImageUpload.css"

import { storage, db } from "../firebase";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    console.log("Uploading...");
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
      },
      () => {
        // Complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // Posting image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            console.log(caption);
            console.log(url);
            console.log(username);
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <h2>Upload a file</h2>
      <input className="imageUpload__file" type="file" onChange={handleChange} />
      <input
        type="text"
        placeholder="Give some description..."
        onChange={(event) => setCaption(event.target.value)}
      />

      <progress className="imageUpload__progress" value={progress} max="100" />
      <Button className="imageUpload__uploadButton" onClick={() => handleUpload()}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
