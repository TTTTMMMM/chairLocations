import React, { Component } from "react";
import * as ReactDOM from "react-dom";

import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxPopover from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpopover";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import readDataRowsOfFile from "./componentHandlers/helpers/readDataRowsOfFile";
import processTableHeadersFromCSVFile from "./componentHandlers/helpers/headers/processTableHeadersFromCSVFile";
import { HeaderMapping } from "../misc/chairLocTypes";
import createFatChairObject from "../components/componentHandlers/helpers/createFatChairObj";

import storeHeadersOnFirebase from "../fetches/storeHeadersOnFirebase";
import getKeptChairHeaders from "../fetches/getKeptChairHeaders";
import storeChairLocsOnFirebase from "../fetches/storeChairLocsOnFirebase";

import addValuesForAdditionalHeaders from "./componentHandlers/helpers/headers/addValuesForAdditionalHeaders";
import ShowChairHeaders from "./ShowChairHeaders";
import ShowChairData from "./ShowChairData";

import PopoverContents from "./PopoverContents";
import { AdditionalPropsType } from "../misc/chairLocTypes";
import { Roles } from "../misc/chairLocTypes";

class CleanAndUploadFiles extends Component<
   {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      userObject: any;
   },
   {
      value: string;
      additionalPropValues: AdditionalPropsType;
      disabledSetAdditionalPropertiesButton: boolean;
      disabledCleanRowsButton: boolean;
      asset: string;
      fileChooserLabel: string;
   }
> {
   private myPanel = React.createRef<JqxPanel>();
   private clearConsoleButton = React.createRef<JqxButton>();
   private addAdditionalButton = React.createRef<JqxButton>();
   private cleanRowsAndUploadlButton = React.createRef<JqxButton>();

   private someDiv = React.createRef<HTMLDivElement>();
   private additionalPropsPopover = React.createRef<JqxPopover>();

   private fileInput: any;
   private extendedFatArray: Array<any> = [];
   private extendedExtendedFatArray: Array<any> = [];
   private tallAndSkinnyArray: Array<any> = [];
   private shortAndSkinnyArray5: Array<any> = [];
   private shortAndSkinnyArray4: Array<any> = [];
   private shortAndSkinnyArray3: Array<any> = [];
   private shortAndSkinnyArray2: Array<any> = [];
   private shortAndSkinnyArray1: Array<any> = [];
   private shortAndSkinnyArray: Array<any> = [];

   constructor(props: {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      userObject: any;
   }) {
      super(props);

      this.fileInput = React.createRef();
      this.fileInputHandler = this.fileInputHandler.bind(this);
      this.clearConsoleButtonClicked = this.clearConsoleButtonClicked.bind(
         this
      );
      this.cleanRowsAndUploadClicked = this.cleanRowsAndUploadClicked.bind(
         this
      );

      this.state = {
         value: "",
         additionalPropValues: {},
         disabledSetAdditionalPropertiesButton: true,
         disabledCleanRowsButton: true,
         asset: "",
         fileChooserLabel: "Choose File",
      };
   }

   // this function is called (technically a callback) from PopoverContents.tsx
   // -- it's the way data is passed from child component to parent component
   myCallBack = (objectFromPopoverContents: AdditionalPropsType) => {
      if (
         // check if additional properties are valid
         objectFromPopoverContents.BEACH!.length > 2 &&
         objectFromPopoverContents.RENTALAGENT!.length > 3 &&
         objectFromPopoverContents.STATE!.length > 3
      ) {
         this.setState({ disabledCleanRowsButton: false });
         this.setState({ additionalPropValues: objectFromPopoverContents });
         this.setState({ asset: "" });
         this.extendedFatArray.forEach((x) => {
            let eEFO = { ...x, ...objectFromPopoverContents };
            // console.dir(eEFO);
            this.extendedExtendedFatArray.push(eEFO);
         });
         // console.log(`extendedExtendedFatArray below:`);
         // console.dir(this.extendedExtendedFatArray);
         let skinnyObjTemplate: any = {};
         getKeptChairHeaders(this.props.auth2, this.props.idToken)
            .then((data: any) => {
               this.myPanel.current!.append(
                  `<p style="font-style: normal; color:blue; font-size:12px;">${data.length} kept parameters: </p>`
               );
               data.forEach((element: any) => {
                  skinnyObjTemplate[element.chairHeader] = "";
                  this.myPanel.current!.append(
                     `<p style="font-style: italic; color:blue; font-size:12px;">${element.chairHeader}</p>`
                  );
               });
               this.extendedExtendedFatArray.forEach((row) => {
                  let skinnyObj: any = {};
                  Object.keys(skinnyObjTemplate).forEach((property) => {
                     skinnyObj[property] = row[property];
                  });
                  this.tallAndSkinnyArray.push(skinnyObj);
               });
               // console.log(`tallAndSkinnyArray below:`);
               // console.dir(this.tallAndSkinnyArray);
            })
            .catch((err: any) => {
               console.error(`C0003: ${err}`);
            });
      } else {
         this.myPanel.current!.append(
            `<p style="font-style: normal; color:red; font-size:13.2px;">Invalid inputs for ${Object.keys(
               objectFromPopoverContents
            )}!</p>`
         );
      }
   };

   componentDidMount() {
      this.addAdditionalButton.current!.val("Set Additonal Properties");
      ReactDOM.render(
         <PopoverContents
            myPanel={this.myPanel}
            additionalPropsPopover={this.additionalPropsPopover}
            callbackFromCleanAndLoadFiles={this.myCallBack}
         ></PopoverContents>,
         document.getElementById("popoverContents")
      );
   }

   render() {
      return (
         <div>
            <section>
               <fieldset>
                  <legend>Cleanse and Upload Data</legend>
                  <div>
                     <label>
                        {this.state.fileChooserLabel}
                        <input
                           ref={this.fileInput}
                           type="file"
                           accept=".csv"
                           onChange={this.fileInputHandler}
                           value={this.state.value}
                           style={{
                              width: "0.1px",
                              height: "0.1px",
                              opacity: "0",
                              overflow: "hidden",
                              position: "absolute",
                              zIndex: -1,
                           }}
                        ></input>
                     </label>
                  </div>
                  <div>
                     <ShowChairHeaders
                        loggedInWithGoogle={this.props.loggedInWithGoogle}
                        auth2={this.props.auth2}
                        idToken={this.props.idToken}
                        loggedInToFirebase={this.props.loggedInToFirebase}
                        myPanel={this.myPanel}
                     ></ShowChairHeaders>
                  </div>
                  <div>
                     <JqxPopover
                        ref={this.additionalPropsPopover}
                        offset={{ left: -4, top: 0 }}
                        isModal={false}
                        autoClose={false}
                        arrowOffsetValue={0}
                        position={"right"}
                        title={"Where is Chair Deployed?"}
                        showCloseButton={true}
                        selector={".addPropsButton"}
                        theme={"fresh"}
                        height={155}
                        width={285}
                     >
                        <div ref={this.someDiv} id={"popoverContents"} />
                     </JqxPopover>
                     <JqxButton
                        ref={this.addAdditionalButton}
                        style={{
                           marginLeft: "0px",
                           marginBottom: "2px",
                           position: "relative",
                           padding: "3px",
                           paddingTop: "9px",
                           borderRadius: "2px",
                        }}
                        disabled={
                           this.state.disabledSetAdditionalPropertiesButton
                        }
                        width={318}
                        height={20}
                        theme={"fresh"}
                        className="addPropsButton"
                     ></JqxButton>
                  </div>
                  <JqxButton
                     ref={this.cleanRowsAndUploadlButton}
                     style={{
                        marginLeft: "0px",
                        marginBottom: "7px",
                        position: "relative",
                        padding: "3px",
                        paddingTop: "9px",
                        borderRadius: "2px",
                     }}
                     disabled={this.state.disabledCleanRowsButton}
                     onClick={this.cleanRowsAndUploadClicked}
                     width={318}
                     height={20}
                     theme={"fresh"}
                  >
                     Clean Rows and Upload
                  </JqxButton>
                  <div>
                     <JqxPanel
                        ref={this.myPanel}
                        width={325}
                        height={150}
                        theme={"fresh"}
                     />
                     <JqxButton
                        ref={this.clearConsoleButton}
                        onClick={this.clearConsoleButtonClicked}
                        width={325}
                        height={30}
                        theme={"fresh"}
                        textPosition={"center"}
                     >
                        Clear Console
                     </JqxButton>
                  </div>
               </fieldset>
            </section>
            <section>
               <div>
                  <ShowChairData
                     loggedInWithGoogle={this.props.loggedInWithGoogle}
                     auth2={this.props.auth2}
                     idToken={this.props.idToken}
                     loggedInToFirebase={this.props.loggedInToFirebase}
                     myPanel={this.myPanel}
                     asset={this.state.asset}
                  ></ShowChairData>
               </div>
            </section>
         </div>
      );
   }

   private fileInputHandler(event: any) {
      let uO_role: string = this.props.userObject.role;
      let isAdmin: number = uO_role.localeCompare(Roles.admin);
      let isUploader: number = uO_role.localeCompare(Roles.uploader);
      if (isAdmin === 0 || isUploader === 0) {
         this.setState({ value: event.target.value });
         // let fileChooserLabel = document.querySelector(
         // "body > div:nth-of-type(1) > div > div > div > section:nth-of-type(1) > fieldset > div:nth-of-type(1) > label"
         // ) as HTMLElement;
         this.setState({ disabledSetAdditionalPropertiesButton: false });
         this.setState({ disabledCleanRowsButton: true });
         this.extendedFatArray.length = 0;
         this.extendedExtendedFatArray.length = 0;
         this.tallAndSkinnyArray.length = 0;
         this.shortAndSkinnyArray5.length = 0;
         this.shortAndSkinnyArray4.length = 0;
         this.shortAndSkinnyArray3.length = 0;
         this.shortAndSkinnyArray2.length = 0;
         this.shortAndSkinnyArray1.length = 0;
         this.shortAndSkinnyArray.length = 0;
         let filesListObject = this.fileInput.current.files;
         // pull headers for all files from the first line of the first file
         let aFile = filesListObject[0]; // first_file is index [0]
         // fileChooserLabel.innerHTML = aFile.name;
         this.setState({ fileChooserLabel: aFile.name });
         let headerMappingArray: Array<HeaderMapping> = [];
         processTableHeadersFromCSVFile(aFile).then((headers: any) => {
            // headers[] looks like: [0:{origHdr: "ReportID", newHdr: "ReportID"}, etc.]
            headers.forEach((x: HeaderMapping) => {
               headerMappingArray.push(x);
               const randomTime = Math.floor(Math.random() * 3000);
               setTimeout(() => {
                  storeHeadersOnFirebase(
                     this.props.auth2,
                     this.props.idToken,
                     x.newHdr,
                     this.myPanel
                  );
               }, randomTime);
            });

            Object.keys(filesListObject).forEach((fileIndex: any) => {
               // get data from all files, including the first file from which the headers were pulled
               let aFile = filesListObject[fileIndex];
               readDataRowsOfFile(aFile)
                  .then((dataRows: any) => {
                     // dataRows[] contains each row of a file
                     // this.myPanel.current!.append(`<h5>${aFile.name}, `);
                     // this.myPanel.current!.append(`${dataRows.length} rows, `);
                     //   let rowNum = 0;
                     let extendedFat: any = undefined;
                     let numHeaders = 0;
                     let rowNum = 0;
                     dataRows.forEach((aRow: string) => {
                        createFatChairObject(aRow, headerMappingArray).then(
                           (fatChairObj: any) => {
                              extendedFat = addValuesForAdditionalHeaders(
                                 fatChairObj,
                                 aFile.name
                              );
                              this.extendedFatArray.push(extendedFat);
                              numHeaders = Object.keys(extendedFat).length;
                              if (rowNum++ === 0) {
                                 // console.log(`${numHeaders} properties`);
                                 this.myPanel.current!.append(
                                    `<p style="text-decoration: underline; color:black;font-size:11px;">${aFile.name}, ${dataRows.length} rows, ${numHeaders} properties</p>`
                                 );
                              }
                           }
                        );
                     });
                  })
                  .catch((err: any) => {
                     console.error(`C0002: ${err}`);
                  });
            });
         });
      } else {
         this.myPanel.current!.append(
            `<p style="color:#738108;font-size:12px;">${this.props.userObject.role.toUpperCase()} does not have upload rights.</p>`
         );
      }
   }

   private clearConsoleButtonClicked() {
      this.myPanel.current!.clearcontent();
   }

   private cleanRowsAndUploadClicked() {
      if (!this.state.disabledSetAdditionalPropertiesButton) {
         this.setState({ disabledSetAdditionalPropertiesButton: true });
         this.setState({ disabledCleanRowsButton: true });
         this.tallAndSkinnyArray.forEach((x) => {
            x.LATITUDE !== "-360" ? this.shortAndSkinnyArray5.push(x) : {};
         });
         this.shortAndSkinnyArray5.forEach((x) => {
            x.LONGITUDE !== "-360" ? this.shortAndSkinnyArray4.push(x) : {};
         });
         this.shortAndSkinnyArray4.forEach((x) => {
            typeof x.LATITUDE !== "undefined"
               ? this.shortAndSkinnyArray3.push(x)
               : {};
         });
         this.shortAndSkinnyArray3.forEach((x) => {
            typeof x.LONGITUDE != "undefined"
               ? this.shortAndSkinnyArray2.push(x)
               : {};
         });
         this.shortAndSkinnyArray2.forEach((x) => {
            typeof x.ASSETLABEL != "undefined"
               ? this.shortAndSkinnyArray1.push(x)
               : {};
         });
         this.shortAndSkinnyArray1.forEach((x) => {
            typeof x.UPDATETIME != "undefined"
               ? this.shortAndSkinnyArray.push(x)
               : {};
         });
         // console.dir(this.shortAndSkinnyArray);
         let numRowsSurvived = this.shortAndSkinnyArray.length;
         let numParameters = 0;
         let asset = "";
         if (typeof this.shortAndSkinnyArray[0] != "undefined") {
            numParameters = Object.keys(this.shortAndSkinnyArray[0]).length;
            asset = this.shortAndSkinnyArray[0].ASSETLABEL;
         }
         this.setState({ asset: asset });
         this.myPanel.current!.append(
            `<p style="color:#738108;font-size:12px;">For [${asset}], uploading to Firebase ${numRowsSurvived} records, each containing ${numParameters} parameters.</p>`
         );
         let lengthOfTimeIn_mSec = numRowsSurvived * 0.04 * 1000; // 1/.04 = 25 writes/second to the Firestore collection
         this.shortAndSkinnyArray.forEach((x: any) => {
            const randomTime = Math.floor(Math.random() * lengthOfTimeIn_mSec);
            setTimeout(() => {
               storeChairLocsOnFirebase(
                  this.props.auth2,
                  this.props.idToken,
                  x,
                  this.myPanel
               );
            }, randomTime);
         });
         this.setState({ fileChooserLabel: "Choose File" });
      }
   }
}

export default CleanAndUploadFiles;
