// Client-side code follows:
import { HeaderMapping } from "../../../misc/chairLocTypes";

const createChairObj = (
   aRow: string,
   headerMappingArray: Array<HeaderMapping>
) => {
   return new Promise((resolve, reject) => {
      let dataArray = aRow.split(",");
      let i = 0;
      let chairObj: any = {};
      dataArray.forEach((x) => {
         chairObj[headerMappingArray[i++].newHdr] = x;
      });
      //   console.dir(chairObj);
      resolve(chairObj);
   });
};

export default createChairObj;
