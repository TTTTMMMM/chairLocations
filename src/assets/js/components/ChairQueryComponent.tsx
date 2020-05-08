import React, { Component } from "react";
import { divFlexRow } from "../../styles/reactStyling";
import "../../styles/index.css";
import { UserObj } from "../misc/chairLocTypes";
import BodyMappingSubheader from "./BodyMappingSubheader";
class ChairQueryComponent extends Component<
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
      this.getChairQueryBodyContent = this.getChairQueryBodyContent.bind(this);
   }

   getChairQueryBodyContent() {
      if (this.props.loggedInWithGoogle) {
         console.log(
            `in ChairQueryComponent,  match [${this.props.match.path}] [${this.props.match.url}]`
         );
         return (
            <>
               <BodyMappingSubheader
                  match={this.props.match}
               ></BodyMappingSubheader>
               <div style={divFlexRow}>ChairQueryComponent</div>
            </>
         );
      } else {
         return <img src={"../../images/cherry.jpeg"} />;
      }
   }
   render() {
      return <>{this.getChairQueryBodyContent()}</>;
   }
}

export default ChairQueryComponent;
