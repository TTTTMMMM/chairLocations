import React, { Component } from "react";
import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";

class MaintenanceBody extends Component<
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
      return (
         <>
            <div style={divFlexRow}>Body Maintenance Component</div>
         </>
      );
   }
   render() {
      return <>{this.getMaintenanceBodyContent()}</>;
   }
}

export default MaintenanceBody;
