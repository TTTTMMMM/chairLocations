import React, { Component } from "react";
import { divFlexRow } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import BodyMappingSubheader from "../../components/BodyMappingSubheader";
class BodyMappingAnalytics extends Component<
   {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
      match: any;
   },
   {}
> {
   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
      match: any;
   }) {
      super(props);
      this.getBodyMappingAnalyticsBodyContent = this.getBodyMappingAnalyticsBodyContent.bind(
         this
      );
   }

   getBodyMappingAnalyticsBodyContent() {
      if (this.props.loggedInWithGoogle) {
         console.log(
            `in BodyMappingAnalytics Component,  match [${this.props.match.path}] [${this.props.match.url}]`
         );
         return (
            <>
               <BodyMappingSubheader
                  match={this.props.match}
               ></BodyMappingSubheader>
               <div style={divFlexRow}>Body MappingAnalytics Component</div>
            </>
         );
      } else {
         return <img src={"../../images/cherry.jpeg"} />;
      }
   }
   render() {
      return <>{this.getBodyMappingAnalyticsBodyContent()}</>;
   }
}

export default BodyMappingAnalytics;
