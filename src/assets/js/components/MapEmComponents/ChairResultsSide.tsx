import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";

import ShowChairData from "../ShowChairData";
import { AssetRangeQO, CallingFrom } from "../../misc/chairLocTypes";
class ChairResultsSide extends Component<{
   loggedInToFirebase: boolean;
   arqo: AssetRangeQO;
   myPanel: any;
}> {
   constructor(props: {
      loggedInToFirebase: boolean;
      arqo: AssetRangeQO;
      myPanel: any;
   }) {
      super(props);
      this.getChairResultsContent = this.getChairResultsContent.bind(this);
   }

   getChairResultsContent() {
      if (typeof this.props.arqo.asset != "undefined") {
         return (
            <div style={divFlexCol}>
               <ShowChairData
                  loggedInToFirebase={this.props.loggedInToFirebase}
                  myPanel={this.props.myPanel}
                  asset={this.props.arqo.asset}
                  range={this.props.arqo.range}
                  callingFrom={CallingFrom.chairResultsSide}
               ></ShowChairData>
            </div>
         );
      }
      return <h4>Query for chair and time to see results.</h4>;
   }
   render() {
      return <>{this.getChairResultsContent()}</>;
   }
}

export default ChairResultsSide;
