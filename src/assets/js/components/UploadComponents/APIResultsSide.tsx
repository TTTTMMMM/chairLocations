import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";

import ShowAPIPullStatus from "./ShowAPIPullStatus";

import { APIRangeQO } from "../../misc/chairLocTypes";

class APIResultsSide extends Component<{
   apirqo: APIRangeQO;
   myPanel: any;
}> {
   constructor(props: { apirqo: APIRangeQO; myPanel: any }) {
      super(props);
      this.getAPIResultsContent = this.getAPIResultsContent.bind(this);
   }

   getAPIResultsContent() {
      if (this.props.apirqo.pairings.length > 0) {
         return (
            <div style={divFlexCol}>
               <ShowAPIPullStatus
                  myPanel={this.props.myPanel}
                  pairings={this.props.apirqo.pairings}
                  range={this.props.apirqo.range}
               ></ShowAPIPullStatus>
            </div>
         );
      }
      return (
         <h4>
            Select a chair (leave blank for all chairs), month and year to pull
            geolocation data.
         </h4>
      );
   }
   render() {
      return <>{this.getAPIResultsContent()}</>;
   }
}

export default APIResultsSide;
