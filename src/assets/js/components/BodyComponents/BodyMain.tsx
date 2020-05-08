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
   match: any;
}> {
   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: any;
      match: any;
   }) {
      super(props);
      this.getMainBodyContent = this.getMainBodyContent.bind(this);
   }

   getMainBodyContent() {
      switch (this.props.userObject.role) {
         case Roles.notloggedin:
            return <img src={"../../../images/cherry.jpeg"} />;
            break;
         case Roles.maintenance:
            return (
               <BodyMaintenance
                  auth2={this.props.auth2}
                  loggedInWithGoogle={this.props.loggedInWithGoogle}
                  googleToken={this.props.googleToken}
                  emailAddress={this.props.emailAddress}
                  userObject={this.props.userObject}
               ></BodyMaintenance>
            );
            break;
         case Roles.lurker:
            return (
               <BodyMappingAnalytics
                  auth2={this.props.auth2}
                  loggedInWithGoogle={this.props.loggedInWithGoogle}
                  googleToken={this.props.googleToken}
                  emailAddress={this.props.emailAddress}
                  userObject={this.props.userObject}
                  match={this.props.match}
               ></BodyMappingAnalytics>
            );
            break;
         case Roles.uploader:
            return (
               <BodyUpload
                  auth2={this.props.auth2}
                  loggedInWithGoogle={this.props.loggedInWithGoogle}
                  googleToken={this.props.googleToken}
                  emailAddress={this.props.emailAddress}
                  userObject={this.props.userObject}
               ></BodyUpload>
            );
            break;
         case Roles.admin:
            return (
               <BodyMappingAnalytics
                  auth2={this.props.auth2}
                  loggedInWithGoogle={this.props.loggedInWithGoogle}
                  googleToken={this.props.googleToken}
                  emailAddress={this.props.emailAddress}
                  userObject={this.props.userObject}
                  match={this.props.match}
               ></BodyMappingAnalytics>
            );
            break;
         default:
            return <img src={"../../../images/cherry.jpeg"} />;
      }
   }
   render() {
      return <>{this.getMainBodyContent()}</>;
   }
}

export default BodyMain;
