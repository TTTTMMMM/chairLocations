import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
// import RentalAgentChairsManagementResultsSide from "./RentalAgentChairsManagementResultsSide";
import AddDropChairs from "./AddDropChairs";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class RentalAgentChairsManagementComponent extends Component<{}, {}> {
   private clearConsoleButton = React.createRef<JqxButton>();
   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.getChairQueryBodyContent = this.getChairQueryBodyContent.bind(this);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.state = {};
   }

   getChairQueryBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
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
                  <AddDropChairs myPanel={this.myPanel}></AddDropChairs>
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

export default RentalAgentChairsManagementComponent;
