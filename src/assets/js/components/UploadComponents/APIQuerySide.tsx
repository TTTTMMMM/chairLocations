import React, { Component } from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import moment from "moment";

import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { RangeObject, APIRangeQO } from "../../misc/chairLocTypes";
import { AuthContext } from "../../contexts/AuthContext";
import { months } from "../../misc/months";

import getAllTrak4Devices from "../../fetches/getAllTrak4Devices";

class ViewQuerySide extends Component<
   {
      apiQueryComponentCallback: any;
      myPanel: any;
   },
   // MyState
   {
      sourceChair: Array<string>;
      sourceMonth: Array<string>;
      sourceYear: Array<string>;
      alreadyGotInfo: boolean;
   }
> {
   chairCollection: any;
   years: Array<string> = [];

   private chairInput = React.createRef<JqxInput>();
   private monthInput = React.createRef<JqxInput>();
   private yearInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();

   static contextType = AuthContext; // it's a law that you must call it contextType!

   constructor(props: { apiQueryComponentCallback: any; myPanel: any }) {
      super(props);
      this.getViewQueryContent = this.getViewQueryContent.bind(this);
      this.chairCollection = "";
      this.pullAPIButtonClicked = this.pullAPIButtonClicked.bind(this);

      this.state = {
         sourceChair: [],
         sourceMonth: [],
         sourceYear: [],
         alreadyGotInfo: false,
      };
   }

   public componentDidMount() {
      this.setState({ sourceMonth: months });

      let year = 2019;
      var now = parseInt(moment().format("YYYY"));
      while (year++ < now) {
         this.years.push(year.toString());
      }
      this.setState({ sourceYear: this.years });
   }

   getChairAssetsInfo() {
      // let sourceChair: Array<string> = [];
      getAllTrak4Devices()
         .then((retVal: any) => {
            const msg = retVal.message;
            this.props.myPanel.current!.append(
               `<p style="font-style: normal; color:blue; font-size:11px;">${msg}</p>`
            );
         })
         .catch((err: any) => {
            this.props.myPanel.current!.append(
               `<p style="font-style: normal; color:red; font-size:12px;">C0028: ${err}</p>`
            );
         });
   }

   getViewQueryContent() {
      return (
         <>
            <div style={divFlexCol}>
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
                     Chair:
                  </label>
                  <JqxInput
                     ref={this.chairInput}
                     width={200}
                     height={20}
                     placeHolder={"Leave Blank for all Chairs"}
                     source={this.state.sourceChair}
                     theme={"fresh"}
                  />
               </div>
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
                     Month:
                  </label>
                  <JqxInput
                     ref={this.monthInput}
                     width={200}
                     height={20}
                     placeHolder={"Choose a month"}
                     source={this.state.sourceMonth}
                     theme={"fresh"}
                  />
               </div>
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
                  <JqxInput
                     ref={this.yearInput}
                     width={200}
                     height={20}
                     items={10}
                     placeHolder={"Choose a year"}
                     source={this.state.sourceYear}
                     theme={"fresh"}
                  />
               </div>
               <JqxButton
                  ref={this.enterButton}
                  onClick={this.pullAPIButtonClicked}
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
                  Pull Geolocation Data
               </JqxButton>
            </div>
         </>
      );
   }

   render() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase && !this.state.alreadyGotInfo) {
         this.getChairAssetsInfo();
      }
      return <>{this.getViewQueryContent()}</>;
   }

   private pullAPIButtonClicked() {
      let chairAsset: string = this.chairInput.current!.val();
      let chairAssetArray: Array<string> = [];

      chairAsset.length > 5
         ? chairAssetArray.push(chairAsset)
         : chairAssetArray.splice(
              0,
              this.state.sourceChair.length,
              ...this.state.sourceChair
           );

      const thisYear = parseInt(moment().format("YYYY"));

      let month: string = this.monthInput.current!.val();
      let year: number = this.yearInput.current!.val();

      let proceed: boolean = false;

      months.includes(month) ? (proceed = true) : (proceed = false);
      year >= 2020 && year <= thisYear
         ? (proceed = proceed && true)
         : (proceed = proceed && false);

      if (proceed) {
         let rangeObj: RangeObject = {
            startDate: `${year}-${month}-01`,
            endDate: `${year}-${month}-31`,
         };
         rangeObj.endDate = rangeObj.endDate.concat("T23:59:59Z");
         let apirqo: APIRangeQO = {
            assets: chairAssetArray,
            range: rangeObj,
         };
         this.props.apiQueryComponentCallback(apirqo);
      } else {
         this.props.myPanel.current!.append(
            `<p style="color: red ; font-size:11px;">Invalid input for month or year.</p>`
         );
      }
   }
}

export default ViewQuerySide;
