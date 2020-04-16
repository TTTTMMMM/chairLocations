import * as React from "react";
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
// import JqxDropDownList from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../configs/firebaseInit";

import { AssetLabelQueryType } from "../misc/chairLocTypes";

// import cellRendererKeep from "../renderers/cellRendererKeep";
// import cellRendererMandatory from "../renderers/cellRendererMandatory";

// class ShowTableHeaders extends Component<{ auth2: any; idToken: any }, {}>
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
      query: AssetLabelQueryType;
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
   boundIndex: number | 0;

   private myChairLocTable = React.createRef<JqxDataTable>();
   // private keepDropDownList = React.createRef<JqxDropDownList>();

   constructor(props: {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      myPanel: any;
      query: any;
   }) {
      super(props);
      this.assetLabelSpecific = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.boundIndex = 0;

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
      if (this.props.query.ASSETLABEL!.length > 0) {
         const beginningOfDay = new Date(
            new Date().toISOString().substr(0, 10)
         ).toISOString();
         this.assetLabelSpecific = firebase
            .firestore()
            .collection("chairLocs")
            .where("ASSETLABEL", "==", this.props.query.ASSETLABEL)
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
      querySnapshot.forEach(
         (doc: {
            data: () => {
               ASSETLABEL: string;
               BEACH: string;
               CELLACCURACY: string;
               DEVICEID: string;
               FNAME: string;
               GPS_MPH: string;
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
      console.log(
         `%c ChairDataWatch<${this.numUpdates}>`,
         "background:white; border: 3px solid blue; margin: 2px; padding: 3px; color:blue;"
      );
      setTimeout(() => {
         this.myChairLocTable.current!.ensureRowVisible(this.boundIndex!);
      }, 150);
   };

   getChairLocContent() {
      if (this.props.loggedInToFirebase) {
         const source = {
            datafields: [
               { name: "ASSETLABEL", type: "string" },
               { name: "BEACH", type: "string" },
               { name: "key", type: "string" },
               { name: "CELLACCURACY", type: "string" },
               { name: "DEVICEID", type: "string" },
               { name: "FNAME", type: "string" },
               { name: "GPS_MPH", type: "string" },
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
         // const getEditorDataAdapter = (dataField: any): any => {
         //    const editorSource = {
         //       dataFields: [
         //          { name: "chairHeader", type: "string" },
         //          { name: "keep", type: "bool" },
         //          { name: "mandatory", type: "bool" },
         //          { name: "key", type: "string" },
         //       ],
         //       dataType: "array",
         //       localData: source.localData(),
         //    };
         //    const dataAdapter = new jqx.dataAdapter(editorSource, {
         //       uniqueDataFields: [dataField],
         //    });
         //    return dataAdapter;
         // };
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
            ["GPS_MPH", 70],
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
               text: "Update Time",
               datafield: "UPDATETIME",
               width: columnWidths[11][1],
               align: "center",
               editable: false,
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
            <JqxDataTable
               ref={this.myChairLocTable}
               width={800}
               theme={"fresh"}
               source={this.dataAdapter}
               columns={this.columns}
               filterable={true}
               pageable={true}
               altRows={true}
               autoRowHeight={true}
               height={575}
               sortable={true}
               onRowSelect={this.onRowSelect}
               columnsReorder={true}
               columnsResize={true}
               editable={false}
               key={this.numUpdates} // this forces a re-render of the table!
               editSettings={this.state.editSettings}
               pageSize={100}
            />
         );
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
      console.dir(e.args.row);
      this.props.myPanel.current!.append(
         `<p style="color:gray; font-size:10px;">${e.args.row.ID} </p>`
      );
   }
}

export default ShowChairData;
