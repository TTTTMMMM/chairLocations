// Client-side code follows:

const cleanHeaders = (headers: string) => {
   let headersArray = headers.split(",");
   let cleanedHeadersArray: Array<string> = new Array();
   headersArray.forEach((header: string) => {
      let tH = header
         .substring(0, 20)
         .trim()
         .replace(/\s+/g, "_")
         .replace(/\/+/g, "");
      cleanedHeadersArray.push(tH.charAt(0).toUpperCase() + tH.slice(1));
   });
   return cleanedHeadersArray;
};

export default cleanHeaders;
