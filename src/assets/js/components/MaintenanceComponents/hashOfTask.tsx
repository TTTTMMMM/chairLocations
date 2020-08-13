// Client-side code follows:
var CryptoJS = require("crypto-js");
var SHA1 = require("crypto-js/sha1");

const hashOfTask = (task: string) => {
   return SHA1(`${task}${new Date().toISOString()}`)
      .toString(CryptoJS.enc.Hex)
      .substr(0, 6); // ID
};

export default hashOfTask;
