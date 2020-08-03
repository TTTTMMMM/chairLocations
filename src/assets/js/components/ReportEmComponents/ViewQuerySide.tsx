import React, { Component } from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxDropDownList from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import moment from "moment";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { RangeObject, ViewReportRangeQO } from "../../misc/chairLocTypes";
import { AuthContext } from "../../contexts/AuthContext";
import { months } from "../../misc/months";

class ViewQuerySide extends Component<
   {
      viewQueryComponentCallback: any;
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
   private monthInput = React.createRef<JqxDropDownList>();
   private yearInput = React.createRef<JqxDropDownList>();
   private enterButton = React.createRef<JqxButton>();

   static contextType = AuthContext; // it's a law that you must call it contextType!

   constructor(props: { viewQueryComponentCallback: any; myPanel: any }) {
      super(props);
      this.getViewQueryContent = this.getViewQueryContent.bind(this);
      this.chairCollection = "";
      this.enterButtonClicked = this.enterButtonClicked.bind(this);

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
      let sourceChair: Array<string> = [];

      this.chairCollection = firebase
         .firestore()
         .collection("uniqueAssetLabels");
      this.chairCollection
         .get()
         .then((snapshot: any) => {
            snapshot.forEach((doc: any) => {
               sourceChair.push(doc.data().ASSETLABEL);
            });
            this.setState({ sourceChair: [...new Set(sourceChair)] });
            this.setState({ alreadyGotInfo: true });
         })
         .catch((err: any) => {
            console.log(
               "C0135: Error getting chairs documents from 'uniqueAssetLabels'",
               err
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
                  <JqxDropDownList
                     ref={this.monthInput}
                     width={200}
                     height={20}
                     source={this.state.sourceMonth}
                     selectedIndex={moment().month()}
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
                  View Distance Report
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

   private enterButtonClicked() {
      let chairAsset: string = this.chairInput.current!.val().trim();
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
         let vrrqo: ViewReportRangeQO = {
            assets: chairAssetArray,
            range: rangeObj,
         };
         this.props.viewQueryComponentCallback(vrrqo);
      } else {
         this.props.myPanel.current!.append(
            `<p style="color: red ; font-size:11px;">Invalid input for month or year.</p>`
         );
      }
   }
}

export default ViewQuerySide;
