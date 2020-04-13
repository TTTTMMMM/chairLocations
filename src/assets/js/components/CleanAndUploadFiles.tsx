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
import addValuesForAdditionalHeaders from "./componentHandlers/helpers/headers/addValuesForAdditionalHeaders";
import ShowChairHeaders from "./ShowChairHeaders";
import PopoverContents from "./PopoverContents";

class CleanAndUploadFiles extends Component<
   {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
   },
   { value: string }
> {
   private myPanel = React.createRef<JqxPanel>();
   private clearButton = React.createRef<JqxButton>();
   private addAdditionalButton = React.createRef<JqxButton>();
   private someDiv = React.createRef<HTMLDivElement>();
   private additionalPropsPopover = React.createRef<JqxPopover>();

   private fileInput: any;
   constructor(props: {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
   }) {
      super(props);

      this.fileInput = React.createRef();
      this.handleChange = this.handleChange.bind(this);
      this.clearButtonClicked = this.clearButtonClicked.bind(this);

      this.state = {
         value: "",
      };
   }

   componentDidMount() {
      this.addAdditionalButton.current!.val("Set Additonal Properties");
      ReactDOM.render(
         <PopoverContents
            myPanel={this.myPanel}
            additionalPropsPopover={this.additionalPropsPopover}
         ></PopoverContents>,
         document.getElementById("popoverContents")
      );
      // this.someDiv.current!.innerHTML += "";
   }

   render() {
      return (
         <div>
            <div>
               <input
                  ref={this.fileInput}
                  type="file"
                  accept=".csv"
                  multiple
                  onChange={this.handleChange}
                  value={this.state.value}
               ></input>
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
                     marginBottom: "7px",
                     position: "relative",
                     padding: "3px",
                     paddingTop: "9px",
                     borderRadius: "2px",
                  }}
                  width={318}
                  height={20}
                  theme={"fresh"}
                  className="addPropsButton"
               ></JqxButton>
            </div>
            <div>
               <JqxPanel
                  ref={this.myPanel}
                  width={325}
                  height={150}
                  theme={"fresh"}
               />
               <JqxButton
                  ref={this.clearButton}
                  onClick={this.clearButtonClicked}
                  width={325}
                  height={30}
                  theme={"fresh"}
                  textPosition={"center"}
               >
                  Clear Console
               </JqxButton>
            </div>
         </div>
      );
   }

   private handleChange(event: any) {
      this.setState({ value: event.target.value });
      let filesListObject = this.fileInput.current.files;
      // pull headers for all files from the first line of the first file
      let aFile = filesListObject[0]; // first_file is index [0]
      let headerMappingArray: Array<HeaderMapping> = [];
      processTableHeadersFromCSVFile(aFile).then((headers: any) => {
         // headers[] looks like: [0:{origHdr: "ReportID", newHdr: "ReportID"}, etc.]
         headers.forEach((x: HeaderMapping) => {
            headerMappingArray.push(x);
            const randomTime = Math.floor(Math.random() * 10000);
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
                           numHeaders = Object.keys(extendedFat).length;
                           if (rowNum++ === 0) {
                              console.log(`${numHeaders} properties`);
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
   }

   private clearButtonClicked() {
      this.myPanel.current!.clearcontent();
   }
}

export default CleanAndUploadFiles;
