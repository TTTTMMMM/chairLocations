import React, { Component } from "react";
// import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import { Roles } from "../../misc/chairLocTypes";
import MappingBody from "./MappingBody";
import BodyUpload from "./UploadBody";
import MaintenanceBody from "./MaintenanceBody";

class MainBody extends Component<{
   match: any;
   auth2: any;
   loggedInWithGoogle: boolean;
   googleToken: any;
   emailAddress: any;
   userObject: UserObj;
}> {
   constructor(props: {
      match: any;
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
      switch (this.props.userObject.role) {
         case Roles.notloggedin:
            return <img src={"../../../images/cherry.jpeg"} />;
            break;
         case Roles.maintenance:
            return (
               <MaintenanceBody
                  auth2={this.props.auth2}
                  loggedInWithGoogle={this.props.loggedInWithGoogle}
                  googleToken={this.props.googleToken}
                  emailAddress={this.props.emailAddress}
                  userObject={this.props.userObject}
               ></MaintenanceBody>
            );
            break;
         case Roles.lurker:
            return (
               <MappingBody
                  match={this.props.match}
                  auth2={this.props.auth2}
                  loggedInWithGoogle={this.props.loggedInWithGoogle}
                  googleToken={this.props.googleToken}
                  emailAddress={this.props.emailAddress}
                  userObject={this.props.userObject}
               ></MappingBody>
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
               <MappingBody
                  match={this.props.match}
                  auth2={this.props.auth2}
                  loggedInWithGoogle={this.props.loggedInWithGoogle}
                  googleToken={this.props.googleToken}
                  emailAddress={this.props.emailAddress}
                  userObject={this.props.userObject}
               ></MappingBody>
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

export default MainBody;
