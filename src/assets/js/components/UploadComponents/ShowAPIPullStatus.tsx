import * as React from "react";
// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   // jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import "../../../styles/index.css";

import { AuthContext } from "../../contexts/AuthContext";

import getGeosFromTrak4 from "../../fetches/getGeosFromTrak4";
import createFatChairObjAPI from "../../components/componentHandlers/helpers/createFatChairObjAPI";

// import { divFlexRow } from "../../../styles/reactStyling";
import { RangeObject, ChairIMEIRentalAgent } from "../../misc/chairLocTypes";

interface MyState extends IDataTableProps {
   pairings: Array<ChairIMEIRentalAgent>;
   range: RangeObject;
}
class ShowAPIPullStatus extends React.PureComponent<
   {
      myPanel: any;
      pairings: Array<ChairIMEIRentalAgent>;
      range: RangeObject;
   },
   MyState
> {
   numUpdates: number | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;

   static contextType = AuthContext;

   constructor(props: {
      myPanel: any;
      pairings: Array<ChairIMEIRentalAgent>;
      range: RangeObject;
   }) {
      super(props);
      this.numRows = 0;
      this.columns = [];
      this.numUpdates = 0;

      this.state = {
         editSettings: {
            cancelOnEsc: true,
            editOnDoubleClick: false,
            editOnF2: true,
            editSingleCell: true,
            saveOnBlur: true,
            saveOnEnter: true,
            saveOnPageChange: true,
            saveOnSelectionChange: true,
         },
         range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         pairings: [],
      };
   }

   pullGeoDataFromTrak4() {
      if (this.props.pairings.length > 0) {
         this.numUpdates = 0;
         let tempPairings: Array<ChairIMEIRentalAgent> = [];
         tempPairings.push(this.props.pairings[0]);
         // limit hitting the trak4API to four times max while I'm debugging; remove when fully debugged
         if (this.props.pairings.length > 1) {
            tempPairings.push(this.props.pairings[1]);
            tempPairings.push(this.props.pairings[12]);
            tempPairings.push(this.props.pairings[20]);
         }
         // replace tempPairings below with this.props.pairings when fully debugged
         for (var j = 0; j < tempPairings.length; j++) {
            // execute each iteration of this for loop with some delay
            (function (
               j,
               pairing: ChairIMEIRentalAgent,
               range: RangeObject,
               myPanel: any
            ) {
               setTimeout(function () {
                  let numRows = 0;
                  getGeosFromTrak4(pairing, range)
                     .then((retVal: any) => {
                        let geoLocArray = retVal.data;
                        // console.log(
                        //    `------------- ${pairing.chair} ------------`
                        // );
                        geoLocArray.forEach((fatChairObjAlmost: any) => {
                           // fatChairObjAlmost doesn't have assetLabel field
                           // console.dir(fatChairObjAlmost);
                           createFatChairObjAPI(fatChairObjAlmost, pairing);
                           numRows++;
                        });
                        myPanel.current!.append(
                           `<p style="font-style: normal; color:black; font-size:12px;">${
                              j + 1
                           }. ${pairing.chair} had ${numRows} rows.</p>`
                        );
                     })
                     .catch((err: any) => {
                        myPanel.current!.append(
                           `<p style="font-style: normal; color:red; font-size:12px;">C0028: ${err}</p>`
                        );
                     });
               }, 15000 * j);
            })(j, tempPairings[j], this.props.range, this.props.myPanel);
         }
      }
      return <>Hi, from pullGeoDataFromTrak4()</>;
   }

   render() {
      return <>{this.pullGeoDataFromTrak4()}</>;
   }
}

export default ShowAPIPullStatus;
