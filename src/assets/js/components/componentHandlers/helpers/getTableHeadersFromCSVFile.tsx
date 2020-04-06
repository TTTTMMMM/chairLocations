// Client-side code follows:

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
         // console.log(theHeadersRow);
         let theHeadersArray = theHeadersRow.split(",");
         resolve(theHeadersArray);
      };
      fileReader.readAsText(inputFile);
   });
};

export default getTableHeadersFromCSVFile;
