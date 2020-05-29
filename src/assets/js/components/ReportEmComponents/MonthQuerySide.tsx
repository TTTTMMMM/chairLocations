import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class MonthQuerySide extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getMonthQueryContent = this.getMonthQueryContent.bind(this);
   }

   getMonthQueryContent() {
      return (
         <>
            <div style={divFlexCol}>
               <div>Month Query-side Content</div>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getMonthQueryContent()}</>;
   }
}

export default MonthQuerySide;
