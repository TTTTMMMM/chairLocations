import * as React from "react";
// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import "../../../styles/index.css";

import { AuthContext } from "../../contexts/AuthContext";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

// import calcDist from "../componentHandlers/calcDist";

import { divFlexRow } from "../../../styles/reactStyling";
import {
   RangeObject,
   Roles,
   DistanceObj,
   AssetGeoLocs,
   CallingFrom,
} from "../../misc/chairLocTypes";
import { IWLocObj } from "../../configs/mapConfigs/mapTypes";

import { months } from "../../misc/months";
import calcDist from "../componentHandlers/calcDist";

interface MyState extends IDataTableProps {
   reportWatch?: any;
   subscribedToDistanceReport: boolean;
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
   chairY: Array<IWLocObj> = [];
   assetGeoLocs: AssetGeoLocs;

   numRows: number | undefined;
   numRowsGeo: number;
   columns: any[] | undefined;
   dataAdapter: null;
   static contextType = AuthContext;

   private myReportTable = React.createRef<JqxDataTable>();
   private csvButton = React.createRef<JqxButton>();

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
      this.csvButtonClicked = this.csvButtonClicked.bind(this);

      this.onRowSelect = this.onRowSelect.bind(this);
      this.showReportContent = this.showReportContent.bind(this);

      this.state = {
         subscribedToDistanceReport: false,
         reportWatch: [],
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
         assets: [],
      };
   }

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
               beach: doc.data().BEACH,
               updatetime: doc.data().UPDATETIME,
               location: {
                  lat: parseFloat(doc.data().LATITUDE),
                  lng: parseFloat(doc.data().LONGITUDE),
               },
            };
            // this.chairY.push(oneLoc);
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
         this.props.assets.forEach((asset) => {
            let numGeoPoints = this.assetGeoLocs[asset].length;
            console.log(
               `calling calcDist with ${numGeoPoints} geoLocs from ${asset}.`
            );
            numGeoPoints > 1
               ? calcDist(
                    this.assetGeoLocs[asset],
                    CallingFrom.generateDistanceReport,
                    this.props.myPanel,
                    auth2,
                    googleToken
                 )
               : null;
         });
      }
   };

   subscribeToDistanceReport() {
      if (this.props.assets.length > 0) {
         this.setState({ assets: this.props.assets });
         this.setState({ range: this.props.range });
         this.setState({ reportWatch: [] });
         this.numUpdates = 0;
         // console.dir(this.props.assets);
         // console.dir(this.props.range);
         let period = this.props.range.startDate
            .split("-")[0]
            .concat(this.props.range.startDate.split("-")[1]);
         this.props.assets.forEach((asset) => {
            // this.unsubFromDistanceReport();
            this.distReport = firebase
               .firestore()
               .collection(`distReport`)
               .where("assetlabel", "==", asset)
               .where("period", "==", period);
            this.unsubFromDistanceReport = this.distReport.onSnapshot(
               this.onCollectionUpdate
            );
            this.setState({ subscribedToDistanceReport: true });
         });
      }
   }

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

   unsubscribeFromDistanceReport() {
      if (typeof this.unsubFromDistanceReport != "undefined") {
         this.setState({ subscribedToDistanceReport: false });
         this.numUpdates = 0;
      }
   }

   unsubscribeFromAssetWithinRange() {
      if (typeof this.unsubscribeWithinRange != "undefined") {
         this.unsubscribeWithinRange();
         this.numUpdates = 0;
         this.chairY.length = 0;
      }
   }

   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      // console.log(`In onCollectionUpdate() <${util.inspect(querySnapshot)}>`);
      this.numUpdates!++;
      let reportWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               assetlabel: string;
               period: string;
               d01: DistanceObj;
               d02: DistanceObj;
               d03: DistanceObj;
               d04: DistanceObj;
               d05: DistanceObj;
               d06: DistanceObj;
               d07: DistanceObj;
               d08: DistanceObj;
               d09: DistanceObj;
               d10: DistanceObj;
               d11: DistanceObj;
               d12: DistanceObj;
               d13: DistanceObj;
               d14: DistanceObj;
               d15: DistanceObj;
               d16: DistanceObj;
               d17: DistanceObj;
               d18: DistanceObj;
               d19: DistanceObj;
               d20: DistanceObj;
               d21: DistanceObj;
               d22: DistanceObj;
               d23: DistanceObj;
               d24: DistanceObj;
               d25: DistanceObj;
               d26: DistanceObj;
               d27: DistanceObj;
               d28: DistanceObj;
               d29: DistanceObj;
               d30: DistanceObj;
               d31: DistanceObj;
            };
            id: any;
         }) => {
            const {
               assetlabel,
               period,
               d01,
               d02,
               d03,
               d04,
               d05,
               d06,
               d07,
               d08,
               d09,
               d10,
               d11,
               d12,
               d13,
               d14,
               d15,
               d16,
               d17,
               d18,
               d19,
               d20,
               d21,
               d22,
               d23,
               d24,
               d25,
               d26,
               d27,
               d28,
               d29,
               d30,
               d31,
            } = doc.data();
            reportWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               assetlabel,
               period,
               d01,
               d02,
               d03,
               d04,
               d05,
               d06,
               d07,
               d08,
               d09,
               d10,
               d11,
               d12,
               d13,
               d14,
               d15,
               d16,
               d17,
               d18,
               d19,
               d20,
               d21,
               d22,
               d23,
               d24,
               d25,
               d26,
               d27,
               d28,
               d29,
               d30,
               d31,
            });
         }
      );
      this.setState({
         reportWatch: this.state.reportWatch.concat(reportWatch),
      });
      this.numRows++;
      // console.log(
      //    `%c reportWatch<${this.numUpdates}>`,
      //    "background:white; border: 3px solid #7713AD; margin: 2px; padding: 3px; color: #7713AD;"
      // );
   };

   showReportContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         const source = {
            datafields: [
               { name: "assetlabel", type: "string" },
               { name: "period", type: "string" },
               { name: "d01", type: "string" },
               { name: "d02", type: "string" },
               { name: "d03", type: "string" },
               { name: "d04", type: "string" },
               { name: "d05", type: "string" },
               { name: "d06", type: "string" },
               { name: "d07", type: "string" },
               { name: "d08", type: "string" },
               { name: "d09", type: "string" },
               { name: "d10", type: "string" },
               { name: "d11", type: "string" },
               { name: "d12", type: "string" },
               { name: "d13", type: "string" },
               { name: "d14", type: "string" },
               { name: "d15", type: "string" },
               { name: "d16", type: "string" },
               { name: "d17", type: "string" },
               { name: "d18", type: "string" },
               { name: "d19", type: "string" },
               { name: "d20", type: "string" },
               { name: "d21", type: "string" },
               { name: "d22", type: "string" },
               { name: "d23", type: "string" },
               { name: "d24", type: "string" },
               { name: "d25", type: "string" },
               { name: "d26", type: "string" },
               { name: "d27", type: "string" },
               { name: "d28", type: "string" },
               { name: "d29", type: "string" },
               { name: "d30", type: "string" },
               { name: "d31", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               this.columns!.length = 0;
               let i = 0;
               this.state.reportWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     assetlabel: val.assetlabel,
                     period: val.period,
                     d01:
                        val.d01 &&
                        val.d01.inFeet.concat(` (${val.d01.inMiles})`),
                     d02:
                        val.d02 &&
                        val.d02.inFeet.concat(` (${val.d02.inMiles})`),
                     d03: val.d03 && val.d03.inFeet,
                     d04: val.d04 && val.d04.inFeet,
                     d05: val.d05 && val.d05.inFeet,
                     d06: val.d06 && val.d06.inFeet,
                     d07: val.d07 && val.d07.inFeet,
                     d08: val.d08 && val.d08.inFeet,
                     d09: val.d09 && val.d09.inFeet,
                     d10: val.d10 && val.d10.inFeet,
                     d11: val.d11 && val.d11.inFeet,
                     d12: val.d12 && val.d12.inFeet,
                     d13: val.d13 && val.d13.inFeet,
                     d14: val.d14 && val.d14.inFeet,
                     d15: val.d15 && val.d15.inFeet,
                     d16: val.d16 && val.d16.inFeet,
                     d17: val.d17 && val.d17.inFeet,
                     d18: val.d18 && val.d18.inFeet,
                     d19: val.d19 && val.d19.inFeet,
                     d20: val.d20 && val.d20.inFeet,
                     d21: val.d21 && val.d21.inFeet,
                     d22: val.d22 && val.d22.inFeet,
                     d23: val.d23 && val.d23.inFeet,
                     d24: val.d24 && val.d24.inFeet,
                     d25: val.d25 && val.d25.inFeet,
                     d26: val.d26 && val.d26.inFeet,
                     d27: val.d27 && val.d27.inFeet,
                     d28: val.d28 && val.d28.inFeet,
                     d29: val.d29 && val.d29.inFeet,
                     d30: val.d30 && val.d30.inFeet,
                     d31: val.d31 && val.d31.inFeet,
                  };
                  this.numRows!++;
               });
               return data;
            },
         };
         this.dataAdapter = new jqx.dataAdapter(source);
         // --
         const columnWidths = [
            ["ASSETLABEL", 80],
            ["d01", 56],
         ];
         this.columns!.push({
            text: "Chair",
            width: columnWidths[0][1],
            datafield: "assetlabel",
            align: "center",
            cellclassname: "assetlabelClass",
            editable: false,
         });
         this.columns!.push({
            text: "Period",
            width: columnWidths[0][1],
            datafield: "period",
            align: "center",
            hidden: true,
            editable: false,
         });
         let i = 0;
         while (i++ < 31) {
            this.columns!.push({
               text: `${i.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
               })}`,
               datafield: `d${i.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
               })}`,
               width: columnWidths[1][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            });
         }
         return (
            <>
               <JqxDataTable
                  ref={this.myReportTable}
                  width={920}
                  theme={"fresh"}
                  source={this.dataAdapter}
                  columns={this.columns}
                  filterable={true}
                  pageable={true}
                  altRows={true}
                  autoRowHeight={true}
                  height={625}
                  sortable={true}
                  onRowSelect={this.onRowSelect}
                  columnsReorder={true}
                  columnsResize={true}
                  editable={false}
                  key={this.numUpdates} // this forces a re-render of the table!
                  editSettings={this.state.editSettings}
                  pageSize={100}
               />
               <div style={divFlexRow}>
                  <JqxButton
                     ref={this.csvButton}
                     onClick={this.csvButtonClicked}
                     width={325}
                     height={30}
                     theme={"fresh"}
                     textPosition={"center"}
                  >
                     Output CSV File
                  </JqxButton>
               </div>
            </>
         );
      } else {
         return <div></div>;
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
         this.subscribeToDistanceReport();
         this.subscribeToAssetBeaconingWithinDateRange();
      }
      if (!isLoggedInToFirebase && this.state.subscribedToDistanceReport) {
         this.unsubscribeFromDistanceReport();
         this.unsubscribeWithinRange();
      }
      if (userObjFmServer.role === Roles.notloggedin && isLoggedInToFirebase) {
         this.unsubscribeFromDistanceReport();
         this.unsubscribeWithinRange();
      }
      return <div>{this.showReportContent()}</div>;
   }

   private onRowSelect(e: any): void {
      let jsr = e.args.row;
      let theKeys = Object.keys(jsr);
      let prepend = `temp.push({`;
      this.props.myPanel.current!.append(
         `<p style="color:#7713AD ; font-size:11px;">${prepend}</p>`
      );
      theKeys.forEach((x) => {
         this.props.myPanel.current!.append(
            `<p style="color:#7713AD ; font-size:11px;">${x}: "${jsr[x]}",</p>`
         );
      });
      this.props.myPanel.current!.append(
         `<p style="color:#7713AD ; font-size:11px;">});</p>`
      );
   }

   private csvButtonClicked() {
      this.props.myPanel.current!.append(
         `<p style="color:#7713AD ; font-size:11px;">CSV Button Clicked</p>`
      );
   }
}

export default GenerateDistanceReport;
