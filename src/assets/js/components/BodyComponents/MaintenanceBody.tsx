import React, { Component } from "react";
import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { AuthContext } from "../../contexts/AuthContext";

class MaintenanceBody extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getMaintenanceBodyContent = this.getMaintenanceBodyContent.bind(
         this
      );
   }
   static contextType = AuthContext;

   getMaintenanceBodyContent() {
      console.log(`         MaintenanceBody, this.context`);
      console.dir(this.context);
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
