import React, { Component } from "react";
// import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import { Roles } from "../../misc/chairLocTypes";
import BodyMappingAnalytics from "./BodyMappingAnalytics";
import BodyUpload from "./BodyUpload";
import BodyMaintenance from "./BodyMaintenance";

class BodyMain extends Component<{
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
      this.getMainBodyContent = this.getMainBodyContent.bind(this);
   }

   getMainBodyContent() {
      if (!this.props.loggedInWithGoogle) {
         return <img src={"../../../images/cherry.jpeg"} />;
      } else if (
         this.props.loggedInWithGoogle &&
         this.props.userObject.role === Roles.admin
      ) {
         return (
            <BodyMappingAnalytics
               auth2={this.props.auth2}
               loggedInWithGoogle={this.props.loggedInWithGoogle}
               googleToken={this.props.googleToken}
               emailAddress={this.props.emailAddress}
               userObject={this.props.userObject}
            ></BodyMappingAnalytics>
         );
      } else if (
         this.props.loggedInWithGoogle &&
         this.props.userObject.role === Roles.uploader
      ) {
         return (
            <BodyUpload
               auth2={this.props.auth2}
               loggedInWithGoogle={this.props.loggedInWithGoogle}
               googleToken={this.props.googleToken}
               emailAddress={this.props.emailAddress}
               userObject={this.props.userObject}
            ></BodyUpload>
         );
      } else if (
         this.props.loggedInWithGoogle &&
         this.props.userObject.role === Roles.lurker
      ) {
         return (
            <BodyMappingAnalytics
               auth2={this.props.auth2}
               loggedInWithGoogle={this.props.loggedInWithGoogle}
               googleToken={this.props.googleToken}
               emailAddress={this.props.emailAddress}
               userObject={this.props.userObject}
            ></BodyMappingAnalytics>
         );
      } else if (
         this.props.loggedInWithGoogle &&
         this.props.userObject.role === Roles.maintenance
      ) {
         return (
            <BodyMaintenance
               auth2={this.props.auth2}
               loggedInWithGoogle={this.props.loggedInWithGoogle}
               googleToken={this.props.googleToken}
               emailAddress={this.props.emailAddress}
               userObject={this.props.userObject}
            ></BodyMaintenance>
         );
      } else {
         return <img src={"../../../images/cherry.jpeg"} />;
      }
   }
   render() {
      return <>{this.getMainBodyContent()}</>;
   }
}

export default BodyMain;
