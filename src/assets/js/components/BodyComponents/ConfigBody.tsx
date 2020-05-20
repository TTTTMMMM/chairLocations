import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import { Roles } from "../../misc/chairLocTypes";
import ConfigContainer from "../ConfigContainer";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

interface MyState {
   isLoggedInToFirebase?: boolean | false;
}
class ConfigBody extends Component<
   {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      userObject: UserObj;
   },
   MyState
> {
   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      userObject: any;
   }) {
      super(props);

      this.state = {
         isLoggedInToFirebase: false,
      };

      this.getConfigBodyContent = this.getConfigBodyContent.bind(this);
   }

   signInToFirebase(googleUserToken: any) {
      if (!firebase.auth().currentUser) {
         const fbCred = firebase.auth.GoogleAuthProvider.credential(
            googleUserToken
         );
         firebase
            .auth()
            .signInWithCredential(fbCred)
            .then(() => {
               this.setState({ isLoggedInToFirebase: true });
            })
            .catch((err) => {
               const firstLine = "C0111: Error signing into firebase:\n";
               console.error(`${firstLine} error<${err.message}>`);
            });
      } else {
         this.setState({ isLoggedInToFirebase: true });
      }
   }

   signOutOfFirebase() {
      firebase
         .auth()
         .signOut()
         .then(() => {
            this.setState({ isLoggedInToFirebase: false });
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
      if (!this.state.isLoggedInToFirebase) {
         return <h3>Not Authorized</h3>;
      } else if (
         this.state.isLoggedInToFirebase &&
         this.props.userObject.role === Roles.admin
      ) {
         return (
            <ConfigContainer
               auth2={this.props.auth2}
               idToken={this.props.googleToken}
               loggedInToFirebase={this.state.isLoggedInToFirebase}
            ></ConfigContainer>
         );
      } else if (
         this.props.loggedInWithGoogle &&
         this.props.userObject.role === Roles.notloggedin
      ) {
         return <h3>Not Authorized</h3>;
      } else {
         <Redirect to="/401" />;
         return <h3>Not Authorized</h3>;
      }
   }
   render() {
      if (!this.props.loggedInWithGoogle && this.state.isLoggedInToFirebase) {
         this.signOutOfFirebase();
      }
      if (this.props.loggedInWithGoogle && !this.state.isLoggedInToFirebase) {
         this.signInToFirebase(this.props.googleToken);
      }
      return <div>{this.getConfigBodyContent()}</div>;
   }
}

export default ConfigBody;
