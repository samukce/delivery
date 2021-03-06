import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {
  ORDERS,
  CLIENT_LAST_ORDERS,
  USERS,
  ORGANIZATIONS,
  PRODUCTS,
} from "../../constants/entities";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // *** User API ***
  user = (uid) => this.db.ref(`${USERS}/${uid}`);
  users = () => this.db.ref(USERS);

  organization = (uid) => this.db.ref(`${ORGANIZATIONS}/${uid}`);
  organizations = () => this.db.ref(ORGANIZATIONS);

  order = (org, uid) => this.db.ref(`${ORGANIZATIONS}/${org}/${ORDERS}/${uid}`);
  orders = (org) => this.db.ref(`${ORGANIZATIONS}/${org}/${ORDERS}`);

  product = (org, uid) =>
    this.db.ref(`${ORGANIZATIONS}/${org}/${PRODUCTS}/${uid}`);
  products = (org) => this.db.ref(`${ORGANIZATIONS}/${org}/${PRODUCTS}`);

  lastOrder = (org, uid) =>
    this.db.ref(`${ORGANIZATIONS}/${org}/${CLIENT_LAST_ORDERS}/${uid}`);
  lastOrders = (org) =>
    this.db.ref(`${ORGANIZATIONS}/${org}/${CLIENT_LAST_ORDERS}`);

  // generic ref usage
  generic = (refs, org, uid) =>
    this.db.ref(`${ORGANIZATIONS}/${org}/${refs}/${uid}`);
}

export default Firebase;
