import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import MonthQuerySide from "./MonthQuerySide";
import MonthResultsSide from "./MonthResultsSide";

class GenerateQueryComponent extends Component<{}, {}> {
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
                  <MonthQuerySide></MonthQuerySide>
               </section>
               <section className={"resultsside"} style={resultsSideStyling}>
                  <MonthResultsSide></MonthResultsSide>
               </section>
            </div>
         </>
      );
   }

   render() {
      return <>{this.getRentalAgentQueryBodyContent()}</>;
   }
}

export default GenerateQueryComponent;
