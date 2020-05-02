import React, { Component } from "react";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import { Roles } from "../../misc/chairLocTypes";
import ConfigContainer from "../ConfigContainer";

class BodyConfig extends Component<{
   auth2: any;
   loggedInWithGoogle: boolean;
   googleToken: any;
   emailAddress: any;
   userObject: UserObj;
}> {
   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: any;
   }) {
      super(props);
      this.getAppBodyContent = this.getAppBodyContent.bind(this);
   }

   getAppBodyContent() {
      if (!this.props.loggedInWithGoogle) {
         return <h3>Not Authorized</h3>;
      } else if (
         this.props.loggedInWithGoogle &&
         this.props.userObject.role === Roles.admin
      ) {
         return (
            <ConfigContainer>
               loggedInWithGoogle={this.props.loggedInWithGoogle}
               auth2={this.props.auth2}
               idToken={this.props.googleToken}
               loggedInToFirebase={this.state.isLoggedInToFirebase!}
               userObject={this.props.userObject}
            </ConfigContainer>
         );
      } else if (
         this.props.loggedInWithGoogle &&
         this.props.userObject.role === Roles.notloggedin
      ) {
         return <h3>Not Authorized</h3>;
      } else {
         window.location.href = "/401";
         return <h3>Not Auhtorized</h3>;
      }
   }
   render() {
      return <>{this.getAppBodyContent()}</>;
   }
}

export default BodyConfig;
