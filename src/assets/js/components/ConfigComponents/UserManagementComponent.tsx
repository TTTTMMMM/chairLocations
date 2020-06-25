import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import AddDropUser from "./AddDropUser";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class UserManagementComponent extends Component<{}, {}> {
   private clearConsoleButton = React.createRef<JqxButton>();
   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.getUserManagementBodyContent = this.getUserManagementBodyContent.bind(
         this
      );
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.state = {};
   }

   getUserManagementBodyContent() {
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
                  <AddDropUser myPanel={this.myPanel}></AddDropUser>
               </section>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getUserManagementBodyContent()}</>;
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default UserManagementComponent;
