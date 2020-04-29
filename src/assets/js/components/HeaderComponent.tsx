// Client-side code follows:

import React, { Component } from "react";
import LoginLogout from "./LoginLogout";
// import { aStyling } from "../../styles/reactStyling";
import { Link } from "react-router-dom";
class HeaderComponent extends Component<
   {
      isSignedIn: boolean;
      logout: any;
      photoURL: any;
      auth2: any;
      googleToken: any;
      userObject: any;
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
      userObject: any;
   }) {
      super(props);
      this.state = {};
   }

   componentDidMount() {}

   render() {
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
                        <Link to="/mappinganalytics">Map'em</Link>
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
   }
}

export default HeaderComponent;
