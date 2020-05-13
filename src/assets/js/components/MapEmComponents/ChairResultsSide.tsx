import React, { Component } from "react";
import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";

import ShowChairData from "../ShowChairData";
import { AssetRangeQO, CallingFrom } from "../../misc/chairLocTypes";
class ChairResultsSide extends Component<
   {
      loggedInToFirebase: boolean;
      arqo: AssetRangeQO;
      myPanel: any;
   },
   { arqo: AssetRangeQO }
> {
   constructor(props: {
      loggedInToFirebase: boolean;
      arqo: AssetRangeQO;
      myPanel: any;
   }) {
      super(props);
      this.getChairResultsContent = this.getChairResultsContent.bind(this);

      this.state = {
         arqo: { asset: "", range: { startDate: "", endDate: "" } },
      };
   }

   public componentDidMount() {}

   getChairResultsContent() {
      if (
         typeof this.props.arqo.asset != "undefined" &&
         this.state.arqo != this.props.arqo
      ) {
         this.setState({ arqo: this.props.arqo });
         return (
            <>
               <div style={divFlexCol}>
                  <ShowChairData
                     loggedInToFirebase={this.props.loggedInToFirebase}
                     myPanel={this.props.myPanel}
                     asset={this.props.arqo.asset}
                     range={this.props.arqo.range}
                     callingFrom={CallingFrom.chairResultsSide}
                  ></ShowChairData>
               </div>
            </>
         );
      } else {
         return <>Chair Results-side Content</>;
      }
   }
   render() {
      return <>{this.getChairResultsContent()}</>;
   }
}

export default ChairResultsSide;
