import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import RentalAgentQuerySide from "./RentalAgentQuerySide";
import RentalAgentResultsSide from "./RentalAgentResultsSide";
class RentalAgentQueryComponent extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getRentalAgentQueryBodyContent = this.getRentalAgentQueryBodyContent.bind(
         this
      );
   }

   getRentalAgentQueryBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
                  <RentalAgentQuerySide></RentalAgentQuerySide>
               </section>
               <section className={"resultsside"} style={resultsSideStyling}>
                  <RentalAgentResultsSide></RentalAgentResultsSide>
               </section>
            </div>
         </>
      );
   }

   render() {
      return <>{this.getRentalAgentQueryBodyContent()}</>;
   }
}

export default RentalAgentQueryComponent;
