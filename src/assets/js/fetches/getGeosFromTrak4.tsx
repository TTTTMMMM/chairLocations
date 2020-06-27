/* eslint-disable no-unused-vars */
// Client-side code follows:
import { trak4APIKey } from "../configs/trak4APIConfig";
// import { trak4URL } from "../configs/trak4APIConfig";
import { trak4CORSProxyURL } from "../configs/trak4APIConfig";
import { RangeObject, ChairIMEI } from "../misc/chairLocTypes";

interface PostSingleDeviceReport {
   commandstring: string;
   identifier: string;
   datetime_start: string;
   datetime_end: string;
   coredataonly: boolean;
   token: string;
}

const getGeosFromTrak4 = (pairing: ChairIMEI, range: RangeObject): any => {
   let myHeaders = new Headers();

   let postSingleDeviceReportObj: PostSingleDeviceReport = {
      commandstring: "get_reports_single_device",
      identifier: pairing.imei,
      datetime_start: range.startDate,
      datetime_end: range.endDate,
      coredataonly: false,
      token: trak4APIKey,
   };
   myHeaders.append("Content-Type", "text/plain");
   myHeaders.append("Accept", "*/*");
   myHeaders.append("Connection", "keep-alive");

   const myStuff = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(postSingleDeviceReportObj),
   };
   return new Promise((resolve) => {
      fetch(trak4CORSProxyURL, myStuff).then((res) => {
         switch (res.status) {
            default:
               res.json().then((data: any) => {
                  resolve(data);
               });
         }
      });
   });
};

export default getGeosFromTrak4;
