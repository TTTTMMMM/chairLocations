import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import MappingSubheader from "../MapEmComponents/MappingSubheader";
import ChairQueryComponent from "../MapEmComponents/ChairQueryComponent";
import RentalAgentQueryComponent from "../MapEmComponents/RentalAgentQueryComponent";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
class MappingBody extends Component<
   {
      match: any;
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
   },
   { isLoggedInToFirebase: boolean }
> {
   constructor(props: {
      match: any;
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
   }) {
      super(props);
      this.state = {
         isLoggedInToFirebase: false,
      };
      this.getMappingBodyContent = this.getMappingBodyContent.bind(this);
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
      console.log(`signing out of firebase in MappingBody`);
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

   getMappingBodyContent() {
      console.log(`MappingBody`);
      return (
         <>
            <Router>
               <MappingSubheader match={this.props.match}></MappingSubheader>
               <Switch>
                  <Route
                     path={`${this.props.match.path}/bychair`}
                     render={(props) =>
                        this.props.loggedInWithGoogle ? (
                           <ChairQueryComponent
                              loggedInToFirebase={
                                 this.state.isLoggedInToFirebase
                              }
                           ></ChairQueryComponent>
                        ) : (
                           <Redirect to="/" />
                        )
                     }
                  />
                  <Route
                     path={`${this.props.match.path}/byrentalagent`}
                     render={(props) =>
                        this.props.loggedInWithGoogle ? (
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
      if (!this.props.loggedInWithGoogle && this.state.isLoggedInToFirebase) {
         this.signOutOfFirebase();
      }
      if (this.props.loggedInWithGoogle && !this.state.isLoggedInToFirebase) {
         this.signInToFirebase(this.props.googleToken);
      }
      return <>{this.getMappingBodyContent()}</>;
   }
}

export default MappingBody;
