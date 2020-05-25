import * as React from "react";
// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxCheckBox from "jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import "../../styles/index.css";

import MapContainer from "./MapContainer";
import cellRendererCellTower from "../renderers/cellRendererCellTower";

import { AuthContext } from "../contexts/AuthContext";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

import { divFlexRow } from "../../styles/reactStyling";
import { IWLocObj } from "../configs/mapConfigs/mapTypes";
import {
   CallingFrom,
   RangeObject,
   GeoPoint,
   DateGeoObj,
   DistanceObj,
   CumDistDaily,
   Roles,
} from "../misc/chairLocTypes";
import { calculateDistance, sumDistance } from "../misc/calculateDistance";

interface MyState extends IDataTableProps {
   chairDataWatch?: any;
   subscribedLabelSpecific: boolean;
   subscribedWithinRange: boolean;
   displayTableMode?: boolean;
   asset?: string;
   range?: RangeObject;
}
class ShowChairData extends React.PureComponent<
   {
      myPanel: any;
      asset: string | undefined;
      range: RangeObject;
      callingFrom: CallingFrom;
   },
   MyState
> {
   assetLabelSpecific: any;
   assetWithinRange: any;
   numUpdates: number | undefined;
   unsubscribeLabelSpecific: any | undefined;
   unsubscribeWithinRange: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   modifyKey: string | undefined;
   chairY: Array<IWLocObj> = [];
   chairYBackup: Array<IWLocObj> = [];
   selectedMappings: Array<IWLocObj> = [];
   static contextType = AuthContext;

   private myChairLocTable = React.createRef<JqxDataTable>();
   private tableModeButton = React.createRef<JqxButton>();
   private calcDistButton = React.createRef<JqxButton>();
   private myCheckBox = React.createRef<JqxCheckBox>();
   // private mapSelectionButton = React.createRef<JqxButton>();

   constructor(props: {
      myPanel: any;
      asset: string;
      range: RangeObject;
      callingFrom: CallingFrom;
   }) {
      super(props);
      this.assetLabelSpecific = "";
      this.assetWithinRange = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.tableModeButtonClicked = this.tableModeButtonClicked.bind(this);
      this.calcDistButtonClicked = this.calcDistButtonClicked.bind(this);
      this.checkedEvent = this.checkedEvent.bind(this);
      this.uncheckedEvent = this.uncheckedEvent.bind(this);

      this.onRowSelect = this.onRowSelect.bind(this);
      this.getChairLocContent = this.getChairLocContent.bind(this);

      this.state = {
         subscribedLabelSpecific: false,
         subscribedWithinRange: false,
         chairDataWatch: [],
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
         displayTableMode: true,
         range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         asset: "",
      };
   }

   // this subscription is used by CleanAndUpload Component
   subscribeToAssetUploadedToday() {
      if (this.props.asset!.length > 0) {
         this.unsubscribeFromAssetLabelSpecific();
         this.unsubscribeFromAssetWithinRange();
         this.setState({ asset: this.props.asset });
         const beginningOfDay = new Date(
            new Date().toISOString().substr(0, 10)
         ).toISOString();
         this.assetLabelSpecific = firebase
            .firestore()
            .collection("chairLocs")
            .where("ASSETLABEL", "==", this.props.asset)
            .where("UPLOADFBTIME", ">", beginningOfDay);
         this.unsubscribeLabelSpecific = this.assetLabelSpecific.onSnapshot(
            this.onCollectionUpdate
         );
         this.chairY.length = 0;
         this.chairYBackup.length = 0;
         this.selectedMappings.length = 0;
         this.setState({ subscribedLabelSpecific: true });
      }
   }

   // this subscription is used by ChairResultSide Component and defined in ChairQuerySide Component
   subscribeToAssetBeaconingWithinDateRange() {
      if (this.props.asset!.length > 0) {
         this.unsubscribeFromAssetLabelSpecific();
         this.unsubscribeFromAssetWithinRange();
         this.setState({ asset: this.props.asset });
         this.setState({ range: this.props.range });
         this.assetWithinRange = firebase
            .firestore()
            .collection("chairLocs")
            .where("ASSETLABEL", "==", this.props.asset)
            .where("UPDATETIME", ">=", this.props.range.startDate)
            .where("UPDATETIME", "<=", this.props.range.endDate);
         this.unsubscribeWithinRange = this.assetWithinRange.onSnapshot(
            this.onCollectionUpdate
         );
         this.chairY.length = 0;
         this.chairYBackup.length = 0;
         this.selectedMappings.length = 0;
         this.setState({ subscribedWithinRange: true });
      }
   }

   unsubscribeFromAssetLabelSpecific() {
      if (typeof this.unsubscribeLabelSpecific != "undefined") {
         this.unsubscribeLabelSpecific();
         this.setState({ subscribedLabelSpecific: false });
         this.numUpdates = 0;
         this.chairY.length = 0;
         this.chairYBackup.length = 0;
         this.selectedMappings.length = 0;
      }
   }

   unsubscribeFromAssetWithinRange() {
      if (typeof this.unsubscribeWithinRange != "undefined") {
         this.unsubscribeWithinRange();
         this.setState({ subscribedWithinRange: false });
         this.numUpdates = 0;
         this.chairY.length = 0;
         this.chairYBackup.length = 0;
         this.selectedMappings.length = 0;
      }
   }

   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      // console.log(`In onCollectionUpdate() <${util.inspect(querySnapshot)}>`);
      this.numUpdates!++;
      let chairDataWatch: any[] = [];
      this.numRows = 0;
      this.chairY.length = 0;
      this.chairYBackup.length = 0;
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
            const {
               ASSETLABEL,
               BEACH,
               CELLACCURACY,
               DEVICEID,
               FNAME,
               GPS_MPH,
               GPS_ISCELLTOWER,
               ID,
               IMEI,
               LATITUDE,
               LONGITUDE,
               RENTALAGENT,
               STATE,
               UPDATETIME,
               UPLOADFBTIME,
            } = doc.data();
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
            this.chairY.push(oneLoc);
            this.chairYBackup.push(oneLoc);
            chairDataWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               ASSETLABEL,
               BEACH,
               CELLACCURACY,
               DEVICEID,
               FNAME,
               GPS_MPH,
               GPS_ISCELLTOWER,
               ID,
               IMEI,
               LATITUDE,
               LONGITUDE,
               RENTALAGENT,
               STATE,
               UPDATETIME,
               UPLOADFBTIME,
            });
         }
      );
      this.setState({
         chairDataWatch: chairDataWatch,
      });
      this.numRows++;
      // console.log(
      //    `%c ChairDataWatch<${this.numUpdates}>`,
      //    "background:white; border: 3px solid blue; margin: 2px; padding: 3px; color:blue;"
      // );
   };

   getChairLocContent() {
      const { isLoggedInToFirebase } = this.context;
      if (
         isLoggedInToFirebase &&
         this.chairY.length > 0 &&
         this.state.displayTableMode
      ) {
         const source = {
            datafields: [
               { name: "ASSETLABEL", type: "string" },
               { name: "BEACH", type: "string" },
               { name: "key", type: "string" },
               { name: "CELLACCURACY", type: "string" },
               { name: "DEVICEID", type: "string" },
               { name: "FNAME", type: "string" },
               { name: "GPS_MPH", type: "number" },
               { name: "GPS_ISCELLTOWER", type: "string" },
               { name: "ID", type: "string" },
               { name: "IMEI", type: "string" },
               { name: "LATITUDE", type: "string" },
               { name: "LONGITUDE", type: "string" },
               { name: "RENTALAGENT", type: "string" },
               { name: "STATE", type: "string" },
               { name: "UPDATETIME", type: "string" },
               { name: "UPLOADFBTIME", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.chairDataWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     ASSETLABEL: val.ASSETLABEL,
                     BEACH: val.BEACH,
                     CELLACCURACY: val.CELLACCURACY,
                     DEVICEID: val.DEVICEID,
                     FNAME: val.FNAME,
                     GPS_MPH: val.GPS_MPH,
                     GPS_ISCELLTOWER: val.GPS_ISCELLTOWER,
                     ID: val.ID,
                     IMEI: val.IMEI,
                     LATITUDE: val.LATITUDE,
                     LONGITUDE: val.LONGITUDE,
                     RENTALAGENT: val.RENTALAGENT,
                     STATE: val.STATE,
                     UPDATETIME: val.UPDATETIME,
                     UPLOADFBTIME: val.UPLOADFBTIME,
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
            ["BEACH", 180],
            ["CELLACCURACY", 50],
            ["DEVICEID", 70],
            ["FNAME", 100],
            ["ID", 83],
            ["IMEI", 80],
            ["LATITUDE", 90],
            ["LONGITUDE", 90],
            ["RENTALAGENT", 250],
            ["STATE", 100],
            ["UPDATETIME", 150],
            ["UPLOADFBTIME", 150],
            ["GPS_MPH", 79],
            ["GPS_ISCELLTOWER", 80],
         ];
         this.columns = [
            {
               text: "ID",
               datafield: "ID",
               width: columnWidths[5][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            },
            {
               text: "State",
               datafield: "STATE",
               width: columnWidths[10][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            },
            {
               text: "Beach",
               datafield: "BEACH",
               width: columnWidths[1][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            },
            {
               text: "Update Time",
               datafield: "UPDATETIME",
               width: columnWidths[11][1],
               align: "center",
               editable: false,
            },
            {
               text: "Lat.",
               datafield: "LATITUDE",
               width: columnWidths[7][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            },
            {
               text: "Long.",
               datafield: "LONGITUDE",
               width: columnWidths[8][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            },
            {
               text: "GPS MPH",
               datafield: "GPS_MPH",
               width: columnWidths[13][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            },
            {
               text: "Fm. Sat.",
               datafield: "GPS_ISCELLTOWER",
               width: columnWidths[14][1],
               align: "center",
               cellsalign: "center",
               editable: false,
               cellsrenderer: cellRendererCellTower,
            },
            {
               text: "Chair",
               width: columnWidths[0][1],
               datafield: "ASSETLABEL",
               align: "center",
               cellclassname: "ASSETLABELClass",
               editable: false,
            },
            {
               text: "Rental Agent",
               datafield: "RENTALAGENT",
               width: columnWidths[9][1],
               align: "center",
               cellsalign: "center",
               editable: false,
            },
            {
               text: "File",
               datafield: "FNAME",
               width: columnWidths[4][1],
               align: "center",
               editable: false,
               hidden: true,
            },
            {
               text: "Device ID",
               datafield: "DEVICEID",
               width: columnWidths[3][1],
               align: "center",
               cellsalign: "center",
               editable: false,
               hidden: true,
            },
            {
               text: "IMEI",
               datafield: "IMEI",
               width: columnWidths[6][1],
               align: "center",
               cellsalign: "center",
               editable: false,
               hidden: true,
            },
            {
               text: "FB Upload Time",
               datafield: "UPLOADFBTIME",
               width: columnWidths[12][1],
               align: "center",
               editable: false,
               hidden: true,
            },
            {
               text: "Cell Accuracy",
               datafield: "CELLACCURACY",
               width: columnWidths[12][1],
               align: "center",
               cellsalign: "center",
               editable: false,
               hidden: true,
            },
         ];
         return (
            <>
               <JqxDataTable
                  ref={this.myChairLocTable}
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
                     ref={this.calcDistButton}
                     onClick={this.calcDistButtonClicked}
                     width={325}
                     height={30}
                     theme={"fresh"}
                     textPosition={"center"}
                     disabled={
                        this.props.callingFrom ===
                        CallingFrom.cleanAndUploadFiles
                     }
                  >
                     Calculate Distance
                  </JqxButton>
                  <JqxButton
                     ref={this.tableModeButton}
                     onClick={this.tableModeButtonClicked}
                     width={325}
                     height={30}
                     theme={"fresh"}
                     textPosition={"center"}
                  >
                     Toggle Display
                  </JqxButton>
                  <JqxCheckBox
                     ref={this.myCheckBox}
                     style={{ marginLeft: "10px", float: "left" }}
                     width={120}
                     height={25}
                     theme={"fresh"}
                     onChecked={this.checkedEvent}
                     onUnchecked={this.uncheckedEvent}
                     disabled={false}
                  >
                     Map Selection
                  </JqxCheckBox>
               </div>
            </>
         );
      } else if (
         isLoggedInToFirebase &&
         this.chairY.length > 0 &&
         !this.state.displayTableMode
      ) {
         return (
            <>
               <MapContainer {...this.chairY}></MapContainer>
               <div style={divFlexRow}>
                  <JqxButton
                     ref={this.calcDistButton}
                     onClick={this.calcDistButtonClicked}
                     width={325}
                     height={30}
                     theme={"fresh"}
                     textPosition={"center"}
                     disabled={
                        this.props.callingFrom ===
                        CallingFrom.cleanAndUploadFiles
                     }
                  >
                     Calculate Distance
                  </JqxButton>
                  <JqxButton
                     ref={this.tableModeButton}
                     onClick={this.tableModeButtonClicked}
                     width={325}
                     height={30}
                     theme={"fresh"}
                     textPosition={"center"}
                  >
                     Toggle Display
                  </JqxButton>
                  <JqxCheckBox
                     ref={this.myCheckBox}
                     style={{ marginLeft: "10px", float: "left" }}
                     width={120}
                     height={30}
                     theme={"fresh"}
                     disabled={true}
                  >
                     Map Selection
                  </JqxCheckBox>
               </div>
            </>
         );
      } else {
         return <div></div>;
      }
   }
   render() {
      const { isLoggedInToFirebase, userObjFmServer } = this.context;
      if (this.props.callingFrom === CallingFrom.cleanAndUploadFiles) {
         let changeInAsset = this.props.asset != this.state.asset;
         if (isLoggedInToFirebase && changeInAsset) {
            this.subscribeToAssetUploadedToday();
         }
         if (!isLoggedInToFirebase && this.state.subscribedLabelSpecific) {
            this.unsubscribeFromAssetLabelSpecific();
         }
      } else if (this.props.callingFrom === CallingFrom.chairResultsSide) {
         let changeInAsset = this.props.asset != this.state.asset;
         let changeInRange = this.props.range != this.state.range;
         if (isLoggedInToFirebase && (changeInAsset || changeInRange)) {
            this.subscribeToAssetBeaconingWithinDateRange();
         }
         if (!isLoggedInToFirebase && this.state.subscribedWithinRange) {
            this.unsubscribeFromAssetWithinRange();
         }
      }
      if (userObjFmServer.role === Roles.notloggedin && isLoggedInToFirebase) {
         this.subscribeToAssetUploadedToday();
         this.unsubscribeFromAssetWithinRange();
      }
      return <div>{this.getChairLocContent()}</div>;
   }

   private onRowSelect(e: any): void {
      let jsr = e.args.row;
      let theKeys = Object.keys(jsr);
      let prepend = `temp.push({`;
      this.props.myPanel.current!.append(
         `<p style="color:#286107 ; font-size:11px;">${prepend}</p>`
      );
      theKeys.forEach((x) => {
         this.props.myPanel.current!.append(
            `<p style="color:#286107 ; font-size:11px;">${x}: "${jsr[x]}",</p>`
         );
      });
      this.props.myPanel.current!.append(
         `<p style="color:#286107 ; font-size:11px;">});</p>`
      );
   }

   private tableModeButtonClicked() {
      this.myCheckBox.current!.val()
         ? this.chairY.splice(0, this.chairY.length, ...this.selectedMappings)
         : this.chairY.splice(0, this.chairY.length, ...this.chairYBackup);
      this.setState({ displayTableMode: !this.state.displayTableMode });
      this.myCheckBox.current!.uncheck();
   }

   private calcDistButtonClicked() {
      if (this.props.callingFrom === CallingFrom.chairResultsSide) {
         let prevGeoPoint: GeoPoint = {
            lat: this.chairYBackup[0].location.lat,
            lng: this.chairYBackup[0].location.lng,
         };
         let geo1: DateGeoObj = {
            geoDate: this.chairYBackup[0].updatetime.slice(0, 10),
            geo: prevGeoPoint,
         };
         let cumulativeDistanceObj: DistanceObj = {
            inMeters: 0,
            inFeet: 0,
            inMiles: 0,
         };
         let cumDistDaily: CumDistDaily = {
            dailyDate: this.chairYBackup[0].updatetime.slice(0, 10),
            distObj: cumulativeDistanceObj,
         };
         // ---- loop through each document in resultset from firebase
         this.chairYBackup.forEach((x) => {
            let endGeoPoint: GeoPoint = {
               lat: x.location.lat,
               lng: x.location.lng,
            };
            let geo2: DateGeoObj = {
               geoDate: x.updatetime.slice(0, 10),
               geo: endGeoPoint,
            };
            let pointToPointDist: DistanceObj = calculateDistance(
               geo1.geo,
               geo2.geo
            );
            cumulativeDistanceObj = sumDistance(
               cumulativeDistanceObj,
               pointToPointDist
            );
            cumDistDaily.distObj = Object.assign({}, cumulativeDistanceObj);
            if (cumDistDaily.dailyDate === geo2.geoDate) {
               prevGeoPoint = {
                  lat: endGeoPoint.lat,
                  lng: endGeoPoint.lng,
               };
               geo1 = {
                  geoDate: geo2.geoDate,
                  geo: prevGeoPoint,
               };
            } else {
               this.props.myPanel.current!.append(
                  `<p style="color:#310DF3 ; font-size:12px;">${cumDistDaily.dailyDate}: ${cumDistDaily.distObj.inFeet} ft. | ${cumDistDaily.distObj.inMiles} miles</p>`
               );
               prevGeoPoint = {
                  lat: endGeoPoint.lat,
                  lng: endGeoPoint.lng,
               };
               geo1 = {
                  geoDate: geo2.geoDate,
                  geo: prevGeoPoint,
               };
               cumulativeDistanceObj = {
                  inMeters: 0,
                  inFeet: 0,
                  inMiles: 0,
               };
               cumDistDaily = {
                  dailyDate: geo2.geoDate,
                  distObj: cumulativeDistanceObj,
               };
            }
         });
         this.props.myPanel.current!.append(
            `<p style="color:#310DF3 ; font-size:12px;">${cumDistDaily.dailyDate}: ${cumDistDaily.distObj.inFeet} ft. | ${cumDistDaily.distObj.inMiles} miles</p>`
         );
      }
   }

   private checkedEvent() {
      this.selectedMappings.length = 0;
      const rowsSelected: Array<Object> = this.myChairLocTable.current!.getSelection();
      if (rowsSelected.length > 0) {
         rowsSelected.forEach((x: any) => {
            const {
               ID,
               ASSETLABEL,
               BEACH,
               UPDATETIME,
               LATITUDE,
               LONGITUDE,
            } = x;
            let oneLoc: IWLocObj = {
               id: ID,
               assetlabel: ASSETLABEL,
               beach: BEACH,
               updatetime: UPDATETIME,
               location: {
                  lat: parseFloat(LATITUDE),
                  lng: parseFloat(LONGITUDE),
               },
            };
            this.selectedMappings.push(oneLoc);
         });
      } else {
         this.myCheckBox.current!.uncheck();
         this.props.myPanel.current!.append(
            `<p style="color:#F61D21 ; font-size:11px;"> Select row(s), then check 'Map Selection' button.</p>`
         );
      }
   }

   private uncheckedEvent(event: any): void {
      console.log("in uncheckedEvent()");
   }
}

export default ShowChairData;
