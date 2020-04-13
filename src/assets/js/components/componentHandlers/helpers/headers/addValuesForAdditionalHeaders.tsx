// Client-side code follows:
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
import additionalHeaders from "../../../../configs/additionalTableHeaders";

const addValuesForAdditionalHeaders = (fatChairObj: any, fname: string) => {
   let extendedFat: any = undefined;
   extendedFat = { ...fatChairObj };
   extendedFat[additionalHeaders[1].toUpperCase()] = fname; // FName
   extendedFat[
      additionalHeaders[2].toUpperCase()
   ] = new Date().toLocaleString(); // UploadFBTime
   extendedFat[additionalHeaders[0].toUpperCase()] = SHA256(
      `${fatChairObj.ASSETLABEL}${fatChairObj.UPDATETIME}`
   ).toString(CryptoJS.enc.Hex); // ID
   return extendedFat;
};

export default addValuesForAdditionalHeaders;
