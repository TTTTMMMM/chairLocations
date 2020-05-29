import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";

import ShowDistanceReport from "./ShowDistanceReport";
import { WeekReportRangeQO, CallingFrom } from "../../misc/chairLocTypes";

class WeekResultsSide extends Component<{
   wrrqo: WeekReportRangeQO;
   myPanel: any;
}> {
   constructor(props: { wrrqo: WeekReportRangeQO; myPanel: any }) {
      super(props);
      this.getWeekResultsContent = this.getWeekResultsContent.bind(this);
   }

   getWeekResultsContent() {
      if (this.props.wrrqo.assets.length > 0) {
         return (
            <div style={divFlexCol}>
               <ShowDistanceReport
                  myPanel={this.props.myPanel}
                  assets={this.props.wrrqo.assets}
                  range={this.props.wrrqo.range}
                  callingFrom={CallingFrom.weekResultsSide}
               ></ShowDistanceReport>
            </div>
         );
      }
      return (
         <h4>
            Select a week using the calendar widget to see movement for all
            chairs.
         </h4>
      );
   }
   render() {
      return <>{this.getWeekResultsContent()}</>;
   }
}

export default WeekResultsSide;
