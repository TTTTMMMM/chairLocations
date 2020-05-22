// // Client-side code follows:

import * as React from "react";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../../configs/firebaseInit";
import "../../../styles/index.css";
import CleanAndUploadFiles from "../CleanAndUploadFiles";
import { AuthContext } from "../../contexts/AuthContext";

import { Roles } from "../../misc/chairLocTypes";

class UploadBody extends React.PureComponent<{}, {}> {
   numUpdates: number;
   numRows: number;

   constructor(props: {}) {
      super(props);
      this.numUpdates = 0;
      this.numRows = 0;

      this.state = {};
      this.signInToFirebase = this.signInToFirebase.bind(this);
      this.signOutOfFirebase = this.signOutOfFirebase.bind(this);
      this.getBodyUploadContent = this.getBodyUploadContent.bind(this);
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
               console.log(`Logged in to firebase.`);
            })
            .catch((err) => {
               const firstLine = "C0211: Error signing into firebase:\n";
               console.error(`${firstLine} error<${err.message}>`);
            });
      } else {
         setIsLoggedInToFirebase(true);
      }
   }

   signOutOfFirebase() {
      const { setIsLoggedInToFirebase } = this.context;
      firebase
         .auth()
         .signOut()
         .then(() => {
            setIsLoggedInToFirebase(false);
            console.log(`Logged out of firebase.`);
         })
         .catch((err) => {
            const firstLine =
               "Couldn't log client-side firebase user out: " +
               err.message.split("\n")[0];
            const errCode = err.code;
            console.log(`${firstLine} ${errCode}`);
         });
   }

   getBodyUploadContent() {
      return <CleanAndUploadFiles></CleanAndUploadFiles>;
   }

   public render() {
      const {
         isSignedIn,
         isLoggedInToFirebase,
         googleToken,
         userObjFmServer,
      } = this.context;
      if (userObjFmServer.role === Roles.notloggedin && isLoggedInToFirebase) {
         this.signOutOfFirebase();
      }
      if (
         isSignedIn &&
         !isLoggedInToFirebase &&
         userObjFmServer.role !== Roles.notloggedin
      ) {
         this.signInToFirebase(googleToken);
      }
      return <>{this.getBodyUploadContent()}</>;
   }
}

export default UploadBody;
