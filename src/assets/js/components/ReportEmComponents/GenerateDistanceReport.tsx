import * as React from "react";
// @ts-ignore
import JqxBarGauge, {
   IBarGaugeProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbargauge";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import "../../../styles/index.css";
import { divFlexCol, divFlexRow } from "../../../styles/reactStyling";

import { AuthContext } from "../../contexts/AuthContext";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import moment from "moment";

import {
   RangeObject,
   Roles,
   AssetCount,
   AssetGeoLocs,
   CallingFrom,
} from "../../misc/chairLocTypes";
import { IWLocObj } from "../../configs/mapConfigs/mapTypes";

import { months } from "../../misc/months";
import calcDist from "../componentHandlers/calcDist";

// interface MyState extends IDataTableProps {
interface MyState extends IBarGaugeProps {
   reportWatch?: any;
   assets: Array<string>;
   range: RangeObject;
}
class GenerateDistanceReport extends React.PureComponent<
   {
      myPanel: any;
      assets: Array<string>;
      range: RangeObject;
   },
   MyState
> {
   distReport: any;
   numUpdates: number | undefined;
   numUpdatesGeo: number;
   unsubFromDistanceReport: any | undefined;
   unsubscribeWithinRange: any | undefined;
   acArr: Array<AssetCount> = [];
   assetGeoLocs: AssetGeoLocs;
   assetCounts: Array<number> = [];
   maxDaysForBarGauge: number = 31;

   numRows: number | undefined;
   numRowsGeo: number;
   columns: any[] | undefined;
   dataAdapter: null;
   static contextType = AuthContext;
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

   constructor(props: {
      myPanel: any;
      assets: Array<string>;
      range: RangeObject;
   }) {
      super(props);
      this.distReport = "";
      this.numRows = 0;
      this.numRowsGeo = 0;
      this.columns = [];
      this.numUpdates = 0;
      this.numUpdatesGeo = 0;
      this.assetGeoLocs = {};

      this.showReportContent = this.showReportContent.bind(this);

      this.state = {
         reportWatch: [],
         range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         assets: [],
         title: {
            font: {
               size: 12,
            },
            margin: { top: 0, left: 0, right: 0, bottom: 10 },
            text: "# Days Reported",
            verticalAlignment: "bottom",
         },
         customColorScheme: {
            colors: ["#F03000"],
            name: "sandhelper",
         },
      };
   }

   barGaugeCallback = (chairID: string) => {
      let chairIndex = this.props.assets.indexOf(chairID);
      this.acArr.forEach((x) => {
         if (x.asset === chairID) {
            x.numDistances++;
            this.myBarGaugeArray[chairIndex].current!.val([x.numDistances]);
            // console.dir(x);
         }
      });
   };

   onGeoPullsUpdate = (querySnapshot: any) => {
      const { auth2, googleToken } = this.context;
      this.numUpdatesGeo++;
      this.numRowsGeo = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               ASSETLABEL: string;
               BEACH: string;
               CELLACCURACY: string;
               DEVICEID: string;
               FNAME: string;
               GPS_MPH: number;
               GPS_ISCELLTOWER: string;
               ID: string;
               IMEI: string;
               LATITUDE: string;
               LONGITUDE: string;
               RENTALAGENT: string;
               STATE: string;
               UPDATETIME: string;
               UPLOADFBTIME: string;
            };
            id: any;
         }) => {
            let oneLoc: IWLocObj = {
               id: doc.data().ID,
               assetlabel: doc.data().ASSETLABEL,
               rentalAgent: doc.data().RENTALAGENT,
               beach: doc.data().BEACH,
               updatetime: doc.data().UPDATETIME,
               location: {
                  lat: parseFloat(doc.data().LATITUDE),
                  lng: parseFloat(doc.data().LONGITUDE),
               },
            };
            this.assetGeoLocs[doc.data().ASSETLABEL].push(oneLoc);
            this.numRowsGeo++;
         }
      );
      // this.numRowsGeo++;
      // console.log(
      //    `%c onGeoPullsUpdate<${this.numUpdatesGeo}>`,
      //    "background:white; border: 3px solid blue; margin: 2px; padding: 3px; color:blue;"
      // );
      if (this.numUpdatesGeo >= this.props.assets.length) {
         for (var j = 0; j < this.props.assets.length; j++) {
            // execute each iteration of this for loop with some delay
            (function (
               j: number,
               assets: Array<string>,
               assetGeoLocs: AssetGeoLocs,
               myPanel: any,
               barGaugeCallback: any
            ) {
               setTimeout(function () {
                  let numGeoPoints = assetGeoLocs[assets[j]].length;
                  if (numGeoPoints > 1) {
                     calcDist(
                        assetGeoLocs[assets[j]],
                        CallingFrom.generateDistanceReport,
                        myPanel,
                        auth2,
                        googleToken,
                        barGaugeCallback
                     );
                  } else {
                     myPanel.current!.append(
                        `<p style="color:#000000 ; font-size:10px;">${assets[j]} had ${numGeoPoints} geos</p>`
                     );
                  }
               }, 2500 * j); // send reports to firebase 2.5 seconds apart
            })(
               j,
               this.props.assets,
               this.assetGeoLocs,
               this.props.myPanel,
               this.barGaugeCallback
            );
         }
         // });
      }
   };

   subscribeToAssetBeaconingWithinDateRange() {
      if (this.props.assets.length > 0) {
         this.setState({ assets: this.props.assets });
         this.setState({ range: this.props.range });
         let monthNumber = (
            "0" +
            (months.indexOf(this.props.range.startDate.split("-")[1]) + 1)
         ).slice(-2);
         let year = this.props.range.startDate.split("-")[0];
         let startDay = "01";
         let endDay = "31";
         let endTime = endDay.concat("T23:59:59Z");
         let beginDate = year.concat(`-${monthNumber}-${startDay}`);
         let endDate = year.concat(`-${monthNumber}-${endTime}`);
         this.props.assets.forEach((asset) => {
            let assetWithinRange = firebase
               .firestore()
               .collection("chairLocs")
               .where("ASSETLABEL", "==", asset)
               .where("UPDATETIME", ">=", beginDate)
               .where("UPDATETIME", "<=", endDate);
            this.unsubscribeWithinRange = assetWithinRange.onSnapshot(
               this.onGeoPullsUpdate
            );
            this.assetGeoLocs[asset] = new Array();
         });
      }
   }

   unsubscribeFromAssetWithinRange() {
      if (typeof this.unsubscribeWithinRange != "undefined") {
         this.unsubscribeWithinRange();
         this.numUpdates = 0;
      }
   }

   componentDidMount() {}

   showReportContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         if (this.props.assets.length >= 1) {
            let numGaugesPerRow = 4;
            let numRowsOfBarGauges = Math.floor(
               this.props.assets.length / numGaugesPerRow
            );
            let numBarGaugesLastRow =
               this.props.assets.length % numGaugesPerRow;
            let barGaugeRowArray = [];
            let barGaugeRowOutput = 0;
            while (barGaugeRowOutput < numRowsOfBarGauges) {
               this.myBarGaugeArray.push(React.createRef<JqxBarGauge>());
               this.myBarGaugeArray.push(React.createRef<JqxBarGauge>());
               this.myBarGaugeArray.push(React.createRef<JqxBarGauge>());
               this.myBarGaugeArray.push(React.createRef<JqxBarGauge>());
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
                           max={this.maxDaysForBarGauge}
                           colorScheme={"sandhelper"}
                           customColorScheme={this.state.customColorScheme}
                           values={[0]}
                           labels={this.labels}
                           title={this.state.title}
                        />
                        <div>
                           {
                              this.props.assets[
                                 barGaugeRowOutput * numGaugesPerRow + 0
                              ]
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
                           max={this.maxDaysForBarGauge}
                           colorScheme={"sandhelper"}
                           customColorScheme={this.state.customColorScheme}
                           values={[0]}
                           labels={this.labels}
                           title={this.state.title}
                        />
                        <div>
                           {
                              this.props.assets[
                                 barGaugeRowOutput * numGaugesPerRow + 1
                              ]
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
                           max={this.maxDaysForBarGauge}
                           colorScheme={"sandhelper"}
                           customColorScheme={this.state.customColorScheme}
                           values={[0]}
                           labels={this.labels}
                           title={this.state.title}
                        />
                        <div>
                           {
                              this.props.assets[
                                 barGaugeRowOutput * numGaugesPerRow + 2
                              ]
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
                           max={this.maxDaysForBarGauge}
                           colorScheme={"sandhelper"}
                           customColorScheme={this.state.customColorScheme}
                           values={[0]}
                           labels={this.labels}
                           title={this.state.title}
                        />
                        <div>
                           {
                              this.props.assets[
                                 barGaugeRowOutput * numGaugesPerRow + 3
                              ]
                           }
                        </div>
                     </div>
                  </div>
               );
               barGaugeRowOutput++;
            }
            let barGaugeIndividualOutput = 0;
            while (barGaugeIndividualOutput < numBarGaugesLastRow) {
               this.myBarGaugeArray.push(React.createRef<JqxBarGauge>());
               barGaugeRowArray.push(
                  <div style={divFlexRow} className={"classRowbargauge"}>
                     <div style={divFlexCol} className="classColbargauge">
                        <JqxBarGauge
                           // @ts-ignore
                           ref={
                              this.myBarGaugeArray[
                                 barGaugeRowOutput * numGaugesPerRow +
                                    barGaugeIndividualOutput
                              ]
                           }
                           width={250}
                           height={130}
                           startAngle={360}
                           endAngle={0}
                           max={this.maxDaysForBarGauge}
                           colorScheme={"sandhelper"}
                           customColorScheme={this.state.customColorScheme}
                           values={[0]}
                           labels={this.labels}
                           title={this.state.title}
                        />
                        <div>
                           {
                              this.props.assets[
                                 barGaugeRowOutput * numGaugesPerRow +
                                    barGaugeIndividualOutput
                              ]
                           }
                        </div>
                     </div>
                  </div>
               );
               barGaugeIndividualOutput++;
            }
            return (
               <ul>
                  {barGaugeRowArray.map((value, index) => {
                     return <li key={index}>{value}</li>;
                  })}
               </ul>
            );
         } else {
            return <></>;
         }
      } else {
         return <></>;
      }
   }

   render() {
      const { isLoggedInToFirebase, userObjFmServer } = this.context;
      let changeInAssets = false;
      changeInAssets =
         JSON.stringify(this.props.assets) != JSON.stringify(this.state.assets);
      let changeInRange =
         this.props.range.startDate !== this.state.range.startDate;
      if (isLoggedInToFirebase && (changeInAssets || changeInRange)) {
         this.props.assets.forEach((x) => {
            let ac: AssetCount = { asset: x, numDistances: 0 };
            this.acArr.push(ac);
         });
         // console.dir(this.props.range);
         //calculate the maximum number of days that could have geoloc entries
         const now = moment();
         const beginDate = moment(this.props.range.startDate);
         const endDate = moment(this.props.range.endDate.split("T")[0]);
         if (now.isAfter(beginDate) && now.isBefore(endDate)) {
            this.maxDaysForBarGauge = now.date();
         } else {
            this.maxDaysForBarGauge = beginDate.daysInMonth();
         }
         this.subscribeToAssetBeaconingWithinDateRange();
      }
      if (!isLoggedInToFirebase) {
         this.unsubscribeWithinRange();
      }
      if (userObjFmServer.role === Roles.notloggedin && isLoggedInToFirebase) {
         this.unsubscribeWithinRange();
      }
      return <>{this.showReportContent()}</>;
   }
}

export default GenerateDistanceReport;
