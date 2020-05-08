import React, { Component } from "react";
import { divFlexRow } from "../../styles/reactStyling";
import "../../styles/index.css";
import { UserObj } from "../misc/chairLocTypes";
import BodyMappingSubheader from "./BodyMappingSubheader";
class RentalAgentQueryComponent extends Component<
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
      this.getRentalAgentQueryBodyContent = this.getRentalAgentQueryBodyContent.bind(
         this
      );
   }

   getRentalAgentQueryBodyContent() {
      if (this.props.loggedInWithGoogle) {
         console.log(
            `in RentalAgentQueryComponent,  match [${this.props.match.path}] [${this.props.match.url}]`
         );
         return (
            <>
               <BodyMappingSubheader
                  match={this.props.match}
               ></BodyMappingSubheader>
               <div style={divFlexRow}>RentalAgentQueryComponent</div>
            </>
         );
      } else {
         return <img src={"../../images/cherry.jpeg"} />;
      }
   }
   render() {
      return <>{this.getRentalAgentQueryBodyContent()}</>;
   }
}

export default RentalAgentQueryComponent;
