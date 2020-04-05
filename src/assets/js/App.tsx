import React, { Component } from "react";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import readDataRowsOfFile from "./helpers/readDataRowsOfFile";
import getTableHeadersFromCSVFile from "./helpers/getTableHeadersFromCSVFile";

class App extends Component<{}, { value: string }> {
   private myPanel = React.createRef<JqxPanel>();
   private fileInput: any;
   constructor(props: {}) {
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
      let tableHeaders = new Array();
      let aFile = filesListObject[0]; // pull headers for all files from the first file
      getTableHeadersFromCSVFile(aFile).then((result: any) => {
         tableHeaders = result;
         tableHeaders.push("fname");
         Object.keys(filesListObject).forEach((fileIndex: any) => {
            // get data from all files, including the first file from which the headers were pulled
            let aFile = filesListObject[fileIndex];
            readDataRowsOfFile(aFile)
               .then((dataRows: any) => {
                  this.myPanel.current!.append(`${aFile.name}, `);
                  this.myPanel.current!.append(`${dataRows.length} rows<br/>`);
                  let rowNum = 0;
                  console.log(`${aFile.name}`);
                  dataRows.forEach((aRow: any) => {
                     let a = aRow.split(",");
                     a.push(aFile.name);
                     let out1 = a.map((obj: any, index: any) => {
                        let myObj = {};
                        myObj[tableHeaders[index]] = obj;
                        return myObj;
                     });
                     console.log(rowNum, out1);
                     rowNum++;
                  });
               })
               .catch((err: any) => {
                  console.error(`C0001: ${err}`);
               });
         });
      });
   }
}

export default App;
