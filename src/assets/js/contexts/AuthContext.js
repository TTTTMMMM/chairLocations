// https://www.youtube.com/watch?v=WkBXRQfpifc
// https://fettblog.eu/typescript-react/context/
// couldn't get context and typescript to work together -- state wouldn't update

import React, { Component, createContext } from "react";

export const AuthContext = createContext();

export class AuthContextProvider extends Component {
   state = {
      auth2: {},
      isLoggedInToFirebase: false,
      isSignedIn: false,
      googleToken: "dummyValue",
      photoURL: "",
      userObjFmServer: {
         username: "",
         role: "notloggedin",
         canAccess: {
            chairLocsRead: false,
            chairLocsWrite: false,
            maintenance: false,
         },
      },
   };

   setIsSignedIn = (status) => {
      this.setState({ isSignedIn: status });
   };

   setAuth2 = (auth2) => {
      this.setState({ auth2: auth2 });
   };

   setGoogleToken = (token) => {
      this.setState({ googleToken: token });
   };

   setIsLoggedInToFirebase = (status) => {
      this.setState({ isLoggedInToFirebase: status });
   };

   setPhotoURL = (url) => {
      this.setState({ photoURL: url });
   };

   setUserObject = (userObject) => {
      this.setState({
         userObjFmServer: {
            username: userObject.name,
            role: userObject.role,
            canAccess: {
               chairLocsRead: userObject.canAccess.chairLocsRead,
               chairLocsWrite: userObject.canAccess.chairLocsWrite,
               maintenance: userObject.canAccess.maintenance,
            },
         },
      });
   };

   render() {
      return (
         <AuthContext.Provider
            value={{
               ...this.state,
               setIsSignedIn: this.setIsSignedIn,
               setUserObject: this.setUserObject,
               setAuth2: this.setAuth2,
               setGoogleToken: this.setGoogleToken,
               setIsLoggedInToFirebase: this.setIsLoggedInToFirebase,
               setPhotoURL: this.setPhotoURL,
            }}
         >
            {this.props.children}
         </AuthContext.Provider>
      );
   }
}
