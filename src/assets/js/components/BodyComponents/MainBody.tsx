import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../../../styles/index.css";
import { Roles } from "../../misc/chairLocTypes";
import { AuthContext } from "../../contexts/AuthContext";

class MainBody extends Component<{}> {
   constructor(props: {}) {
      super(props);
   }
   static contextType = AuthContext;

   getMainBodyContent() {
      const { userObjFmServer } = this.context;
      switch (userObjFmServer.role) {
         case Roles.notloggedin:
            return <img src={"../../../images/cherry.jpeg"} />;
            break;
         case Roles.maintenance:
            return <Redirect to="/maintenance" />;
            break;
         case Roles.lurker:
            return <Redirect to="/mapping/bychair" />;
            break;
         case Roles.uploader:
            return <Redirect to="/upload" />;
            break;
         case Roles.admin:
            return <Redirect to="/upload" />;
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
