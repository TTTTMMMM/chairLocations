import React, { Component } from "react";
import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
// import { Roles } from "../../misc/chairLocTypes";

class BodyMaintenance extends Component<
   {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
   },
   {}
> {
   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
   }) {
      super(props);
      this.getMaintenanceBodyContent = this.getMaintenanceBodyContent.bind(
         this
      );
   }

   getMaintenanceBodyContent() {
      if (this.props.loggedInWithGoogle) {
         return (
            <>
               <div style={divFlexRow}>Body Maintenance Component</div>
            </>
         );
      } else {
         return <img src={"../../images/cherry.jpeg"} />;
      }
   }
   render() {
      return <>{this.getMaintenanceBodyContent()}</>;
   }
}

export default BodyMaintenance;
