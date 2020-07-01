// Client-side code follows:
var escapeHTML = require("escape-html");
import { ChairIMEIRentalAgent } from "../../../misc/chairLocTypes";
import moment from "moment";

const createFatChairObjAPI = (
   aGeoLocValueFromAPI: any,
   pairing: ChairIMEIRentalAgent
) => {
   return new Promise((resolve, reject) => {
      let fatChairObj: any = {};
      let fail: boolean = false;
      Object.keys(aGeoLocValueFromAPI).forEach((x: string) => {
         fatChairObj["ASSETLABEL"] = pairing.chair;
         fatChairObj["RENTALAGENT"] = pairing.rentalAgent;
         fatChairObj["BEACH"] = "";
         fatChairObj["STATE"] = "";
         let theValue = aGeoLocValueFromAPI[x]
            .toString()
            .trim()
            .substring(0, 31);
         if (x.toUpperCase() === "UPDATETIME") {
            theValue = moment(theValue).format("YYYY-MM-DDTHH:mm:ss");
            theValue = theValue.concat("Z");
         }
         if (x.toUpperCase() === "GPS_SPEED") {
            x = "GPS_MPH";
         }
         if (x.toUpperCase() === "LATITUDE") {
            if (theValue === "360" || theValue === "-360") {
               fail = true;
            }
         }
         if (x.toUpperCase() === "LONGITUDE") {
            if (theValue === "360" || theValue === "-360") {
               fail = true;
            }
         }
         if (!fail) {
            fatChairObj[x.toUpperCase()] = escapeHTML(theValue);
         }
      });
      if (fail) {
         fatChairObj = {};
      }
      resolve(fatChairObj);
   });
};

export default createFatChairObjAPI;
