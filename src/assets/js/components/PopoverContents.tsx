import * as React from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import additionalHeaders from "../configs/additionalTableHeaders";
import { statesArray } from "../configs/additionalTableHeaders";
import { AdditionalPropsType } from "../misc/chairLocTypes";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../configs/firebaseInit";

class PopoverContents extends React.PureComponent<
   {
      myPanel: any;
      additionalPropsPopover: any;
      callbackFromCleanAndLoadFiles: any; // this is the function in the parent component to callback with the values entered for STATE, BEACH and RENTALAGENT
      loggedInToFirebase: boolean;
      asset: string;
   },
   {
      sourceState: Array<string>;
      sourceBeach: Array<string>;
      sourceRentalAgent: Array<string>;
      alreadyGotInfo: boolean;
   }
> {
   beachesCollection: any;
   private stateInput = React.createRef<JqxInput>();
   private beachInput = React.createRef<JqxInput>();
   private rentalAgentInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();

   constructor(props: {
      myPanel: any;
      additionalPropsPopover: any;
      callbackFromCleanAndLoadFiles: any;
      loggedInToFirebase: boolean;
      asset: string;
   }) {
      super(props);
      this.beachesCollection = "";
      this.enterButtonClicked = this.enterButtonClicked.bind(this);
      this.state = {
         sourceState: [...statesArray],
         sourceBeach: [],
         sourceRentalAgent: [],
         alreadyGotInfo: false,
      };
   }

   getBeachAndRentalInfo() {
      let sourceRentalAgent: Array<string> = [];
      let sourceBeach: Array<string> = [];
      this.beachesCollection = firebase.firestore().collection("beaches");
      this.beachesCollection
         .get()
         .then((snapshot: any) => {
            snapshot.forEach((doc: any) => {
               sourceBeach.push(doc.data().beach);
               sourceRentalAgent.push(doc.data().rentalagent);
            });
            this.setState({ sourceBeach: [...new Set(sourceBeach)] });
            this.setState({
               sourceRentalAgent: [...new Set(sourceRentalAgent)],
            });
            this.setState({ alreadyGotInfo: true });
         })
         .catch((err: any) => {
            console.log("C0045: Error getting rental/beach documents", err);
         });
   }

   componentDidMount() {}

   render() {
      if (this.props.loggedInToFirebase && !this.state.alreadyGotInfo) {
         this.getBeachAndRentalInfo();
      }
      return (
         <div className="popovercontents">
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
                  {additionalHeaders[3]}
               </label>
               <JqxInput
                  ref={this.stateInput}
                  width={170}
                  height={20}
                  placeHolder={"Enter a State"}
                  source={this.state.sourceState}
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
                  {additionalHeaders[4]}
               </label>
               <JqxInput
                  ref={this.beachInput}
                  width={170}
                  height={20}
                  placeHolder={"Enter a Beach"}
                  source={this.state.sourceBeach}
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
                  {additionalHeaders[5]}
               </label>
               <JqxInput
                  ref={this.rentalAgentInput}
                  width={200}
                  height={20}
                  placeHolder={"Enter a Rental Agent"}
                  source={this.state.sourceRentalAgent}
                  theme={"fresh"}
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
               }}
            >
               Append Deployed Location Information
            </JqxButton>
         </div>
      );
   }

   private enterButtonClicked() {
      let dsv: any = this.stateInput.current!.val();
      let dbv: any = this.beachInput.current!.val();
      let rav: any = this.rentalAgentInput.current!.val();

      let additionalPropVals: AdditionalPropsType = {};
      additionalPropVals.STATE = dsv;
      additionalPropVals.BEACH = dbv;
      additionalPropVals.RENTALAGENT = rav;
      this.props.myPanel.current!.append(
         `<p style="color:#FF1493; font-size:11px;"> ${additionalPropVals.STATE}, ${additionalPropVals.BEACH}, ${additionalPropVals.RENTALAGENT}</p>`
      );
      this.props.callbackFromCleanAndLoadFiles(additionalPropVals);
   }
}

export default PopoverContents;
