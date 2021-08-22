import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./Post.css";

import firebase from "firebase";

// Icons
import Avatar from "@material-ui/core/Avatar";

function Post({ postId, imageUrl, user, username, caption }) {
  const [comments, setComments] = useState([]);

  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      {/* Header -> avatar + username */}
      <div className="post__header">
        <Avatar className="post__avatar" alt="" src="" />
        <h3>{username}</h3>
      </div>
      {/* Image */}
      <img className="post__image" src={imageUrl} alt="" />
      {/* Butons */}
      {/* Username + caption */}
      <h4 className="post__text">
        <strong>{username}: </strong>
        {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}: </strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a coment.."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
