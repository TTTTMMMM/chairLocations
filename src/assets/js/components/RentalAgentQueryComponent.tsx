import React, { Component } from "react";
import { divFlexRow } from "../../styles/reactStyling";
import "../../styles/index.css";
class RentalAgentQueryComponent extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.getRentalAgentQueryBodyContent = this.getRentalAgentQueryBodyContent.bind(
         this
      );
   }

   getRentalAgentQueryBodyContent() {
      return (
         <>
            <div style={divFlexRow}>RentalAgentQueryComponent</div>
         </>
      );
   }

   render() {
      return <>{this.getRentalAgentQueryBodyContent()}</>;
   }
}

export default RentalAgentQueryComponent;
