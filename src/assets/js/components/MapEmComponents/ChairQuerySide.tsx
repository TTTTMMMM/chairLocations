import React, { Component } from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../../configs/firebaseInit";

import { divFlexCol } from "../../../styles/reactStyling";
import "../../../styles/index.css";
class ChairQuerySide extends Component<
   { loggedInToFirebase: boolean },
   {
      sourceChair: Array<string>;
      alreadyGotInfo: boolean;
   }
> {
   chairCollection: any;
   private chairInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();

   constructor(props: { loggedInToFirebase: boolean }) {
      super(props);
      this.getChairQueryContent = this.getChairQueryContent.bind(this);
      this.chairCollection = "";
      this.enterButtonClicked = this.enterButtonClicked.bind(this);
      this.state = {
         sourceChair: [],
         alreadyGotInfo: false,
      };
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
                     placeHolder={"Enter a Beach"}
                     source={this.state.sourceChair}
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
      let chairAsset: any = this.chairInput.current!.val();
      console.log(`chairAsset: ${chairAsset}`);
      // this.props.myPanel.current!.append(
      //    `<p style="color:#FF1493; font-size:11px;"> ${additionalPropVals.STATE}, ${additionalPropVals.BEACH}, ${additionalPropVals.RENTALAGENT}</p>`
      // );
   }
}

export default ChairQuerySide;
