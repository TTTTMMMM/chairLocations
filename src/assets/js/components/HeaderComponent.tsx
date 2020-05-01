// Client-side code follows:

import React, { Component } from "react";
import LoginLogout from "./LoginLogout";
import { Link } from "react-router-dom";
import { UserObj } from "../misc/chairLocTypes";
import { Roles } from "../misc/chairLocTypes";

class HeaderComponent extends Component<
   {
      isSignedIn: boolean;
      logout: any;
      photoURL: any;
      auth2: any;
      googleToken: any;
      userObject: UserObj;
   },
   {}
> {
   // private myNotification = React.createRef<JqxNotification>();

   constructor(props: {
      isSignedIn: boolean;
      logout: any;
      photoURL: any;
      auth2: any;
      googleToken: any;
      userObject: UserObj;
   }) {
      super(props);
      this.state = {};
      this.getHeader = this.getHeader.bind(this);
   }

   componentDidMount() {}

   getHeader() {
      switch (this.props.userObject.role) {
         case Roles.notloggedin:
            return (
               <header>
                  <section></section>
                  <section></section>
                  <LoginLogout
                     isSignedIn={this.props.isSignedIn}
                     logout={this.props.logout}
                     photoURL={this.props.photoURL}
                     auth2={this.props.auth2}
                     idToken={this.props.googleToken}
                     userObject={this.props.userObject}
                  ></LoginLogout>
               </header>
            );
            break;
         case Roles.maintenance:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <Link to="/maintenance">Maintenance</Link>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout
                     isSignedIn={this.props.isSignedIn}
                     logout={this.props.logout}
                     photoURL={this.props.photoURL}
                     auth2={this.props.auth2}
                     idToken={this.props.googleToken}
                     userObject={this.props.userObject}
                  ></LoginLogout>
               </header>
            );
            break;
         case Roles.lurker:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <Link to="/mapping">Map'em</Link>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout
                     isSignedIn={this.props.isSignedIn}
                     logout={this.props.logout}
                     photoURL={this.props.photoURL}
                     auth2={this.props.auth2}
                     idToken={this.props.googleToken}
                     userObject={this.props.userObject}
                  ></LoginLogout>
               </header>
            );
            break;
         case Roles.uploader:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <Link to="/upload">Upload</Link>
                           </li>
                           <li>
                              <Link to="/mapping">Map'em</Link>
                           </li>
                           <li>
                              <Link to="/maintenance">Maintenance</Link>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout
                     isSignedIn={this.props.isSignedIn}
                     logout={this.props.logout}
                     photoURL={this.props.photoURL}
                     auth2={this.props.auth2}
                     idToken={this.props.googleToken}
                     userObject={this.props.userObject}
                  ></LoginLogout>
               </header>
            );
            break;
         case Roles.admin:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <Link to="/upload">Upload</Link>
                           </li>
                           <li>
                              <Link to="/mapping">Map'em</Link>
                           </li>
                           <li>
                              <Link to="/maintenance">Maintenance</Link>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout
                     isSignedIn={this.props.isSignedIn}
                     logout={this.props.logout}
                     photoURL={this.props.photoURL}
                     auth2={this.props.auth2}
                     idToken={this.props.googleToken}
                     userObject={this.props.userObject}
                  ></LoginLogout>
               </header>
            );
            break;
         default:
            return (
               <header>
                  <section></section>
                  <section></section>
                  <LoginLogout
                     isSignedIn={this.props.isSignedIn}
                     logout={this.props.logout}
                     photoURL={this.props.photoURL}
                     auth2={this.props.auth2}
                     idToken={this.props.googleToken}
                     userObject={this.props.userObject}
                  ></LoginLogout>
               </header>
            );
      }
   }

   render() {
      return <>{this.getHeader()}</>;
   }
}

export default HeaderComponent;
