import React, { Component } from "react";
import ConfigGear from "./ConfigGear";
import { AuthContext } from "../contexts/AuthContext";

class LoginLogout extends Component<{ logout: any }, {}> {
   constructor(props: any) {
      super(props);
   }
   static contextType = AuthContext;

   render() {
      // uncomment next line to see which icons are available!
      // console.dir(Object.keys(require("@fortawesome/free-solid-svg-icons")));
      const { isSignedIn, userObjFmServer, photoURL } = this.context;

      return isSignedIn ? (
         <section>
            <ConfigGear isAdmin={userObjFmServer.role === "admin"}></ConfigGear>
            <figure onClick={this.props.logout}>
               <img src={photoURL} />
               <figcaption>Logout</figcaption>
            </figure>
         </section>
      ) : (
         <section>
            <button id="loginButton"></button>
         </section>
      );
   }
}

export default LoginLogout;
