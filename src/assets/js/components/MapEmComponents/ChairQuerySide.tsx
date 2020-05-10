import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class ChairQuerySide extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getChairQueryContent = this.getChairQueryContent.bind(this);
   }

   getChairQueryContent() {
      return (
         <>
            <div style={divFlexCol}>
               <div>Chair Query-side Content</div>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getChairQueryContent()}</>;
   }
}

export default ChairQuerySide;
