import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class ChairResultsSide extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getChairResultsContent = this.getChairResultsContent.bind(this);
   }

   getChairResultsContent() {
      return (
         <>
            <div style={divFlexCol}>
               <div>Chair Results-side Content</div>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getChairResultsContent()}</>;
   }
}

export default ChairResultsSide;
