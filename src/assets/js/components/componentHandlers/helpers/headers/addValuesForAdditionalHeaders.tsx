// Client-side code follows:
var CryptoJS = require("crypto-js");
var SHA1 = require("crypto-js/sha1");
import additionalHeaders from "../../../../configs/additionalTableHeaders";

const addValuesForAdditionalHeaders = (fatChairObj: any, fname: string) => {
   let extendedFat: any = undefined;
   extendedFat = { ...fatChairObj };
   extendedFat[additionalHeaders[1].toUpperCase()] = fname; // FName
   extendedFat[additionalHeaders[2].toUpperCase()] = new Date().toISOString(); // UploadFBTime
   extendedFat[additionalHeaders[0].toUpperCase()] = SHA1(
      `${fatChairObj.ASSETLABEL}${fatChairObj.UPDATETIME}`
   )
      .toString(CryptoJS.enc.Hex)
      .substr(0, 10); // ID
   return extendedFat;
};

export default addValuesForAdditionalHeaders;
