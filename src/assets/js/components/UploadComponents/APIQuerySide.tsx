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
import getKeptChairHeaders from "../../fetches/getKeptChairHeaders";

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
   keptHeaders: Array<string> = [];
   alreadyCalledTrak4: boolean = false;
   chairDeployedTo: string = "";

   private chairInput = React.createRef<JqxInput>();
   private monthInput = React.createRef<JqxInput>();
   private yearInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();

   static contextType = AuthContext; // it's a law that you must call it contextType!

   constructor(props: { uploadAPIComponentCallback: any; myPanel: any }) {
      super(props);
      this.getAPIQuerySideContent = this.getAPIQuerySideContent.bind(this);
      this.pullFromAPIButtonClicked = this.pullFromAPIButtonClicked.bind(this);

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
                        this.props.myPanel.current!.append(
                           `<p style="color:green; font-size:8.5px;">${element.customerLabel} -> ${this.chairDeployedTo}</p>`
                        );
                     } else {
                        this.props.myPanel.current!.append(
                           `<p style="color:red; font-size:15px;">${element.customerLabel} has not been deployed to a rental agent. This needs to be configured by an admin to proceed!! </p>`
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

   getKeptHeaders() {
      const { auth2, googleToken } = this.context;
      getKeptChairHeaders(auth2, googleToken)
         .then((data: any) => {
            data.forEach((element: any) => {
               this.keptHeaders.push(element.chairHeader);
            });
         })
         .catch((err: any) => {
            console.error(`C0403: ${err}`);
         });
   }

   getAPIQuerySideContent() {
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
                  onClick={this.pullFromAPIButtonClicked}
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
         this.getKeptHeaders();
      }
      return <>{this.getAPIQuerySideContent()}</>;
   }

   private pullFromAPIButtonClicked() {
      let chairAsset: string = this.chairInput.current!.val();
      let pairing: ChairIMEIRentalAgent = { chair: chairAsset, imei: "" };

      let goodChair: boolean = true;
      let notFound = true;
      let tempPairings: Array<ChairIMEIRentalAgent> = [...this.pairings];

      if (chairAsset.length > 5) {
         let i = 0;
         let imei = "";
         let rA = "";
         while (notFound && i < tempPairings.length) {
            if (tempPairings[i].chair === chairAsset) {
               notFound = false;
               imei = tempPairings[i].imei;
               rA = tempPairings[i].rentalAgent!;
            }
            i++;
         }
         if (notFound) {
            goodChair = false;
            this.props.myPanel.current!.append(
               `<p style="color: red ; font-size:14px;">Invalid input for Chair[${chairAsset}]!</p>`
            );
         } else {
            goodChair = true;
            pairing.imei = imei;
            pairing.rentalAgent = rA;
            pairing.rentalAgent;
            tempPairings = [];
            tempPairings.push(pairing);
            this.props.myPanel.current!.append(
               `<p style="color: green ; font-size:9px;">${tempPairings[0].chair} ${tempPairings[0].imei} ${tempPairings[0].rentalAgent}</p>`
            );
         }
      }
      let proceed: boolean = !notFound;
      if (chairAsset.length === 0) {
         proceed = true;
      }
      const thisYear = parseInt(moment().format("YYYY"));
      let month: string = this.monthInput.current!.val();
      let year: number = this.yearInput.current!.val();

      months.includes(month)
         ? (proceed = true && proceed)
         : (proceed = false && proceed);
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
            keptHeaders: this.keptHeaders,
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
