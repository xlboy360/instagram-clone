import firebase from "firebase";
// Configuration from Firebase Config
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDL7JgmyB2r9cUevssQ9nCKj1AnPB73Eyc",
  authDomain: "instagram-clone-95728.firebaseapp.com",
  projectId: "instagram-clone-95728",
  storageBucket: "instagram-clone-95728.appspot.com",
  messagingSenderId: "546510326530",
  appId: "1:546510326530:web:de32838db73810bc3e101b",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
