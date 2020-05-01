// *****
// important: disable typescript checking of this file in tsconfig.json
// *****
// Client-side code follows:

import React, { Component } from "react";
import "../../styles/index.css";
import HeaderComponent from "../components/HeaderComponent";
import BodyMain from "../components/BodyComponents/BodyMain";
import getLoggedinUser from "../fetches/getLoggedinUser";
import * as clt from "../misc/chairLocTypes";

// Note: gapi (Google APIs) are available because I included this line: <script src="https://apis.google.com/js/api.js"></script> in index.html. That's the mystery behind how the gapi calls work without importing them in App.tsx (this file). Also, note that the type definitions for gapi objects can be found in node_modules/@types/gapi.auth2/index.d.ts file.
class MainPage extends Component<
   {},
   { isSignedIn: boolean; googleToken: any; userObjFmServer: clt.UserObj }
> {
   auth2!: gapi.auth2.GoogleAuth;
   loggedInPhotoURL: string | undefined;
   emailAddress: string | undefined;
   id_token: any | undefined;
   constructor(props: {}) {
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
            window.location.href = "/";
         })
         .catch((err: any) => {
            console.error(`C0016: ${err}`);
         });
   }

   public render() {
      return (
         <div>
            <HeaderComponent
               isSignedIn={this.state.isSignedIn}
               logout={this.logout}
               photoURL={this.loggedInPhotoURL}
               auth2={this.auth2}
               googleToken={this.state.googleToken}
               userObject={this.state.userObjFmServer}
            ></HeaderComponent>
            <BodyMain
               auth2={this.auth2}
               loggedInWithGoogle={this.state.isSignedIn}
               googleToken={this.state.googleToken}
               emailAddress={this.emailAddress}
               userObject={this.state.userObjFmServer}
            ></BodyMain>
         </div>
      );
   }
}

export default MainPage;
