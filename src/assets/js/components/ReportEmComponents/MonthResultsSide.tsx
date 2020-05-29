import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class MonthResultsSide extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getMonthResultsContent = this.getMonthResultsContent.bind(this);
   }

   getMonthResultsContent() {
      return (
         <>
            <div style={divFlexCol}>
               <div>Month Results-side Content</div>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getMonthResultsContent()}</>;
   }
}

export default MonthResultsSide;
