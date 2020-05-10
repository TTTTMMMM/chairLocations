// Client-side code follows:

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";
import "../../styles/index.css";
import HeaderComponent from "../components/HeaderComponent";
import MainBody from "../components/BodyComponents/MainBody";
import getLoggedinUser from "../fetches/getLoggedinUser";
import * as clt from "../misc/chairLocTypes";

import FourOFourPage from "./FourOFourPage";
import FourOOnePage from "./FourOOnePage";

import UploadBody from "../components/BodyComponents/UploadBody";
import MappingBody from "../components/BodyComponents/MappingBody";
import MaintenanceBody from "../components/BodyComponents/MaintenanceBody";
import ConfigBody from "../components/BodyComponents/ConfigBody";

// Note: gapi (Google APIs) are available because I included this line: <script src="https://apis.google.com/js/api.js"></script> in index.html. That's the mystery behind how the gapi calls work without importing them in App.tsx (this file). Also, note that the type definitions for gapi objects can be found in node_modules/@types/gapi.auth2/index.d.ts file.
class MainPage extends Component<
   {},
   { isSignedIn: boolean; googleToken: any; userObjFmServer: clt.UserObj }
> {
   auth2!: gapi.auth2.GoogleAuth;
   loggedInPhotoURL: string | undefined;
   emailAddress: string | undefined;
   id_token: any | undefined;
   constructor(props: { match: any }) {
      super(props);

      this.state = {
         isSignedIn: false,
         googleToken: "dummyValue",
         userObjFmServer: {
            username: "",
            role: clt.Roles.notloggedin,
            canAccess: {
               chairLocsRead: false,
               chairLocsWrite: false,
               maintenance: false,
            },
         },
      };
      this.logout = this.logout.bind(this);
      this.onSuccess = this.onSuccess.bind(this);
   }

   componentDidMount() {
      window.gapi.load("auth2", () => {
         this.auth2 = gapi.auth2.init({
            client_id:
               "702445664854-l75e1o6sni99dcadjbqeqa7pa9lld78p.apps.googleusercontent.com",
         });
         this.auth2.then(() => {
            this.setState({
               isSignedIn: this.auth2!.isSignedIn.get(),
            });
         });
      });

      window.gapi.load("signin2", () => {
         var opts = {
            width: 100,
            height: 30,
            onsuccess: this.onSuccess,
            theme: "dark",
         };
         gapi.signin2.render("loginButton", opts);
      });
   }

   onSuccess(googleUser: any) {
      this.id_token = googleUser.getAuthResponse(true).id_token;
      this.setState({ googleToken: this.id_token });
      this.loggedInPhotoURL = this.auth2.currentUser
         .get()
         .getBasicProfile()
         .getImageUrl();
      this.emailAddress = this.auth2.currentUser
         .get()
         .getBasicProfile()
         .getEmail();
      getLoggedinUser(this.auth2, this.id_token).then((result: any) => {
         if (result)
            this.setState({
               isSignedIn: true,
            });
         this.setState({ userObjFmServer: result });
      });
   }

   onLoginFailed() {
      this.setState({
         isSignedIn: false,
      });
   }

   logout(e: any) {
      e.preventDefault();
      this.auth2!.signOut()
         .then(() => {
            this.setState({
               isSignedIn: this.auth2!.isSignedIn.get(),
               googleToken: "dummyValue",
               userObjFmServer: {
                  username: "",
                  role: clt.Roles.notloggedin,
                  canAccess: {
                     chairLocsRead: false,
                     chairLocsWrite: false,
                     maintenance: false,
                  },
               },
            });
         })
         .then(() => {
            window.gapi.load("signin2", () => {
               var opts = {
                  width: 100,
                  height: 30,
                  onsuccess: this.onSuccess,
                  theme: "dark",
               };
               gapi.signin2.render("loginButton", opts);
            });
            <Redirect to="/" />;
         })
         .catch((err: any) => {
            console.error(`C0016: ${err}`);
         });
   }

   public render() {
      return (
         <Router>
            <HeaderComponent
               isSignedIn={this.state.isSignedIn}
               logout={this.logout}
               photoURL={this.loggedInPhotoURL}
               userObject={this.state.userObjFmServer}
            ></HeaderComponent>
            <Switch>
               <Route
                  exact
                  path="/"
                  render={(props) => (
                     <MainBody
                        userObject={this.state.userObjFmServer}
                     ></MainBody>
                  )}
               />
               <Route
                  exact
                  path="/upload"
                  render={(props) =>
                     this.state.isSignedIn ? (
                        <UploadBody
                           auth2={this.auth2}
                           loggedInWithGoogle={this.state.isSignedIn}
                           googleToken={this.state.googleToken}
                           emailAddress={this.emailAddress}
                           userObject={this.state.userObjFmServer}
                        ></UploadBody>
                     ) : (
                        <Redirect to="/" />
                     )
                  }
               />
               <Route
                  path="/mapping"
                  render={(props) =>
                     this.state.isSignedIn ? (
                        <MappingBody
                           match={props.match}
                           auth2={this.auth2}
                           loggedInWithGoogle={this.state.isSignedIn}
                           googleToken={this.state.googleToken}
                           emailAddress={this.emailAddress}
                           userObject={this.state.userObjFmServer}
                        ></MappingBody>
                     ) : (
                        <Redirect to="/" />
                     )
                  }
               />
               <Route
                  exact
                  path="/maintenance"
                  render={(props) =>
                     this.state.isSignedIn ? (
                        <MaintenanceBody
                           auth2={this.auth2}
                           loggedInWithGoogle={this.state.isSignedIn}
                           googleToken={this.state.googleToken}
                           emailAddress={this.emailAddress}
                           userObject={this.state.userObjFmServer}
                        ></MaintenanceBody>
                     ) : (
                        <Redirect to="/" />
                     )
                  }
               />
               <Route
                  exact
                  path="/configuration"
                  render={(match) =>
                     this.state.isSignedIn &&
                     this.state.userObjFmServer.role === clt.Roles.admin ? (
                        <ConfigBody
                           auth2={this.auth2}
                           loggedInWithGoogle={this.state.isSignedIn}
                           googleToken={this.state.googleToken}
                           emailAddress={this.emailAddress}
                           userObject={this.state.userObjFmServer}
                        ></ConfigBody>
                     ) : (
                        <Redirect to="/401" />
                     )
                  }
               />
               <Route exact path="/401" component={FourOOnePage}></Route>
               <Route exact path="/404" component={FourOFourPage}></Route>
               <Redirect to="/404" />
            </Switch>
         </Router>
      );
   }
}

export default MainPage;
