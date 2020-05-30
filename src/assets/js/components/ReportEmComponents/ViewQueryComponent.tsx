import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import ViewQuerySide from "./ViewQuerySide";
import ViewResultsSide from "./ViewResultsSide";
import { ViewReportRangeQO } from "../../misc/chairLocTypes";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class ViewQueryComponent extends Component<{}, { vrrqo: ViewReportRangeQO }> {
   private clearConsoleButton = React.createRef<JqxButton>();
   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.getViewQueryBodyContent = this.getViewQueryBodyContent.bind(this);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.state = {
         vrrqo: {
            assets: [],
            range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         },
      };
   }

   // function callback from ViewQuerySide.tsx, which is used to pass back the assetRangeQueryObject
   myCallBack = (vrrqo: ViewReportRangeQO) => {
      this.setState({ vrrqo: vrrqo });
      let verbiage: string = "";
      if (vrrqo.assets.length === 1) {
         verbiage = `Viewing distance report for ${vrrqo.assets[0]} for `;
      } else {
         verbiage = `Viewing distance report for ${vrrqo.assets.length} chairs for `;
      }
      const reportPeriod = vrrqo.range.startDate.split("-");
      this.myPanel.current!.append(
         `<p style="color:#286107 ; font-size:12px;">${verbiage} ${reportPeriod[1]} ${reportPeriod[0]}. </p>`
      );
   };

   getViewQueryBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
                  <ViewQuerySide
                     viewQueryComponentCallback={this.myCallBack}
                     myPanel={this.myPanel}
                  ></ViewQuerySide>
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
                  <ViewResultsSide
                     vrrqo={this.state.vrrqo}
                     myPanel={this.myPanel}
                  ></ViewResultsSide>
               </section>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getViewQueryBodyContent()}</>;
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default ViewQueryComponent;
