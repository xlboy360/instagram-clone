import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import ImageUpload from "./components/ImageUpload";
import InstagramLogo from "./static/Instagram-Logo.png";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import { db, auth } from "./firebase";
import { Button, Input } from "@material-ui/core";

import InstagramEmbed from "react-instagram-embed";

// Modal style
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "80%",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogIn, setOpenLogIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in successfully
        console.log(authUser);
        setUser(authUser);
      } else {
        // No user logged in
        setUser(null);
      }
    });

    return () => {
      // Performe some cleanup actions before
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    // Use state from Firebase
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // Every time that something is added to the collection it will record it
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  // Creates a fresh user in Firebase
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

    setOpen(false);

    logIn(event);
  };

  const logIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenLogIn(false);
  };
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img className="app__headerImage" src={InstagramLogo} alt="" />
            <Input
              className="app__input"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openLogIn}
        onClose={() => setOpenLogIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img className="app__headerImage" src={InstagramLogo} alt="" />
            <Input
              className="app__input"
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={logIn}>
              Log In
            </Button>
          </form>
        </div>
      </Modal>
      {/* Header */}
      <div className="app__header">
        <img className="app__headerImage" src={InstagramLogo} alt="Instagram" />
        {user ? (
          <div className="app__loginContainer">
            <Button type="submit" onClick={() => auth.signOut()}>
              Log out
            </Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenLogIn(true)}>Log In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              user={user}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            clientAccessToken="123|456"
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <div className="app__imageUploadNoneUser">
          <h3>Sorry, you need to log in to upload content :)</h3>
        </div>
      )}
    </div>
  );
}

export default App;
