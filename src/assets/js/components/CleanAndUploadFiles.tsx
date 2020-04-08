import React, { Component } from "react";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import readDataRowsOfFile from "./componentHandlers/helpers/readDataRowsOfFile";
import processTableHeadersFromCSVFile from "./componentHandlers/helpers/headers/processTableHeadersFromCSVFile";
import { HeaderMapping } from "../misc/chairLocTypes";
import createFatChairObject from "../components/componentHandlers/helpers/createFatChairObj";

import storeHeadersOnFirebase from "../fetches/storeHeadersOnFirebase";
import addValuesForAdditionalHeaders from "./componentHandlers/helpers/addValuesForAdditionalHeaders";

class CleanAndUploadFiles extends Component<
   { auth2: any; idToken: any },
   { value: string }
> {
   private myPanel = React.createRef<JqxPanel>();
   private fileInput: any;
   constructor(props: { auth2: any; idToken: any }) {
      super(props);

      this.fileInput = React.createRef();
      this.handleChange = this.handleChange.bind(this);

      this.state = {
         value: "",
      };
   }

   render() {
      return (
         <div>
            <input
               ref={this.fileInput}
               type="file"
               accept=".csv"
               multiple
               onChange={this.handleChange}
               value={this.state.value}
            ></input>
            <JqxPanel
               ref={this.myPanel}
               width={"30%"}
               height={150}
               theme={"fresh"}
            />
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
                  this.myPanel.current!.append(`${aFile.name}, `);
                  this.myPanel.current!.append(`${dataRows.length} rows<br/>`);
                  //   let rowNum = 0;
                  let extendedFat: any = undefined;
                  dataRows.forEach((aRow: string) => {
                     createFatChairObject(aRow, headerMappingArray).then(
                        (fatChairObj: any) => {
                           extendedFat = addValuesForAdditionalHeaders(
                              fatChairObj,
                              aFile.name
                           );
                           console.dir(extendedFat);
                        }
                     );
                  });
               })
               .catch((err: any) => {
                  console.error(`C0001: ${err}`);
               });
         });
      });
   }
}

export default CleanAndUploadFiles;
