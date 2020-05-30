import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";

import GenerateDistanceReport from "./GenerateDistanceReport";
import { ViewReportRangeQO } from "../../misc/chairLocTypes";

class GenerateResultsSide extends Component<{
   vrrqo: ViewReportRangeQO;
   myPanel: any;
}> {
   constructor(props: { vrrqo: ViewReportRangeQO; myPanel: any }) {
      super(props);
      this.getGenerateResultsContent = this.getGenerateResultsContent.bind(
         this
      );
   }

   getGenerateResultsContent() {
      if (this.props.vrrqo.assets.length > 0) {
         return (
            <div style={divFlexCol}>
               <GenerateDistanceReport
                  myPanel={this.props.myPanel}
                  assets={this.props.vrrqo.assets}
                  range={this.props.vrrqo.range}
               ></GenerateDistanceReport>
            </div>
         );
      }
      return (
         <h4>
            Select a chair, month and year to generate the distance report.
         </h4>
      );
   }
   render() {
      return <>{this.getGenerateResultsContent()}</>;
   }
}

export default GenerateResultsSide;
