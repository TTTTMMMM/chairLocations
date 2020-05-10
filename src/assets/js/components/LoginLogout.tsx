import React, { Component } from "react";
import ConfigGear from "./ConfigGear";
class LoginLogout extends Component<
   {
      isSignedIn: boolean;
      logout: any;
      photoURL: any;
      userObject: any;
   },
   {}
> {
   constructor(props: any) {
      super(props);
      this.state = {
         isLoggedIn: this.props.isSignedIn,
      };
   }

   render() {
      // uncomment next line to see which icons are available!
      // console.dir(Object.keys(require("@fortawesome/free-solid-svg-icons")));
      return this.props.isSignedIn ? (
         <section>
            <ConfigGear
               isAdmin={this.props.userObject.role === "admin"}
            ></ConfigGear>
            <figure onClick={this.props.logout}>
               <img src={this.props.photoURL} />
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
