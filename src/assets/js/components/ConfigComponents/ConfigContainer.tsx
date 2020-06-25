import React, { Component } from "react";
import AddDropUser from "./AddDropUser";
import ShowBeaches from "./AddDropBeaches";
// @ts-ignore
import { flexColContainer } from "../../../styles/reactStyling";
// @ts-ignore
import { flexRowContainer } from "../../../styles/reactStyling";

import { flexRowSplit } from "../../../styles/reactStyling";
import { divFlexRow } from "../../../styles/reactStyling";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

class ConfigContainer extends Component<{}, {}> {
   private myPanel = React.createRef<JqxPanel>();
   private clearConsoleButton = React.createRef<JqxButton>();

   constructor(props: {}) {
      super(props);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
   }

   render() {
      return (
         <>
            <div style={divFlexRow}>
               <div style={flexColContainer} className={"configContainerDiv"}>
                  <AddDropUser myPanel={this.myPanel}></AddDropUser>
                  <div style={flexRowSplit}></div>
                  <JqxPanel
                     ref={this.myPanel}
                     width={325}
                     height={150}
                     theme={"fresh"}
                  />
                  <JqxButton
                     ref={this.clearConsoleButton}
                     onClick={this.clearConsoleButtonClicked}
                     width={325}
                     height={30}
                     theme={"fresh"}
                     textPosition={"center"}
                  >
                     Clear Console
                  </JqxButton>
               </div>
               <div style={flexRowSplit}></div>
               <div style={divFlexRow} className={"configContainerDiv"}>
                  <ShowBeaches myPanel={this.myPanel}></ShowBeaches>
               </div>
            </div>
         </>
      );
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default ConfigContainer;
