import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import "../../../styles/index.css";
import MappingSubheader from "../MapEmComponents/MappingSubheader";
import ChairQueryComponent from "../MapEmComponents/ChairQueryComponent";
import RentalAgentQueryComponent from "../MapEmComponents/RentalAgentQueryComponent";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { Roles } from "../../misc/chairLocTypes";
class MappingBody extends Component<{ match: any }, {}> {
   constructor(props: { match: any }) {
      super(props);
      this.getMappingBodyContent = this.getMappingBodyContent.bind(this);
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
               const firstLine = "C0111: Error signing into firebase:\n";
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

   getMappingBodyContent() {
      const { isSignedIn } = this.context;
      return (
         <>
            <Router>
               <MappingSubheader match={this.props.match}></MappingSubheader>
               <Switch>
                  <Route
                     path={`${this.props.match.path}/bychair`}
                     render={(props) =>
                        isSignedIn ? (
                           <ChairQueryComponent></ChairQueryComponent>
                        ) : (
                           <Redirect to="/" />
                        )
                     }
                  />
                  <Route
                     path={`${this.props.match.path}/byrentalagent`}
                     render={(props) =>
                        isSignedIn ? (
                           <RentalAgentQueryComponent></RentalAgentQueryComponent>
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
      return <>{this.getMappingBodyContent()}</>;
   }
}

export default MappingBody;
