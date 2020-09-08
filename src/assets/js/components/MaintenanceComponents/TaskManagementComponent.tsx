import React, { Component } from "react";
import { divFlexRowL } from "../../../styles/reactStyling";
import { querySideStyling } from "../../../styles/reactStyling";
import { resultsSideStyling } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import AddDropTasks from "./AddDropTasks";

import JqxDropDownList from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import moment from "moment";

class TaskManagementComponent extends Component<
   {},
   {
      sourceYear: Array<string>;
      queryYear: number;
   }
> {
   private clearConsoleButton = React.createRef<JqxButton>();
   private yearInput = React.createRef<JqxDropDownList>();
   private enterButton = React.createRef<JqxButton>();
   years: Array<string> = [];

   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.getMaintenanceBodyContent = this.getMaintenanceBodyContent.bind(
         this
      );
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.enterButtonClicked = this.enterButtonClicked.bind(this);

      this.state = {
         sourceYear: [],
         queryYear: parseInt(moment().format("YYYY")),
      };
   }

   componentDidMount() {
      let year = 2019;
      var now = parseInt(moment().format("YYYY"));
      while (year++ < now) {
         this.years.push(year.toString());
      }
      this.setState({ sourceYear: this.years });
   }

   getMaintenanceBodyContent() {
      return (
         <>
            <div style={divFlexRowL}>
               <section className={"queryside"} style={querySideStyling}>
                  <div>
                     <div
                        style={{
                           display: "flex",
                           marginBottom: "6px",
                        }}
                     >
                        <label
                           style={{
                              width: "120 px",
                              textAlign: "right",
                              marginTop: "3px",
                              marginRight: "4px",
                           }}
                        >
                           Year:
                        </label>
                        <JqxDropDownList
                           ref={this.yearInput}
                           width={200}
                           height={20}
                           source={this.state.sourceYear}
                           selectedIndex={moment().year() - 2020}
                           theme={"fresh"}
                           dropDownHeight={70}
                        />
                     </div>
                     <JqxButton
                        ref={this.enterButton}
                        onClick={this.enterButtonClicked}
                        width={250}
                        height={25}
                        theme={"fresh"}
                        textPosition={"center"}
                        style={{
                           marginLeft: "10px",
                           paddingTop: "9px",
                           marginBottom: "5px",
                           cursor: "pointer",
                        }}
                     >
                        Manage Tasks
                     </JqxButton>
                  </div>
                  <div>
                     <JqxPanel
                        ref={this.myPanel}
                        width={270}
                        height={350}
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
                  <AddDropTasks
                     myPanel={this.myPanel}
                     queryYear={this.state.queryYear}
                  ></AddDropTasks>
               </section>
            </div>
         </>
      );
   }
   render() {
      return <>{this.getMaintenanceBodyContent()}</>;
   }

   private enterButtonClicked() {
      const thisYear = parseInt(moment().format("YYYY"));
      let year: number = this.yearInput.current!.val();
      if (year >= 2020 && year <= thisYear) {
         this.setState({ queryYear: year });
      } else {
         this.myPanel.current!.append(
            `<p style="color: red ; font-size:11px;">Invalid input for year.</p>`
         );
      }
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default TaskManagementComponent;
