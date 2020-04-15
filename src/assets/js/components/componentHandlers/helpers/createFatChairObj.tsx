// Client-side code follows:
var escapeHTML = require("escape-html");
import { HeaderMapping } from "../../../misc/chairLocTypes";

const createFatChairObj = (
   aRow: string,
   headerMappingArray: Array<HeaderMapping>
) => {
   return new Promise((resolve, reject) => {
      let dataArray = aRow.split(",");
      let i = 0;
      let fatChairObj: any = {};
      dataArray.forEach((x) => {
         fatChairObj[headerMappingArray[i++].newHdr] = escapeHTML(
            x.trim().substring(0, 64)
         );
      });
      //   console.dir(fatChairObj);
      resolve(fatChairObj);
   });
};

export default createFatChairObj;
