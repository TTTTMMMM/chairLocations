import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import APIQuerySide from "./APIQuerySide";
import APIResultsSide from "./APIResultsSide";
import { APIRangeQO } from "../../misc/chairLocTypes";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class UploadAPIComponent extends Component<{}, { apirqo: APIRangeQO }> {
   private clearConsoleButton = React.createRef<JqxButton>();
   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.getUploadAPIBodyContent = this.getUploadAPIBodyContent.bind(this);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.state = {
         apirqo: {
            pairings: [],
            range: { startDate: "2099-01-01", endDate: "2099-12-31" },
            keptHeaders: [],
         },
      };
   }

   // function callback from ViewQuerySide.tsx, which is used to pass back the assetRangeQueryObject
   myCallBack = (apirqo: APIRangeQO) => {
      this.setState({ apirqo: apirqo });
      let verbiage: string = "";
      if (apirqo.pairings.length === 1) {
         verbiage = `Pulling geolocation data for ${apirqo.pairings[0].chair} between `;
      } else {
         verbiage = `Pulling geolocation data for ${apirqo.pairings.length} chairs between `;
      }
      this.myPanel.current!.append(
         `<p style="color:#7713AD ; font-size:12px;">${verbiage} ${apirqo.range.startDate} to ${apirqo.range.endDate} </p>`
      );
   };

   getUploadAPIBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
                  <APIQuerySide
                     uploadAPIComponentCallback={this.myCallBack}
                     myPanel={this.myPanel}
                  ></APIQuerySide>
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
                  <APIResultsSide
                     apirqo={this.state.apirqo}
                     myPanel={this.myPanel}
                  ></APIResultsSide>
               </section>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getUploadAPIBodyContent()}</>;
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default UploadAPIComponent;
