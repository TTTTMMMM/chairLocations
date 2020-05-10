import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class RentalAgentQuerySide extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getRentalAgentQueryContent = this.getRentalAgentQueryContent.bind(
         this
      );
   }

   getRentalAgentQueryContent() {
      return (
         <>
            <div style={divFlexCol}>
               <div>RentalAgent Query-side Content</div>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getRentalAgentQueryContent()}</>;
   }
}

export default RentalAgentQuerySide;
