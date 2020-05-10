import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class RentalAgentResultsSide extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getRentalAgentResultsContent = this.getRentalAgentResultsContent.bind(
         this
      );
   }

   getRentalAgentResultsContent() {
      return (
         <>
            <div style={divFlexCol}>
               <div>Rental Agent Results-side Content</div>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getRentalAgentResultsContent()}</>;
   }
}

export default RentalAgentResultsSide;
