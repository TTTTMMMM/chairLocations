import React, { Component } from "react";
import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import { Roles } from "../../misc/chairLocTypes";

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
            <>
               <div style={divFlexRow}>Body Config Component</div>
            </>
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
