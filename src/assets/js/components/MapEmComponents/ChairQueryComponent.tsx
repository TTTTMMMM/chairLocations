import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import ChairQuerySide from "./ChairQuerySide";
import ChairResultsSide from "./ChairResultsSide";
class ChairQueryComponent extends Component<
   { loggedInToFirebase: boolean },
   {}
> {
   constructor(props: { loggedInToFirebase: boolean }) {
      super(props);
      this.getChairQueryBodyContent = this.getChairQueryBodyContent.bind(this);
   }

   getChairQueryBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
                  <ChairQuerySide
                     loggedInToFirebase={this.props.loggedInToFirebase}
                  ></ChairQuerySide>
               </section>
               <section className={"resultsside"} style={resultsSideStyling}>
                  <ChairResultsSide></ChairResultsSide>
               </section>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getChairQueryBodyContent()}</>;
   }
}

export default ChairQueryComponent;
