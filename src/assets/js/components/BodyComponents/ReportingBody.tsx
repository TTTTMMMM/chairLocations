import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import "../../../styles/index.css";
import ReportingSubheader from "../ReportEmComponents/ReportingSubheader";
import ViewQueryComponent from "../ReportEmComponents/ViewQueryComponent";
import GenerateQueryComponent from "../ReportEmComponents/GenerateQueryComponent";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { Roles } from "../../misc/chairLocTypes";
class ReportingBody extends Component<{ match: any }, {}> {
   constructor(props: { match: any }) {
      super(props);
      this.getReportingBodyContent = this.getReportingBodyContent.bind(this);
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
               const firstLine = "C0411: Error signing into firebase:\n";
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
            console.error(`${firstLine} ${errCode}`);
         });
   }

   getReportingBodyContent() {
      const { isSignedIn } = this.context;
      return (
         <>
            <Router>
               <ReportingSubheader
                  match={this.props.match}
               ></ReportingSubheader>
               <Switch>
                  <Route
                     exact
                     path={`${this.props.match.path}/view`}
                     render={(props) =>
                        isSignedIn ? (
                           <ViewQueryComponent></ViewQueryComponent>
                        ) : (
                           <Redirect to="/" />
                        )
                     }
                  />
                  <Route
                     exact
                     path={`${this.props.match.path}/generate`}
                     render={(props) =>
                        isSignedIn ? (
                           <GenerateQueryComponent></GenerateQueryComponent>
                        ) : (
                           <Redirect to="/" />
                        )
                     }
                  />
                  <Redirect to="/401" />
               </Switch>
            </Router>
         </>
      );
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
      if (
         isSignedIn &&
         !isLoggedInToFirebase &&
         userObjFmServer.role !== Roles.notloggedin
      ) {
         this.signInToFirebase(googleToken);
      }
      return <>{this.getReportingBodyContent()}</>;
   }
}

export default ReportingBody;
