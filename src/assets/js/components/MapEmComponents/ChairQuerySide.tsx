import React, { Component } from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxCalendar, {
   ICalendarProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxcalendar";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import moment from "moment";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

import { divFlexCol } from "../../../styles/reactStyling";
import { divFlexRowLazyMan } from "../../../styles/reactStyling";
import { fieldsetRangePicker } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { RangeObject, AssetRangeQO } from "../../misc/chairLocTypes";

interface MyState extends ICalendarProps {
   sourceChair: Array<string>;
   alreadyGotInfo: boolean;
}
class ChairQuerySide extends Component<
   {
      loggedInToFirebase: boolean;
      chairQueryComponentCallback: any;
      myPanel: any;
   },
   MyState
> {
   chairCollection: any;
   private chairInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();
   private myCalendar = React.createRef<JqxCalendar>();

   private thisWeek = React.createRef<JqxButton>();
   private sinceLastWeek = React.createRef<JqxButton>();
   private lastWeek = React.createRef<JqxButton>();
   private last2Weeks = React.createRef<JqxButton>();

   private thisMonth = React.createRef<JqxButton>();
   private lastMonth = React.createRef<JqxButton>();
   private last2Months = React.createRef<JqxButton>();
   private last3Months = React.createRef<JqxButton>();
   private last4Months = React.createRef<JqxButton>();

   private thisYear = React.createRef<JqxButton>();
   private lastYear = React.createRef<JqxButton>();

   constructor(props: {
      loggedInToFirebase: boolean;
      chairQueryComponentCallback: any;
      myPanel: any;
   }) {
      super(props);
      this.getChairQueryContent = this.getChairQueryContent.bind(this);
      this.chairCollection = "";
      this.enterButtonClicked = this.enterButtonClicked.bind(this);

      this.thisWeekClicked = this.thisWeekClicked.bind(this);
      this.sinceLastWeekClicked = this.sinceLastWeekClicked.bind(this);
      this.lastWeekClicked = this.lastWeekClicked.bind(this);
      this.last2WeeksClicked = this.last2WeeksClicked.bind(this);

      this.thisMonthClicked = this.thisMonthClicked.bind(this);
      this.lastMonthClicked = this.lastMonthClicked.bind(this);
      this.last2MonthsClicked = this.last2MonthsClicked.bind(this);
      this.last3MonthsClicked = this.last3MonthsClicked.bind(this);
      this.last4MonthsClicked = this.last4MonthsClicked.bind(this);

      this.thisYearClicked = this.thisYearClicked.bind(this);
      this.lastYearClicked = this.lastYearClicked.bind(this);

      this.state = {
         sourceChair: [],
         alreadyGotInfo: false,
      };
   }

   public componentDidMount() {
      let startOf1WeekBack = moment().day(-5).startOf("day");
      let today = moment();
      this.myCalendar.current!.setRange(
         startOf1WeekBack.toDate(),
         today.toDate()
      );
      this.myCalendar.current!.setMinDate(new Date("January 1, 2020"));
      this.myCalendar.current!.setMaxDate(new Date());
      let tempArr: Array<string> = [];
      let tempLabel: string = "";
      const thisMonthStartDate = moment()
         .startOf("month")
         .format("MMM DD YYYY");
      tempArr = thisMonthStartDate.split(" ");
      tempLabel = tempArr[0] + " " + tempArr[2];
      this.thisMonth.current!.val(`${tempLabel}`);
      const lastMonthStartDate = moment()
         .subtract(1, "M")
         .startOf("month")
         .format("MMM DD YYYY");
      tempArr = lastMonthStartDate.split(" ");
      tempLabel = tempArr[0] + " " + tempArr[2];
      this.lastMonth.current!.val(`${tempLabel}`);
      const last2MonthsStartDate = moment()
         .subtract(2, "M")
         .startOf("month")
         .format("MMM DD YYYY");
      tempArr = last2MonthsStartDate.split(" ");
      tempLabel = tempArr[0] + " " + tempArr[2];
      this.last2Months.current!.val(`${tempLabel}`);
      const last3MonthsStartDate = moment()
         .subtract(3, "M")
         .startOf("month")
         .format("MMM DD YYYY");
      tempArr = last3MonthsStartDate.split(" ");
      tempLabel = tempArr[0] + " " + tempArr[2];
      this.last3Months.current!.val(`${tempLabel}`);
      const last4MonthsStartDate = moment()
         .subtract(4, "M")
         .startOf("month")
         .format("MMM DD YYYY");
      tempArr = last4MonthsStartDate.split(" ");
      tempLabel = tempArr[0];
      this.last4Months.current!.val(`${tempLabel}`);
      const lastYearStartDate = moment()
         .subtract(12, "M")
         .startOf("year")
         .format("MMM DD YYYY");
      tempArr = lastYearStartDate.split(" ");
      tempLabel = tempArr[2];
      this.lastYear.current!.val(`${tempLabel}`);
      const thisYearStartDate = moment().startOf("year").format("MMM DD YYYY");
      tempArr = thisYearStartDate.split(" ");
      tempLabel = tempArr[2];
      this.thisYear.current!.val(`${tempLabel}`);
   }

   getChairAssetInfo() {
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
               "C0035: Error getting chairs documents from 'uniqueAssetLabels'",
               err
            );
         });
   }

   getChairQueryContent() {
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
                     width={170}
                     height={20}
                     placeHolder={"Enter a Chair ID"}
                     source={this.state.sourceChair}
                     theme={"fresh"}
                  />
               </div>
               <JqxCalendar
                  ref={this.myCalendar}
                  selectionMode={"range"}
                  showOtherMonthDays={false}
                  theme={"fresh"}
                  width={270}
                  height={270}
               />
               <div className={"lazyManRangePickerEnvelope"} style={divFlexCol}>
                  <fieldset style={fieldsetRangePicker}>
                     <legend>Quick Range Picker</legend>
                     <div className={"lazyManRow1"} style={divFlexRowLazyMan}>
                        <JqxButton
                           ref={this.thisWeek}
                           onClick={this.thisWeekClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           This Week
                        </JqxButton>
                        <JqxButton
                           ref={this.sinceLastWeek}
                           onClick={this.sinceLastWeekClicked}
                           width={40}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           Since LW
                        </JqxButton>
                        <JqxButton
                           ref={this.lastWeek}
                           onClick={this.lastWeekClicked}
                           width={40}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           Last W
                        </JqxButton>
                        <JqxButton
                           ref={this.last2Weeks}
                           onClick={this.last2WeeksClicked}
                           width={40}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           2W Ago
                        </JqxButton>
                        <JqxButton
                           ref={this.last4Months}
                           onClick={this.last4MonthsClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           {"11"}
                        </JqxButton>
                        <JqxButton
                           ref={this.last3Months}
                           onClick={this.last3MonthsClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           222 2222
                        </JqxButton>
                     </div>
                     <div className={"lazyManRow2"} style={divFlexRowLazyMan}>
                        <JqxButton
                           ref={this.last2Months}
                           onClick={this.last2MonthsClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           333 3333
                        </JqxButton>
                        <JqxButton
                           ref={this.lastMonth}
                           onClick={this.lastMonthClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           444 4444
                        </JqxButton>
                        <JqxButton
                           ref={this.thisMonth}
                           onClick={this.thisMonthClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           555 55555
                        </JqxButton>
                        <JqxButton
                           ref={this.thisYear}
                           onClick={this.thisYearClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           {"6666666666666"}
                        </JqxButton>
                        <JqxButton
                           ref={this.lastYear}
                           onClick={this.lastYearClicked}
                           width={45}
                           height={40}
                           theme={"fresh"}
                           textPosition={"center"}
                           style={{
                              margin: "1px",
                              paddingLeft: "-3px",
                              cursor: "pointer",
                           }}
                        >
                           {"7777777777777777"}
                        </JqxButton>
                     </div>
                  </fieldset>
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
                  Query for Chair Data
               </JqxButton>
            </div>
         </>
      );
   }

   render() {
      if (this.props.loggedInToFirebase && !this.state.alreadyGotInfo) {
         this.getChairAssetInfo();
      }
      return <>{this.getChairQueryContent()}</>;
   }

   private enterButtonClicked() {
      let chairAsset: string = this.chairInput.current!.val();
      if (chairAsset.length <= 7) {
         this.props.myPanel.current!.append(
            `<p style="color: red; font-size:15px;"> Choose a chair from dropdown list.</p>`
         );
      } else {
         let range: any = this.myCalendar.current!.getRange();
         let rangeObj: RangeObject = {
            startDate: moment(range.from).format("YYYY-MM-DD"),
            endDate: moment(range.to).format("YYYY-MM-DD"),
         };
         let arqo: AssetRangeQO = { asset: chairAsset, range: rangeObj };
         this.props.chairQueryComponentCallback(arqo);
      }
   }

   private thisWeekClicked() {
      let thisWeekStart = moment().startOf("week");
      let thisWeekEnd = moment();

      this.myCalendar.current!.setRange(
         thisWeekStart.toDate(),
         thisWeekEnd.toDate()
      );
   }

   private sinceLastWeekClicked() {
      let startOfLastWeek = moment().day(-7).startOf("week");
      let thisWeekEnd = moment();
      this.myCalendar.current!.setRange(
         startOfLastWeek.toDate(),
         thisWeekEnd.toDate()
      );
   }

   private lastWeekClicked() {
      let lastWeekStart = moment().day(-7).startOf("week");
      let lastWeekEnd = moment().day(-7).endOf("week");
      this.myCalendar.current!.setRange(
         lastWeekStart.toDate(),
         lastWeekEnd.toDate()
      );
   }

   private last2WeeksClicked() {
      let startOf2WeeksAgo = moment().day(-14).startOf("week");
      let endOf2WeeksAgo = moment().day(-14).endOf("week");
      this.myCalendar.current!.setRange(
         startOf2WeeksAgo.toDate(),
         endOf2WeeksAgo.toDate()
      );
   }

   private thisMonthClicked() {
      let thisMonthStart = moment().startOf("month");
      let thisMonthEnd = moment();
      this.myCalendar.current!.setRange(
         thisMonthStart.toDate(),
         thisMonthEnd.toDate()
      );
   }

   private lastMonthClicked() {
      let startOfLastMonth = moment().subtract(1, "M").startOf("month");
      let endOfLastMonth = moment().subtract(1, "M").endOf("month");
      this.myCalendar.current!.setRange(
         startOfLastMonth.toDate(),
         endOfLastMonth.toDate()
      );
   }

   private last2MonthsClicked() {
      let startOf2MonthsAgo = moment().subtract(2, "M").startOf("month");
      let endOf2MonthsAgo = moment().subtract(2, "M").endOf("month");
      this.myCalendar.current!.setRange(
         startOf2MonthsAgo.toDate(),
         endOf2MonthsAgo.toDate()
      );
   }

   private last3MonthsClicked() {
      let startOf3MonthsAgo = moment().subtract(3, "M").startOf("month");
      let endOf3MonthsAgo = moment().subtract(3, "M").endOf("month");
      this.myCalendar.current!.setRange(
         startOf3MonthsAgo.toDate(),
         endOf3MonthsAgo.toDate()
      );
   }

   private last4MonthsClicked() {
      let startOf4MonthsAgo = moment().subtract(4, "M").startOf("month");
      let endOf4MonthsAgo = moment().subtract(4, "M").endOf("month");
      this.myCalendar.current!.setRange(
         startOf4MonthsAgo.toDate(),
         endOf4MonthsAgo.toDate()
      );
   }

   private thisYearClicked() {
      let startOfYear = moment().startOf("year");
      let endOfYear = moment();
      this.myCalendar.current!.setRange(
         startOfYear.toDate(),
         endOfYear.toDate()
      );
   }

   private lastYearClicked() {
      let lastYearStart = moment().subtract(12, "M").startOf("year");
      let lastYearEnd = moment().subtract(12, "M").endOf("year");
      this.myCalendar.current!.setRange(
         lastYearStart.toDate(),
         lastYearEnd.toDate()
      );
   }
}

export default ChairQuerySide;
