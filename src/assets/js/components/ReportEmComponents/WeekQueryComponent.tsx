import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import WeekQuerySide from "./WeekQuerySide";
import WeekResultsSide from "./WeekResultsSide";
import { WeekReportRangeQO } from "../../misc/chairLocTypes";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class WeekQueryComponent extends Component<{}, { wrrqo: WeekReportRangeQO }> {
   private clearConsoleButton = React.createRef<JqxButton>();
   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.getWeekQueryBodyContent = this.getWeekQueryBodyContent.bind(this);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.state = {
         wrrqo: {
            assets: [],
            range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         },
      };
   }

   // function callback from WeekQuerySide.tsx, which is used to pass back the assetRangeQueryObject
   myCallBack = (wrrqo: WeekReportRangeQO) => {
      this.setState({ wrrqo: wrrqo });
      this.myPanel.current!.append(
         `<p style="color:#286107 ; font-size:11px;">${wrrqo.assets[0]}</p>`
      );
      this.myPanel.current!.append(
         `<p style="color:#286107 ; font-size:11px;">${wrrqo.range.startDate}</p>`
      );
      this.myPanel.current!.append(
         `<p style="color:#286107 ; font-size:11px;">${wrrqo.range.endDate}</p>`
      );
   };

   getWeekQueryBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
                  <WeekQuerySide
                     weekQueryComponentCallback={this.myCallBack}
                     myPanel={this.myPanel}
                  ></WeekQuerySide>
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
                  <WeekResultsSide
                     wrrqo={this.state.wrrqo}
                     myPanel={this.myPanel}
                  ></WeekResultsSide>
               </section>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getWeekQueryBodyContent()}</>;
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default WeekQueryComponent;
