// Client-side code follows:
import cleanHeaders from "./cleanHeaders";
import additionalHeaders from "../../../../configs/additionalTableHeaders";

const getTableHeadersFromCSVFile = (inputFile: any) => {
   return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onerror = () => {
         fileReader.abort();
         reject(`Problem parsing ${inputFile.name}.`);
      };
      fileReader.onload = () => {
         let allTheText = fileReader.result;
         let eachRow = (allTheText as string)!.split("\n");
         let theHeadersRow = eachRow[0]; // first line of file has table headers
         let cleanedHeaders = cleanHeaders(theHeadersRow);
         let allHeaders = [...cleanedHeaders, ...additionalHeaders];
         // console.log(allHeaders);
         // let theHeadersArray = theHeadersRow.split(",");
         resolve(allHeaders);
      };
      fileReader.readAsText(inputFile);
   });
};

export default getTableHeadersFromCSVFile;
