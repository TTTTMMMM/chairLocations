import * as React from "react";
// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   // jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import moment from "moment";

import "../../../styles/index.css";

import { AuthContext } from "../../contexts/AuthContext";

import getGeosFromTrak4 from "../../fetches/getGeosFromTrak4";
import storeChairLocsOnFirebase from "../../fetches/storeChairLocsOnFirebase";

import createFatChairObjAPI from "../../components/componentHandlers/helpers/createFatChairObjAPI";
import addValuesForAdditionalHeaders from "../../components/componentHandlers/helpers/headers/addValuesForAdditionalHeaders";
import GaugeRendering from "./GaugeRendering";

// import { divFlexRow } from "../../../styles/reactStyling";
import { RangeObject, ChairIMEIRentalAgent } from "../../misc/chairLocTypes";

interface MyState extends IDataTableProps {
   pairings: Array<ChairIMEIRentalAgent>;
   range: RangeObject;
   numSent: Array<number>;
}
class ShowAPIPullStatus extends React.PureComponent<
   {
      myPanel: any;
      pairings: Array<ChairIMEIRentalAgent>;
      range: RangeObject;
      keptHeaders: Array<string>;
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
      keptHeaders: Array<string>;
      numSent: Array<number>;
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
         numSent: [123],
      };
   }

   parentCallback = (chairIndex: number, numSent: number) => {
      let arr = [];
      arr[chairIndex] = numSent;
      console.log(`${chairIndex}: ${numSent}`);
      this.setState({ numSent: [numSent] });
   };

   pullGeoDataFromTrak4() {
      const { auth2, googleToken } = this.context;
      if (this.props.pairings.length > 0) {
         this.numUpdates = 0;
         // let tempPairings: Array<ChairIMEIRentalAgent> = [];
         // tempPairings.push(this.props.pairings[0]);
         // limit hitting the trak4API to four times max while I'm debugging; remove when fully debugged
         // if (this.props.pairings.length > 1) {
         //    tempPairings.push(this.props.pairings[1]);
         //    tempPairings.push(this.props.pairings[12]);
         //    tempPairings.push(this.props.pairings[20]);
         // }
         // replace tempPairings below with this.props.pairings when fully debugged
         // for (var j = 0; j < tempPairings.length; j++) {
         for (var j = 0; j < this.props.pairings.length; j++) {
            // execute each iteration of this for loop with some delay
            (function (
               j,
               pairing: ChairIMEIRentalAgent,
               range: RangeObject,
               myPanel: any,
               keptHeaders: Array<string>,
               auth2: any,
               googleToken: any,
               parentCallback: any
            ) {
               // let extendedFatArray: Array<any> = [];
               // let tallAndSkinny: Array<any> = [];
               const timeInmillisBetweenEachUpload = 75000; //75000 = 75 secs.
               setTimeout(function () {
                  let numRows = 0;
                  getGeosFromTrak4(pairing, range)
                     .then((retVal: any) => {
                        let geoLocArray = retVal.data;
                        let timeStamp = moment(retVal.timestamp).format(
                           "YYYYMMDD_HHmm"
                        );
                        // console.log(
                        //    `------------- ${pairing.chair} ------------`
                        // );
                        geoLocArray.forEach((fatChairObjAlmost: any) => {
                           // fatChairObjAlmost doesn't have assetLabel field
                           // console.dir(fatChairObjAlmost);
                           createFatChairObjAPI(
                              fatChairObjAlmost,
                              pairing
                           ).then((fatChairObj: any) => {
                              let extendedFat = addValuesForAdditionalHeaders(
                                 fatChairObj,
                                 `API_${timeStamp}`
                              );
                              // x ends up being the skinny object
                              let x = Object.keys(extendedFat)
                                 .filter((key) => keptHeaders.includes(key))
                                 .reduce((obj: any, key) => {
                                    obj[key] = extendedFat[key];
                                    if (
                                       obj.LATITUDE === "360" ||
                                       obj.LONGITUDE === "360" ||
                                       obj.LATITUDE === "-360" ||
                                       obj.LONGITUDE === "-360" ||
                                       typeof obj.LATITUDE === "undefined" ||
                                       typeof obj.LONGITUDE === "undefined" ||
                                       typeof obj.ASSETLABEL === "undefined" ||
                                       typeof obj.UPDATETIME === "undefined"
                                    ) {
                                       console.log(`purged ${obj.ID}`);
                                    }
                                    return obj;
                                 }, {});
                              // console.dir(x);
                              const randomTime = Math.floor(
                                 Math.random() *
                                    (timeInmillisBetweenEachUpload - 10000)
                              );
                              setTimeout(() => {
                                 let numSent = 0;
                                 storeChairLocsOnFirebase(
                                    auth2,
                                    googleToken,
                                    x
                                 ).then((res: any) => {
                                    numSent++;
                                    parentCallback(numSent);
                                 });
                              }, randomTime); //
                           });
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
               }, timeInmillisBetweenEachUpload * j);
            })(
               j,
               // tempPairings[j],
               this.props.pairings[j],
               this.props.range,
               this.props.myPanel,
               this.props.keptHeaders,
               auth2,
               googleToken,
               this.parentCallback
            );
         }
      }
      return (
         <>
            <GaugeRendering maxValue={250} values={[200]}></GaugeRendering>
         </>
      );
   }

   render() {
      return <>{this.pullGeoDataFromTrak4()}</>;
   }
}

export default ShowAPIPullStatus;
