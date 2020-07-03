import * as React from "react";
// @ts-ignore
import JqxBarGauge, {
   IBarGaugeProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbargauge";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import moment from "moment";

import "../../../styles/index.css";
import { divFlexCol, divFlexRow } from "../../../styles/reactStyling";

import { AuthContext } from "../../contexts/AuthContext";

import getGeosFromTrak4 from "../../fetches/getGeosFromTrak4";
import storeChairLocsOnFirebase from "../../fetches/storeChairLocsOnFirebase";

import createFatChairObjAPI from "../../components/componentHandlers/helpers/createFatChairObjAPI";
import addValuesForAdditionalHeaders from "../../components/componentHandlers/helpers/headers/addValuesForAdditionalHeaders";

import { RangeObject, ChairIMEIRentalAgent } from "../../misc/chairLocTypes";

interface MyState extends IBarGaugeProps {
   pairings: Array<ChairIMEIRentalAgent>;
   range: RangeObject;
   // values: Array<number>;
   // chairIDs: Array<string>;
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
   myBarGauge = React.createRef<JqxBarGauge>();
   myBarGaugeArray: Array<any> = [];
   labels = {
      connectorColor: "#F03000",
      connectorWidth: 1,
      precision: 0,
      font: {
         size: 11,
      },
   };

   static contextType = AuthContext;

   constructor(props: {
      myPanel: any;
      pairings: Array<ChairIMEIRentalAgent>;
      range: RangeObject;
      keptHeaders: Array<string>;
      numSent: Array<number>;
      chairIDs: Array<string>;
   }) {
      super(props);
      this.numRows = 0;
      this.columns = [];
      this.numUpdates = 0;

      this.state = {
         title: {
            font: {
               size: 12,
            },
            margin: { top: 0, left: 0, right: 0, bottom: 10 },
            text: "Percent Uploaded",
            verticalAlignment: "bottom",
         },
         customColorScheme: {
            colors: ["#F03000"],
            name: "sandhelper",
         },
         range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         pairings: [],
         // values: [0],
         // chairIDs: ["ZMQ-199"],
      };
   }

   parentCallback = (chairIndex: number, numSent: number, chairID: string) => {
      console.log(`${chairIndex}: ${chairID} ${numSent} `);
      this.myBarGaugeArray[chairIndex].current!.val([numSent]);
      console.dir(this.myBarGaugeArray[chairIndex]);
   };

   pullGeoDataFromTrak4() {
      const { auth2, googleToken } = this.context;

      if (this.props.pairings.length > 0) {
         this.numUpdates = 0;
         let tempPairings: Array<ChairIMEIRentalAgent> = [];
         tempPairings.push(this.props.pairings[0]);
         // limit hitting the trak4API to four times max while I'm debugging; remove when fully debugged
         if (this.props.pairings.length > 1) {
            tempPairings.push(this.props.pairings[1]);
            // tempPairings.push(this.props.pairings[12]);
            // tempPairings.push(this.props.pairings[20]);
         }
         // replace tempPairings below with this.props.pairings when fully debugged
         for (var j = 0; j < tempPairings.length; j++) {
            // for (var j = 0; j < this.props.pairings.length; j++) {
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
               const timeInmillisBetweenEachUpload = 75000; //75000 = 75 secs.
               setTimeout(function () {
                  let numRows = 0;
                  // let numGood = 0;
                  getGeosFromTrak4(pairing, range)
                     .then((retVal: any) => {
                        let geoLocArray: [] = retVal.data;
                        let numGeolocs = geoLocArray.length;
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
                              // only consider non-empty objects (some geolocs got purged in createFatChairObjAPI())
                              // numGood++;
                              if (Object.keys(fatChairObj).length > 0) {
                                 let extendedFat = addValuesForAdditionalHeaders(
                                    fatChairObj,
                                    `API_${timeStamp}`
                                 );
                                 // x ends up being the skinny object
                                 let x = Object.keys(extendedFat)
                                    .filter((key) => keptHeaders.includes(key))
                                    .reduce((obj: any, key) => {
                                       obj[key] = extendedFat[key];
                                       return obj;
                                    }, {});
                                 // console.dir(x);
                                 const randomTime = Math.floor(
                                    Math.random() *
                                       (timeInmillisBetweenEachUpload - 10000)
                                 );
                                 setTimeout(() => {
                                    storeChairLocsOnFirebase(
                                       auth2,
                                       googleToken,
                                       x
                                    ).then((retVal) => {
                                       numRows++;
                                       let percentOfUpload = Math.round(
                                          (numRows / numGeolocs) * 100
                                       );
                                       parentCallback(
                                          j,
                                          percentOfUpload,
                                          pairing.chair
                                       );
                                    });
                                 }, randomTime);
                              }
                           });
                        });
                        myPanel.current!.append(
                           `<p style="font-style: normal; color:black; font-size:11px;">${
                              j + 1
                           }. ${
                              pairing.chair
                           } reported ${numGeolocs} geolocations.</p>`
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
      if (this.props.pairings.length > 1) {
         let numGaugesPerRow = 4;
         let numRowsOfBarGauges = Math.floor(
            this.props.pairings.length / numGaugesPerRow
         );
         // let numBarGaugesLastRow = this.props.pairings.length % numGaugesPerRow;
         let barGaugeRowArray = [];
         let barGaugeRowOutput = 0;
         while (barGaugeRowOutput < numRowsOfBarGauges) {
            barGaugeRowArray.push(
               <div style={divFlexRow} className={"classRowbargauge"}>
                  <div style={divFlexCol} className="classColbargauge">
                     <JqxBarGauge
                        // @ts-ignore
                        ref={
                           this.myBarGaugeArray[
                              barGaugeRowOutput * numGaugesPerRow + 0
                           ]
                        }
                        width={250}
                        height={130}
                        startAngle={360}
                        endAngle={0}
                        max={100}
                        colorScheme={"sandhelper"}
                        customColorScheme={this.state.customColorScheme}
                        values={[0]}
                        labels={this.labels}
                        title={this.state.title}
                     />
                     <div>
                        {
                           this.props.pairings[
                              barGaugeRowOutput * numGaugesPerRow + 0
                           ].chair
                        }
                     </div>
                  </div>
                  <div style={divFlexCol} className="classColbargauge">
                     <JqxBarGauge
                        // @ts-ignore
                        ref={
                           this.myBarGaugeArray[
                              barGaugeRowOutput * numGaugesPerRow + 1
                           ]
                        }
                        width={250}
                        height={130}
                        startAngle={360}
                        endAngle={0}
                        max={100}
                        colorScheme={"sandhelper"}
                        customColorScheme={this.state.customColorScheme}
                        values={[0]}
                        labels={this.labels}
                        title={this.state.title}
                     />
                     <div>
                        {
                           this.props.pairings[
                              barGaugeRowOutput * numGaugesPerRow + 1
                           ].chair
                        }
                     </div>
                  </div>
                  <div style={divFlexCol} className="classColbargauge">
                     <JqxBarGauge
                        // @ts-ignore
                        ref={
                           this.myBarGaugeArray[
                              barGaugeRowOutput * numGaugesPerRow + 2
                           ]
                        }
                        width={250}
                        height={130}
                        startAngle={360}
                        endAngle={0}
                        max={100}
                        colorScheme={"sandhelper"}
                        customColorScheme={this.state.customColorScheme}
                        values={[0]}
                        labels={this.labels}
                        title={this.state.title}
                     />
                     <div>
                        {
                           this.props.pairings[
                              barGaugeRowOutput * numGaugesPerRow + 2
                           ].chair
                        }
                     </div>
                  </div>
                  <div style={divFlexCol} className="classColbargauge">
                     <JqxBarGauge
                        // @ts-ignore
                        ref={
                           this.myBarGaugeArray[
                              barGaugeRowOutput * numGaugesPerRow + 3
                           ]
                        }
                        width={250}
                        height={130}
                        startAngle={360}
                        endAngle={0}
                        max={100}
                        colorScheme={"sandhelper"}
                        customColorScheme={this.state.customColorScheme}
                        values={[0]}
                        labels={this.labels}
                        title={this.state.title}
                     />
                     <div>
                        {
                           this.props.pairings[
                              barGaugeRowOutput * numGaugesPerRow + 3
                           ].chair
                        }
                     </div>
                  </div>
               </div>
            );
            barGaugeRowOutput++;
         }
         console.log(`barGaugeRowArray:`);
         console.dir(barGaugeRowArray);
         return (
            <ul>
               {barGaugeRowArray.map((value, index) => {
                  return <li key={index}>{value}</li>;
               })}
            </ul>
         );
      } else {
         this.myBarGaugeArray.push(React.createRef<JqxBarGauge>());
         return (
            <ul>
               <li key={0}>
                  <div style={divFlexRow} className={"classRowbargauge"}>
                     <div style={divFlexCol} className="classColbargauge">
                        <JqxBarGauge
                           // @ts-ignore
                           ref={this.myBarGaugeArray[0]}
                           width={250}
                           height={130}
                           startAngle={360}
                           endAngle={0}
                           max={100}
                           colorScheme={"sandhelper"}
                           customColorScheme={this.state.customColorScheme}
                           values={[0]}
                           labels={this.labels}
                           title={this.state.title}
                        />
                        <div>{this.props.pairings[0].chair}</div>
                     </div>
                  </div>
               </li>
            </ul>
         );
      }
   }

   render() {
      return <>{this.pullGeoDataFromTrak4()}</>;
   }
}

export default ShowAPIPullStatus;
