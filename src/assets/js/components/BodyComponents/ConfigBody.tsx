import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import "../../../styles/index.css";
import { Roles } from "../../misc/chairLocTypes";
import ConfigContainer from "../ConfigContainer";
import { AuthContext } from "../../contexts/AuthContext";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

interface MyState {}
class ConfigBody extends Component<{}, MyState> {
   constructor(props: {}) {
      super(props);
      this.state = {};

      this.getConfigBodyContent = this.getConfigBodyContent.bind(this);
   }
   static contextType = AuthContext;

   signInToFirebase(googleUserToken: any) {
      const { setIsLoggedInToFirebase } = this.context;
      if (!firebase.auth().currentUser) {
         const fbCred = firebase.auth.GoogleAuthProvider.credential(
            googleUserToken
         );
         firebase
            .auth()
            .signInWithCredential(fbCred)
            .then(() => {
               setIsLoggedInToFirebase(true);
            })
            .catch((err) => {
               const firstLine = "C0311: Error signing into firebase:\n";
               console.error(`${firstLine} error<${err.message}>`);
            });
      } else {
         setIsLoggedInToFirebase(true);
      }
   }

   signOutOfFirebase() {
      console.log(`in ConfigBody, signOutOfFirebase()`);
      const { setIsLoggedInToFirebase } = this.context;
      firebase
         .auth()
         .signOut()
         .then(() => {
            setIsLoggedInToFirebase(false);
         })
         .catch((err) => {
            const firstLine =
               "Couldn't log client-side firebase user out: " +
               err.message.split("\n")[0];
            const errCode = err.code;
            console.log(`${firstLine} ${errCode}`);
         });
   }

   getConfigBodyContent() {
      const {
         isSignedIn,
         isLoggedInToFirebase,
         userObjFmServer,
      } = this.context;
      if (!isLoggedInToFirebase) {
         return <h3>Not Authorized</h3>;
      } else if (isLoggedInToFirebase && userObjFmServer.role === Roles.admin) {
         return <ConfigContainer></ConfigContainer>;
      } else if (isSignedIn && userObjFmServer.role === Roles.notloggedin) {
         return <h3>Not Authorized</h3>;
      } else {
         <Redirect to="/401" />;
         return <h3>Not Authorized</h3>;
      }
   }
   render() {
      const {
         isSignedIn,
         isLoggedInToFirebase,
         googleToken,
         userObjFmServer,
      } = this.context;
      if (userObjFmServer.role === Roles.notloggedin && isLoggedInToFirebase) {
         this.signOutOfFirebase();
      }
      if (isSignedIn && !isLoggedInToFirebase) {
         this.signInToFirebase(googleToken);
      }
      return <div>{this.getConfigBodyContent()}</div>;
   }
}

export default ConfigBody;
