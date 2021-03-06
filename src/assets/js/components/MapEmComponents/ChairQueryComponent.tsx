import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import ChairQuerySide from "./ChairQuerySide";
import ChairResultsSide from "./ChairResultsSide";
import { AssetRangeQO } from "../../misc/chairLocTypes";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class ChairQueryComponent extends Component<{}, { arqo: AssetRangeQO }> {
   private clearConsoleButton = React.createRef<JqxButton>();
   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.getChairQueryBodyContent = this.getChairQueryBodyContent.bind(this);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.state = {
         arqo: {
            asset: undefined,
            range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         },
      };
   }

   // function callback from ChairQuerySide.tsx, which is used to pass back the assetRangeQueryObject
   myCallBack = (arqo: AssetRangeQO) => {
      this.setState({ arqo: arqo });
   };

   getChairQueryBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
                  <ChairQuerySide
                     chairQueryComponentCallback={this.myCallBack}
                     myPanel={this.myPanel}
                  ></ChairQuerySide>
                  <div>
                     <JqxPanel
                        ref={this.myPanel}
                        width={270}
                        height={250}
                        theme={"fresh"}
                     />
                     <JqxButton
                        ref={this.clearConsoleButton}
                        onClick={this.clearConsoleButtonClicked}
                        width={270}
                        height={30}
                        theme={"fresh"}
                        textPosition={"center"}
                        style={{
                           cursor: "pointer",
                        }}
                     >
                        Clear Console
                     </JqxButton>
                  </div>
               </section>
               <section className={"resultsside"} style={resultsSideStyling}>
                  <ChairResultsSide
                     arqo={this.state.arqo}
                     myPanel={this.myPanel}
                  ></ChairResultsSide>
               </section>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getChairQueryBodyContent()}</>;
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default ChairQueryComponent;

// <ChairResultsSide arqo={this.state.arqo}></ChairResultsSide>
