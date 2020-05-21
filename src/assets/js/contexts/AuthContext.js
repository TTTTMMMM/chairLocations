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

   // The values object below holds all the properties/data that is shared with the consumers
   // The consumers will destructure the this.context object to obtain access to the individual properties
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

// Boilerplate for context API:
//  1. create the Context Component (this file)
//      a) create the properties you want to share across the app
//      b) create the functions that will modify the properties
//      c) in the render() function, create the <AuthContext.Provider> component,
//         making sure to sandwich  (this.props.children) between the beginning
//         and end tags; also put all the properties and functions in the value object
//  2. Put the context provider in the appropriate place in the component tree
//     All the components under the context provider (known as consumers) will
//     be able to use the Context Provider
//  3. In the consumers:
//      a) import the context file
//      b) after the constructor, static contextType = AuthContext;
//      c) access all the properties in the context by destructuring the this.context object
//        (e.g., const { setAuth2, setIsSignedIn } = this.context; gets access to those
//        two properties (which happnen to be functions, which can be used to change the props)
