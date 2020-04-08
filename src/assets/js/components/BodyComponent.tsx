// // Client-side code follows:

import * as React from "react";
// import * as ReactDOM from "react-dom";
// var escapeHTML = require("escape-html");

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../configs/firebaseInit";
import "../../styles/index.css";
import CleanAndUploadFiles from "./CleanAndUploadFiles";

// import { months } from "../misc/months";

interface MyState {
   isLoggedInToFirebase?: boolean;
}
class BodyComponent extends React.PureComponent<
   {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
   },
   MyState
> {
   //    unsubscribe: any;
   numUpdates: number;
   numRows: number;
   dataAdapter: null;
   auth2!: gapi.auth2.GoogleAuth;
   loggedInPhotoURL: string | undefined;
   emailAddress: string | undefined;

   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
   }) {
      super(props);
      this.numUpdates = 0;
      this.numRows = 0;
      this.dataAdapter = null;

      this.state = {
         isLoggedInToFirebase: false,
      };
      this.signInToFirebase = this.signInToFirebase.bind(this);
      this.signOutOfFirebase = this.signOutOfFirebase.bind(this);
      this.getAppBodyContent = this.getAppBodyContent.bind(this);
   }

   signInToFirebase(googleUserToken: any) {
      if (typeof this.props.emailAddress != "undefined") {
         const fbCred = firebase.auth.GoogleAuthProvider.credential(
            googleUserToken
         );
         firebase
            .auth()
            .signInWithCredential(fbCred)
            .then(() => {
               //   this.stocksRef = firebase
               //      .firestore()
               //      .collection(this.props.emailAddress);
               //    this.unsubscribe = this.stocksRef.onSnapshot(
               //       this.onCollectionUpdate
               //    );
               this.setState({ isLoggedInToFirebase: true });
            })
            .catch((err) => {
               const firstLine = "C0001: Error signing into firebase:\n";
               console.error(`${firstLine} error<${err.message}>`);
            });
      }
   }

   signOutOfFirebase() {
      //   this.unsubscribe();
      this.numUpdates = 0;
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

   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      // console.log(`In onCollectionUpdate() <${util.inspect(querySnapshot)}>`);
      this.numUpdates++;
      this.numRows = 0;
      this.setState({});
      this.numRows++;
      console.log(
         `%cnumUpdates<${this.numUpdates}>`,
         "background:white; border: 3px solid green; margin: 2px; padding: 3px; color:green;"
      );
   };

   getAppBodyContent() {
      if (this.state.isLoggedInToFirebase) {
         return (
            <CleanAndUploadFiles
               loggedInWithGoogle={this.props.loggedInWithGoogle}
               auth2={this.props.auth2}
               idToken={this.props.googleToken}
               loggedInToFirebase={this.state.isLoggedInToFirebase}
            ></CleanAndUploadFiles>
         );
      } else {
         return <img src={"../../images/cherry.jpeg"} />;
      }
   }

   public render() {
      if (!this.props.loggedInWithGoogle && this.state.isLoggedInToFirebase) {
         this.signOutOfFirebase();
      }
      if (this.props.loggedInWithGoogle && !this.state.isLoggedInToFirebase) {
         this.signInToFirebase(this.props.googleToken);
      }
      return <div>{this.getAppBodyContent()}</div>;
   }
}

export default BodyComponent;
