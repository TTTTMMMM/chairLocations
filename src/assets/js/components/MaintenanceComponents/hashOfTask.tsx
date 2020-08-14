// Client-side code follows:
var CryptoJS = require("crypto-js");
var SHA1 = require("crypto-js/sha1");

const hashOfTask = (passInValue: string, taskType: boolean) => {
   if (taskType) {
      //task definition
      return (
         "T" +
         SHA1(`${passInValue}${new Date().toISOString()}`)
            .toString(CryptoJS.enc.Hex)
            .substr(0, 5)
      );
   } else {
      // asset tied to task
      return SHA1(`${passInValue}${new Date().toISOString()}`)
         .toString(CryptoJS.enc.Hex)
         .substr(0, 6);
   }
};

export default hashOfTask;
