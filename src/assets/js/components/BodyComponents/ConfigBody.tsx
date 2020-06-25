import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

import "../../../styles/index.css";
import { Roles } from "../../misc/chairLocTypes";
// import ConfigContainer from "../ConfigComponents/ConfigContainer";
import { AuthContext } from "../../contexts/AuthContext";

import ConfigSubheader from "../ConfigComponents/ConfigSubheader";
import UserManagementComponent from "../ConfigComponents/UserManagementComponent";
import RentalAgentBeachesManagementComponent from "../ConfigComponents/RentalAgentBeachesManagementComponent";
import RentalAgentChairsManagementComponent from "../ConfigComponents/RentalAgentChairsManagementComponent";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

interface MyState {}
class ConfigBody extends Component<{ match: any }, MyState> {
   constructor(props: { match: any }) {
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

   getConfigBodyContent() {
      const {
         isSignedIn,
         isLoggedInToFirebase,
         userObjFmServer,
      } = this.context;
      if (!isLoggedInToFirebase) {
         return <h3>Not Authorized</h3>;
      } else if (isLoggedInToFirebase && userObjFmServer.role === Roles.admin) {
         return (
            <>
               <Router>
                  <ConfigSubheader match={this.props.match}></ConfigSubheader>
                  <Switch>
                     <Route
                        path={`${this.props.match.path}/usermanagement`}
                        render={(props) =>
                           isSignedIn ? (
                              <UserManagementComponent></UserManagementComponent>
                           ) : (
                              <Redirect to="/" />
                           )
                        }
                     />
                     <Route
                        path={`${this.props.match.path}/rentalagentbeaches`}
                        render={(props) =>
                           isSignedIn ? (
                              <RentalAgentBeachesManagementComponent></RentalAgentBeachesManagementComponent>
                           ) : (
                              <Redirect to="/" />
                           )
                        }
                     />
                     <Route
                        path={`${this.props.match.path}/rentalagentchairs`}
                        render={(props) =>
                           isSignedIn ? (
                              <RentalAgentChairsManagementComponent></RentalAgentChairsManagementComponent>
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
      if (
         isSignedIn &&
         !isLoggedInToFirebase &&
         userObjFmServer.role !== Roles.notloggedin
      ) {
         this.signInToFirebase(googleToken);
      }
      return <>{this.getConfigBodyContent()}</>;
   }
}

export default ConfigBody;
