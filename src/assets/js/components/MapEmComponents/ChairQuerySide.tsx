import React, { Component } from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxCalendar, {
   ICalendarProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxcalendar";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../../configs/firebaseInit";

import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import { months } from "../../misc/months";

interface MyState extends ICalendarProps {
   sourceChair: Array<string>;
   alreadyGotInfo: boolean;
   // calendarValue: any;
}
class ChairQuerySide extends Component<
   { loggedInToFirebase: boolean },
   MyState
> {
   chairCollection: any;
   private chairInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();
   private myCalendar = React.createRef<JqxCalendar>();
   private myPanel = React.createRef<JqxPanel>();
   private clearConsoleButton = React.createRef<JqxButton>();

   constructor(props: { loggedInToFirebase: boolean }) {
      super(props);
      this.getChairQueryContent = this.getChairQueryContent.bind(this);
      this.chairCollection = "";
      this.enterButtonClicked = this.enterButtonClicked.bind(this);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );

      this.state = {
         sourceChair: [],
         alreadyGotInfo: false,
      };
   }

   public componentDidMount() {
      const d1 = new Date();
      let fullYear = d1.getFullYear();
      let currMonth = d1.getMonth();
      let currDay = d1.getDate();
      let date1 = new Date(fullYear, currMonth, currDay);
      const d2 = new Date();
      d2.setDate(date1.getDate() - 6);
      let dd2 = new Date(d2);
      let date2 = new Date(dd2.getFullYear(), dd2.getMonth(), dd2.getDate());
      this.myCalendar.current!.setRange(date1, date2);
      this.myCalendar.current!.setMinDate(new Date("January 1, 2020"));
      this.myCalendar.current!.setMaxDate(new Date());
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
                     Chair
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
                  theme={"fresh"}
                  width={270}
                  height={270}
               />
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
                  }}
               >
                  Query for Chair Data
               </JqxButton>
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
                  >
                     Clear Console
                  </JqxButton>
               </div>
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
      if (chairAsset.length <= 5) {
         this.myPanel.current!.append(
            `<p style="color: red; font-size:15px;"> Choose a chair from dropdown list.</p>`
         );
      } else {
         let range: any = this.myCalendar.current!.getRange();
         let rangeFrom: Date = range.from;
         let rangeTo: Date = range.to;
         let fromYear = rangeFrom.getFullYear();
         let toYear = rangeTo.getFullYear();
         let fromMonth = rangeFrom.getMonth();
         let toMonth = rangeTo.getMonth();
         let fromDate = rangeFrom.getDate();
         let toDate = rangeTo.getDate();
         let fromString = `${months[fromMonth]} ${fromDate}, ${fromYear}`;
         let toString = `${months[toMonth]} ${toDate}, ${toYear}`;
         this.myPanel.current!.append(
            `<p style="color:#152811; font-size:12px;"> ${chairAsset} ${fromString} -- ${toString}</p>`
         );
      }
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default ChairQuerySide;

// value={this.state.calendarValue}
