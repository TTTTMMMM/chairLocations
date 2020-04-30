import React, { Component } from "react";
import ConfigGear from "./ConfigGear";

// import AddDropUser from "./AddDropUser";

class LoginLogout extends Component<
   {
      isSignedIn: boolean;
      logout: any;
      photoURL: any;
      auth2: any;
      idToken: any;
      userObject: any;
   },
   {}
> {
   constructor(props: any) {
      super(props);
      this.state = {
         isLoggedIn: this.props.isSignedIn,
      };

      this.gearClick = this.gearClick.bind(this);
   }

   render() {
      // console.dir(Object.keys(require("@fortawesome/free-solid-svg-icons")));
      if (typeof this.props.userObject != "undefined") {
         return this.props.isSignedIn ? (
            <section>
               {/* <AddDropUser
                  isAdmin={this.props.userObject.role === "admin"}
                  auth2={this.props.auth2}
                  idToken={this.props.idToken}
               ></AddDropUser>
              */}
               <ConfigGear
                  isAdmin={this.props.userObject.role === "admin"}
                  auth2={this.props.auth2}
                  idToken={this.props.idToken}
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
      } else {
         return (
            <section>
               <button id="loginButton"></button>
            </section>
         );
      }
   }

   gearClick() {
      console.log(`gearClick()`);
   }
}

export default LoginLogout;
