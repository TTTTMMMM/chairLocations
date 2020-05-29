import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";

import ShowDistanceReport from "./ShowDistanceReport";
import { ViewReportRangeQO, CallingFrom } from "../../misc/chairLocTypes";

class ViewResultsSide extends Component<{
   vrrqo: ViewReportRangeQO;
   myPanel: any;
}> {
   constructor(props: { vrrqo: ViewReportRangeQO; myPanel: any }) {
      super(props);
      this.getViewResultsContent = this.getViewResultsContent.bind(this);
   }

   getViewResultsContent() {
      if (this.props.vrrqo.assets.length > 0) {
         return (
            <div style={divFlexCol}>
               <ShowDistanceReport
                  myPanel={this.props.myPanel}
                  assets={this.props.vrrqo.assets}
                  range={this.props.vrrqo.range}
                  callingFrom={CallingFrom.weekResultsSide}
               ></ShowDistanceReport>
            </div>
         );
      }
      return (
         <h4>Select a chair, month and year to see the distance report.</h4>
      );
   }
   render() {
      return <>{this.getViewResultsContent()}</>;
   }
}

export default ViewResultsSide;
