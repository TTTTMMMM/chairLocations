// Client-side code follows:
import cleanHeaders from "./cleanHeaders";
import additionalHeaders from "../../../../configs/additionalTableHeaders";
import { HeaderMapping } from "../../../../misc/chairLocTypes";

const processTableHeadersFromCSVFile = (inputFile: any) => {
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
         let origHeadersArray = eachRow[0].split(",");
         let cleanedHeaders = cleanHeaders(theHeadersRow);
         let headerPositionsArray: Array<HeaderMapping> = new Array();
         let i = 0;
         origHeadersArray.forEach((x) => {
            headerPositionsArray[i] = { origHdr: x, newHdr: cleanedHeaders[i] };
            i++;
         });
         let j = 0;
         additionalHeaders.forEach((x) => {
            headerPositionsArray[i] = {
               origHdr: undefined,
               newHdr: additionalHeaders[j],
            };
            i++;
            j++;
         });
         // console.log(headerPositionsArray);
         resolve(headerPositionsArray);
      };
      fileReader.readAsText(inputFile);
   });
};

export default processTableHeadersFromCSVFile;
