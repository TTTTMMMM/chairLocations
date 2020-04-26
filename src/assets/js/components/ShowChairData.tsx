import * as React from "react";
// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import MapContainer from "./MapContainer";
// import { chairLocs } from "../configs/mapConfigs/chairLocs";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../configs/firebaseInit";
import { IWLocObj } from "../configs/mapConfigs/mapTypes";

interface MyState extends IDataTableProps {
   chairDataWatch?: any;
   subscribed?: boolean;
}
class ShowChairData extends React.PureComponent<
   {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      myPanel: any;
      asset: string;
   },
   MyState
> {
   assetLabelSpecific: any;
   numUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   modifyKey: string | undefined;
   chairY: Array<IWLocObj> = [];

   // private myChairLocTable = React.createRef<JqxDataTable>();

   constructor(props: {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      myPanel: any;
      asset: string;
   }) {
      super(props);
      this.assetLabelSpecific = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;

      this.onRowSelect = this.onRowSelect.bind(this);

      this.state = {
         subscribed: false,
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
      };
      this.getChairLocContent = this.getChairLocContent.bind(this);
   }

   subscribeToAssetUploadedToday() {
      if (this.props.asset!.length > 0) {
         const beginningOfDay = new Date(
            new Date().toISOString().substr(0, 10)
         ).toISOString();
         this.assetLabelSpecific = firebase
            .firestore()
            .collection("chairLocs")
            .where("ASSETLABEL", "==", this.props.asset)
            .where("UPLOADFBTIME", ">", beginningOfDay);
         this.unsubscribe = this.assetLabelSpecific.onSnapshot(
            this.onCollectionUpdate
         );
         this.setState({ subscribed: true });
      }
   }

   unsubscribeFromAssetLabelSpecific() {
      if (typeof this.unsubscribe != "undefined") {
         this.unsubscribe();
         this.setState({ subscribed: false });
         this.numUpdates = 0;
      }
   }
   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      // console.log(`In onCollectionUpdate() <${util.inspect(querySnapshot)}>`);
      this.numUpdates!++;
      let chairDataWatch: any[] = [];
      this.numRows = 0;
      this.chairY.length = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               ASSETLABEL: string;
               BEACH: string;
               CELLACCURACY: string;
               DEVICEID: string;
               FNAME: string;
               GPS_MPH: number;
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
               assetlabel: doc.data().ASSETLABEL,
               beach: doc.data().BEACH,
               id: doc.data().ID,
               updatetime: doc.data().UPDATETIME,
               location: {
                  lat: parseFloat(doc.data().LATITUDE),
                  lng: parseFloat(doc.data().LONGITUDE),
               },
            };
            this.chairY.push(oneLoc);
            chairDataWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               ASSETLABEL,
               BEACH,
               CELLACCURACY,
               DEVICEID,
               FNAME,
               GPS_MPH,
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
         chairDataWatch,
      });
      this.numRows++;
      // console.log(
      //    `%c ChairDataWatch<${this.numUpdates}>`,
      //    "background:white; border: 3px solid blue; margin: 2px; padding: 3px; color:blue;"
      // );
   };

   getChairLocContent() {
      if (this.props.loggedInToFirebase && this.chairY.length > 0) {
         const source = {
            datafields: [
               { name: "ASSETLABEL", type: "string" },
               { name: "BEACH", type: "string" },
               { name: "key", type: "string" },
               { name: "CELLACCURACY", type: "string" },
               { name: "DEVICEID", type: "string" },
               { name: "FNAME", type: "string" },
               { name: "GPS_MPH", type: "number" },
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
            ["BEACH", 150],
            ["CELLACCURACY", 50],
            ["DEVICEID", 70],
            ["FNAME", 100],
            ["ID", 80],
            ["IMEI", 80],
            ["LATITUDE", 100],
            ["LONGITUDE", 100],
            ["RENTALAGENT", 120],
            ["STATE", 100],
            ["UPDATETIME", 170],
            ["UPLOADFBTIME", 110],
            ["GPS_MPH", 79],
         ];
         this.columns = [
            {
               text: "Chair",
               width: columnWidths[0][1],
               datafield: "ASSETLABEL",
               align: "center",
               cellclassname: "ASSETLABELClass",
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
               text: "Rental Agent",
               datafield: "RENTALAGENT",
               width: columnWidths[9][1],
               align: "center",
               cellsalign: "center",
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
               text: "Update Time",
               datafield: "UPDATETIME",
               width: columnWidths[11][1],
               align: "center",
               editable: false,
            },
            {
               text: "ID",
               datafield: "ID",
               width: columnWidths[5][1],
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

         return <MapContainer {...this.chairY}></MapContainer>;
      } else {
         return <div></div>;
      }
   }
   render() {
      if (this.props.loggedInToFirebase && !this.state.subscribed) {
         this.subscribeToAssetUploadedToday();
      }
      if (!this.props.loggedInToFirebase && this.state.subscribed) {
         this.unsubscribeFromAssetLabelSpecific();
      }
      return <div>{this.getChairLocContent()}</div>;
   }

   private onRowSelect(e: any): void {
      let jsrow = JSON.stringify(e.args.row);
      let prettyJsrow = jsrow
         .replace(/,/g, "<br>")
         .replace(/"/g, "")
         .replace(/{/g, "{<br>")
         .replace(/}/g, "<br>}");
      this.props.myPanel.current!.append(
         `<br style="color:#104B34 ; font-size:10px;">${prettyJsrow} </br>`
      );
   }
}

export default ShowChairData;
