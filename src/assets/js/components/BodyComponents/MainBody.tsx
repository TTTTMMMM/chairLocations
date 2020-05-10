import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import { Roles } from "../../misc/chairLocTypes";

class MainBody extends Component<{
   // match: any;
   // auth2: any;
   // loggedInWithGoogle: boolean;
   // googleToken: any;
   // emailAddress: any;
   userObject: UserObj;
}> {
   constructor(props: {
      // match: any;
      // auth2: any;
      // loggedInWithGoogle: boolean;
      // googleToken: any;
      // emailAddress: any;
      userObject: any;
   }) {
      super(props);
   }

   getMainBodyContent() {
      switch (this.props.userObject.role) {
         case Roles.notloggedin:
            return <img src={"../../../images/cherry.jpeg"} />;
            break;
         case Roles.maintenance:
            return <Redirect to="/maintenance" />;
            break;
         case Roles.lurker:
            return <Redirect to="/mapping" />;
            break;
         case Roles.uploader:
            return <Redirect to="/upload" />;
            break;
         case Roles.admin:
            return <Redirect to="/mapping" />;
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
