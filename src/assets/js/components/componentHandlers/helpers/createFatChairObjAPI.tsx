// Client-side code follows:
var escapeHTML = require("escape-html");
import { ChairIMEIRentalAgent } from "../../../misc/chairLocTypes";

const createFatChairObjAPI = (
   aGeoLocValueFromAPI: any,
   pairing: ChairIMEIRentalAgent
) => {
   return new Promise((resolve, reject) => {
      let fatChairObj: any = {};
      Object.keys(aGeoLocValueFromAPI).forEach((x: string) => {
         fatChairObj[x.toUpperCase()] = escapeHTML(
            aGeoLocValueFromAPI[x].toString().trim().substring(0, 31)
         );
      });
      fatChairObj["ASSETLABEL"] = pairing.chair;
      fatChairObj["RENTALAGENT"] = pairing.rentalAgent;
      // console.dir(fatChairObj);
      resolve(fatChairObj);
   });
};

export default createFatChairObjAPI;
