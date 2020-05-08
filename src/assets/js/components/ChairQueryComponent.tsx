import React, { Component } from "react";
import { divFlexRow } from "../../styles/reactStyling";
import "../../styles/index.css";
class ChairQueryComponent extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getChairQueryBodyContent = this.getChairQueryBodyContent.bind(this);
   }

   getChairQueryBodyContent() {
      return (
         <>
            <div style={divFlexRow}>ChairQueryComponent</div>
         </>
      );
   }
   render() {
      return <>{this.getChairQueryBodyContent()}</>;
   }
}

export default ChairQueryComponent;
