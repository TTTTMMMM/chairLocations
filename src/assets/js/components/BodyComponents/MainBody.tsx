import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../../../styles/index.css";
import { Roles } from "../../misc/chairLocTypes";
import { AuthContext } from "../../contexts/AuthContext";
import CanvasAnimationComponent from "../MainComponents/CanvasAnimationComponent";

class MainBody extends Component<{}> {
   constructor(props: {}) {
      super(props);
   }
   static contextType = AuthContext;

   getMainBodyContent() {
      const { userObjFmServer } = this.context;
      switch (userObjFmServer.role) {
         case Roles.notloggedin:
            return <CanvasAnimationComponent />;
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
            return <CanvasAnimationComponent />;
      }
   }
   render() {
      return <>{this.getMainBodyContent()}</>;
   }
}

export default MainBody;
