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
import { UserObj } from "../../misc/chairLocTypes";

interface MyState {
   isLoggedInToFirebase?: boolean | false;
}
class UploadBody extends React.PureComponent<
   {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
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
      userObject: UserObj;
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
      this.getBodyUploadContent = this.getBodyUploadContent.bind(this);
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

   getBodyUploadContent() {
      return (
         <CleanAndUploadFiles
            loggedInWithGoogle={this.props.loggedInWithGoogle}
            auth2={this.props.auth2}
            idToken={this.props.googleToken}
            loggedInToFirebase={this.state.isLoggedInToFirebase!}
            userObject={this.props.userObject}
         ></CleanAndUploadFiles>
      );
   }

   public render() {
      if (!this.props.loggedInWithGoogle && this.state.isLoggedInToFirebase) {
         this.signOutOfFirebase();
      }
      if (this.props.loggedInWithGoogle && !this.state.isLoggedInToFirebase) {
         this.signInToFirebase(this.props.googleToken);
      }
      return <>{this.getBodyUploadContent()}</>;
   }
}

export default UploadBody;
