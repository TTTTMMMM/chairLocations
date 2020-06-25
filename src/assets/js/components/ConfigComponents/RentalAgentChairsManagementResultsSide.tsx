import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class RentalAgentChairsManagementResultsSide extends Component<
   {
      myPanel: any;
   },
   {}
> {
   constructor(props: { myPanel: any }) {
      super(props);
      this.getRentalAgentChairsResultsContent = this.getRentalAgentChairsResultsContent.bind(
         this
      );
   }

   getRentalAgentChairsResultsContent() {
      return (
         <>
            <div style={divFlexCol}>
               <div>Rental Agent - Chairs Content Here</div>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getRentalAgentChairsResultsContent()}</>;
   }
}

export default RentalAgentChairsManagementResultsSide;
