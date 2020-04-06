// Client-side code follows:

const readDataRows = (inputFile: any) => {
   return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onerror = () => {
         fileReader.abort();
         reject(`Problem parsing ${inputFile.name}.`);
      };
      fileReader.onload = () => {
         // console.log(`readDataRows(), dataRows:`);
         let allTheText = fileReader.result;
         let dataRows = (allTheText as string)!.split("\n");
         dataRows.shift(); // shift out the headers row
         // console.log(dataRows);
         resolve(dataRows);
      };
      fileReader.readAsText(inputFile);
   });
};

export default readDataRows;
