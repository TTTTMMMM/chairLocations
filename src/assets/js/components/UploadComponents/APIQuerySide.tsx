import React, { Component } from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import moment from "moment";

import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
import {
   RangeObject,
   ChairIMEIRentalAgent,
   APIRangeQO,
} from "../../misc/chairLocTypes";
import { AuthContext } from "../../contexts/AuthContext";
import { months, monsMap, numDaysInMonth } from "../../misc/months";

import getAllTrak4Devices from "../../fetches/getAllTrak4Devices";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

class APIQuerySide extends Component<
   {
      uploadAPIComponentCallback: any;
      myPanel: any;
   },
   // MyState
   {
      sourceChair: Array<string>;
      sourceMonth: Array<string>;
      sourceYear: Array<string>;
      // alreadyGotInfo: boolean;
   }
> {
   years: Array<string> = [];
   pairings: Array<ChairIMEIRentalAgent> = [];
   alreadyCalledTrak4: boolean = false;
   chairDeployedTo: string = "";

   private chairInput = React.createRef<JqxInput>();
   private monthInput = React.createRef<JqxInput>();
   private yearInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();

   static contextType = AuthContext; // it's a law that you must call it contextType!

   constructor(props: { uploadAPIComponentCallback: any; myPanel: any }) {
      super(props);
      this.getViewQueryContent = this.getViewQueryContent.bind(this);
      this.pullAPIButtonClicked = this.pullAPIButtonClicked.bind(this);

      this.state = {
         sourceChair: [],
         sourceMonth: [],
         sourceYear: [],
         // alreadyGotInfo: false,
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
      // let chairIMEIObj: ChairIMEI = { chair: "", imei: "" };
      this.pairings = [];
      this.alreadyCalledTrak4 = true;
      getAllTrak4Devices()
         .then((retVal: any) => {
            let assetArray = retVal.data;
            assetArray.forEach((element: any) => {
               sourceChair.push(element.customerLabel);
               // find where each chair is deployed to next
               let chairDeployment = firebase
                  .firestore()
                  .collection("chairDeployments")
                  .doc(element.customerLabel);
               chairDeployment
                  .get()
                  .then((doc: any) => {
                     if (doc.exists) {
                        this.chairDeployedTo = doc.data().rentalagent;
                        this.pairings.push({
                           chair: element.customerLabel,
                           imei: element.imei,
                           rentalAgent: this.chairDeployedTo,
                        });
                     } else {
                        this.props.myPanel.current!.append(
                           `<p style="color:red; font-size:14px;">${element.customerLabel} has not been deployed to a rental agent. This needs to be configured by an admin to proceed. </p>`
                        );
                     }
                  })
                  .catch((err: any) => {
                     console.log("C0745: Error getting chairDeployment", err);
                  });
            });
            this.setState({ sourceChair: [...new Set(sourceChair)] });
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
      if (isLoggedInToFirebase && !this.alreadyCalledTrak4) {
         this.getChairAssetsInfo();
      }
      return <>{this.getViewQueryContent()}</>;
   }

   private pullAPIButtonClicked() {
      let chairAsset: string = this.chairInput.current!.val();
      let pairing: ChairIMEIRentalAgent = { chair: chairAsset, imei: "" };
      let tempPairings: Array<ChairIMEIRentalAgent> = [];
      tempPairings.push(...this.pairings);
      let goodChair: boolean = true;
      let notFound = true;
      if (chairAsset.length > 5) {
         let i = 0;
         let imei = "";
         while (notFound && i < tempPairings.length) {
            if (tempPairings[i].chair === chairAsset) {
               notFound = false;
               imei = tempPairings[i].imei;
            }
            i++;
         }
         if (notFound) {
            goodChair = false;
            this.props.myPanel.current!.append(
               `<p style="color: red ; font-size:11px;">Invalid input for Chair[${chairAsset}].</p>`
            );
         } else {
            goodChair = true;
            pairing.imei = imei;
            tempPairings = [];
            tempPairings.push(pairing);
            this.props.myPanel.current!.append(
               `<p style="color: green ; font-size:11px;">Found pairing: ${tempPairings[0].chair}-${tempPairings[0].imei}.</p>`
            );
         }
      }
      let proceed: boolean = true;

      const thisYear = parseInt(moment().format("YYYY"));
      let month: string = this.monthInput.current!.val();
      let year: number = this.yearInput.current!.val();

      months.includes(month) ? (proceed = true) : (proceed = false);
      year >= 2020 && year <= thisYear
         ? (proceed = proceed && true)
         : (proceed = proceed && false);
      proceed = proceed && goodChair;
      if (proceed) {
         const shortMonth = month.substring(0, 3);
         const monthNum = monsMap.get(shortMonth);
         const numDays = numDaysInMonth.get(month);
         let rangeObj: RangeObject = {
            startDate: `${monthNum}/01/${year} 00:00:00`,
            endDate: `${monthNum}/${numDays}/${year} 23:59:59`,
         };
         let apirqo: APIRangeQO = {
            pairings: tempPairings,
            range: rangeObj,
         };
         this.props.uploadAPIComponentCallback(apirqo);
      } else {
         this.props.myPanel.current!.append(
            `<p style="color: red ; font-size:11px;">Invalid input for chair or month or year.</p>`
         );
      }
   }
}

export default APIQuerySide;
