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
import { AuthContext } from "../contexts/AuthContext";

// Note: gapi (Google APIs) are available because I included this line: <script src="https://apis.google.com/js/api.js"></script> in index.html. That's the mystery behind how the gapi calls work without importing them in MainPage.tsx (this file). Also, note that the type definitions for gapi objects can be found in node_modules/@types/gapi.auth2/index.d.ts file.
class MainPage extends Component<{}, {}> {
   auth2!: gapi.auth2.GoogleAuth;
   loggedInPhotoURL: string | undefined;
   emailAddress: string | undefined;
   id_token: any | undefined;

   constructor(props: { match: any }) {
      super(props);

      this.state = {};
      this.logout = this.logout.bind(this);
      this.onSuccess = this.onSuccess.bind(this);
   }

   static contextType = AuthContext; // it's a law that you must call it contextType!

   componentDidMount() {
      // get access to the individual properties in the context object
      // (which is made available after you execute the static line above)
      const { setAuth2, setIsSignedIn } = this.context;
      window.gapi.load("auth2", () => {
         this.auth2 = gapi.auth2.init({
            client_id:
               "702445664854-l75e1o6sni99dcadjbqeqa7pa9lld78p.apps.googleusercontent.com",
         });
         setAuth2(this.auth2);
         this.auth2.then(() => {
            setIsSignedIn(this.auth2!.isSignedIn.get());
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
      const {
         setIsSignedIn,
         setUserObject,
         setGoogleToken,
         setPhotoURL,
      } = this.context;
      this.id_token = googleUser.getAuthResponse(true).id_token;
      setGoogleToken(this.id_token);
      this.loggedInPhotoURL = this.auth2.currentUser
         .get()
         .getBasicProfile()
         .getImageUrl();
      this.emailAddress = this.auth2.currentUser
         .get()
         .getBasicProfile()
         .getEmail();
      getLoggedinUser(this.auth2, this.id_token).then((result: any) => {
         if (result) {
            setIsSignedIn(true);
         }
         setUserObject(result);
         setPhotoURL(this.loggedInPhotoURL);
      });
   }

   onLoginFailed() {
      const { setIsSignedIn } = this.context;
      setIsSignedIn(false);
   }

   logout(e: any) {
      e.preventDefault();
      const {
         setIsSignedIn,
         setUserObject,
         setAuth2,
         setGoogleToken,
      } = this.context;
      this.auth2!.signOut()
         .then(() => {
            setUserObject({
               username: "",
               role: clt.Roles.notloggedin,
               canAccess: {
                  chairLocsRead: false,
                  chairLocsWrite: false,
                  maintenance: false,
               },
            });
            setIsSignedIn(this.auth2!.isSignedIn.get());
            setAuth2({});
            setGoogleToken("dummyValue");
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
      const { isSignedIn, userObjFmServer } = this.context;
      return (
         <Router>
            <HeaderComponent logout={this.logout}></HeaderComponent>
            <Switch>
               <Route
                  exact
                  path="/"
                  render={(props) => <MainBody></MainBody>}
               />
               <Route
                  exact
                  path="/upload"
                  render={(props) =>
                     isSignedIn ? (
                        <UploadBody></UploadBody>
                     ) : (
                        <Redirect to="/" />
                     )
                  }
               />
               <Route
                  path="/mapping"
                  render={(props) =>
                     isSignedIn ? (
                        <MappingBody match={props.match}></MappingBody>
                     ) : (
                        <Redirect to="/" />
                     )
                  }
               />
               <Route
                  exact
                  path="/maintenance"
                  render={(props) =>
                     isSignedIn ? (
                        <MaintenanceBody></MaintenanceBody>
                     ) : (
                        <Redirect to="/" />
                     )
                  }
               />
               <Route
                  exact
                  path="/configuration"
                  render={(match) =>
                     isSignedIn && userObjFmServer.role === clt.Roles.admin ? (
                        <ConfigBody></ConfigBody>
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
