import React, { Component } from "react";
import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";

class BodyMappingAnalytics extends Component<
   {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: any;
   },
   {}
> {
   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: any;
   }) {
      super(props);
      this.getAppBodyContent = this.getAppBodyContent.bind(this);
   }

   getAppBodyContent() {
      if (this.props.loggedInWithGoogle) {
         return (
            <>
               <div style={divFlexRow}>Body MappingAnalytics Component</div>
            </>
         );
      } else {
         return <img src={"../../images/cherry.jpeg"} />;
      }
   }
   render() {
      return <>{this.getAppBodyContent()}</>;
   }
}

export default BodyMappingAnalytics;
