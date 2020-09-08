import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

import "../../../styles/index.css";
import { Roles } from "../../misc/chairLocTypes";
import { AuthContext } from "../../contexts/AuthContext";

import MaintenanceSubheader from "../MaintenanceComponents/MaintenanceSubheader";
import TaskManagementComponent from "../MaintenanceComponents/TaskManagementComponent";
import ChairManagementComponent from "../MaintenanceComponents/ChairManagementComponent";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

interface MyState {}
class MaintenanceBody extends Component<{ match: any }, MyState> {
   constructor(props: { match: any }) {
      super(props);
      this.state = {};

      this.getMaintenanceBodyContent = this.getMaintenanceBodyContent.bind(
         this
      );
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
               const firstLine = "C0311: Error signing into firebase:\n";
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

   getMaintenanceBodyContent() {
      const {
         isSignedIn,
         isLoggedInToFirebase,
         userObjFmServer,
      } = this.context;
      if (!isLoggedInToFirebase) {
         return <h3>Not Authorized</h3>;
      } else if (
         isLoggedInToFirebase &&
         (userObjFmServer.role !== Roles.lurker ||
            userObjFmServer.role !== Roles.notloggedin)
      ) {
         return (
            <>
               <Router>
                  <MaintenanceSubheader
                     match={this.props.match}
                  ></MaintenanceSubheader>
                  <Switch>
                     <Route
                        path={`${this.props.match.path}/bytask`}
                        render={(props) =>
                           isSignedIn ? (
                              <TaskManagementComponent></TaskManagementComponent>
                           ) : (
                              <Redirect to="/" />
                           )
                        }
                     />
                     <Route
                        path={`${this.props.match.path}/bychair`}
                        render={(props) =>
                           isSignedIn ? (
                              <ChairManagementComponent></ChairManagementComponent>
                           ) : (
                              <Redirect to="/" />
                           )
                        }
                     />
                     <Redirect to="/" />
                  </Switch>
               </Router>
            </>
         );
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
      if (
         isSignedIn &&
         !isLoggedInToFirebase &&
         userObjFmServer.role !== Roles.notloggedin
      ) {
         this.signInToFirebase(googleToken);
      }
      return <>{this.getMaintenanceBodyContent()}</>;
   }
}

export default MaintenanceBody;
