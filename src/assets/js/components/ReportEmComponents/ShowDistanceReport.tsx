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

import { divFlexRow } from "../../../styles/reactStyling";
import {
   CallingFrom,
   RangeObject,
   Roles,
   DistanceObj,
} from "../../misc/chairLocTypes";

interface MyState extends IDataTableProps {
   weeklyReportWatch?: any;
   subscribedToDistanceReport: boolean;
   displayTableMode?: boolean;
   assets: Array<string>;
   range: RangeObject;
}
class ShowDistanceReport extends React.PureComponent<
   {
      myPanel: any;
      assets: Array<string>;
      range: RangeObject;
      callingFrom: CallingFrom;
   },
   MyState
> {
   distReport: any;
   numUpdates: number | undefined;
   unsubFromDistanceReport: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   static contextType = AuthContext;

   private myReportTable = React.createRef<JqxDataTable>();
   private csvButton = React.createRef<JqxButton>();

   constructor(props: {
      myPanel: any;
      assets: Array<string>;
      range: RangeObject;
      callingFrom: CallingFrom;
   }) {
      super(props);
      this.distReport = "";
      this.numRows = 0;
      this.columns = [];
      this.numUpdates = 0;
      this.csvButtonClicked = this.csvButtonClicked.bind(this);

      this.onRowSelect = this.onRowSelect.bind(this);
      this.showReportContent = this.showReportContent.bind(this);

      this.state = {
         subscribedToDistanceReport: false,
         weeklyReportWatch: [],
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
         assets: [],
      };
   }

   subscribeToDistanceReport() {
      if (this.props.assets.length > 0) {
         // this.setState({ assets: this.props.assets });
         // this.setState({ range: this.props.range });
         console.log(`subscribeToDistanceReport()`);
         console.dir(this.props.assets);
         console.dir(this.props.range);
         this.props.assets.forEach((asset) => {
            this.distReport = firebase
               .firestore()
               .collection(
                  `distReport_${this.props.range.startDate.split("-")[0]}`
               )
               .where("assetlabel", "==", asset)
               .where("month", "==", this.props.range.startDate.split("-")[1]);
            this.unsubFromDistanceReport = this.distReport.onSnapshot(
               this.onCollectionUpdate
            );
            this.setState({ subscribedToDistanceReport: true });
         });
      }
   }

   unsubscribeFromDistanceReport() {
      if (typeof this.unsubFromDistanceReport != "undefined") {
         this.setState({ subscribedToDistanceReport: false });
         this.numUpdates = 0;
      }
   }

   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      // console.log(`In onCollectionUpdate() <${util.inspect(querySnapshot)}>`);
      this.numUpdates!++;
      let weeklyReportWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               assetlabel: string;
               month: string;
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
               month,
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
            weeklyReportWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               assetlabel,
               month,
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
         weeklyReportWatch: weeklyReportWatch,
      });
      this.numRows++;
      // console.log(
      //    `%c ChairDataWatch<${this.numUpdates}>`,
      //    "background:white; border: 3px solid blue; margin: 2px; padding: 3px; color:blue;"
      // );
   };

   showReportContent() {
      const { isLoggedInToFirebase } = this.context;
      console.log(
         `showReportContent(), isLoggedInToFirebase[${isLoggedInToFirebase}]`
      );
      if (isLoggedInToFirebase) {
         const source = {
            datafields: [
               { name: "assetlabel", type: "string" },
               { name: "month", type: "string" },
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
               let i = 0;
               console.log(`in localData()`);
               this.state.weeklyReportWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     assetlabel: val.assetlabel,
                     d01: val.d01.feet,
                     d02: val.d02.feet,
                     d03: val.d03.feet,
                     d04: val.d04.feet,
                     d05: val.d05.feet,
                     d06: val.d06.feet,
                     d07: val.d07.feet,
                     d08: val.d08.feet,
                     d09: val.d09.feet,
                     d10: val.d10.feet,
                     d11: val.d11.feet,
                     d12: val.d12.feet,
                     d13: val.d13.feet,
                     d14: val.d14.feet,
                     d15: val.d15.feet,
                     d16: val.d16.feet,
                     d17: val.d17.feet,
                     d18: val.d18.feet,
                     d19: val.d19.feet,
                     d20: val.d20.feet,
                     d21: val.d21.feet,
                     d22: val.d22.feet,
                     d23: val.d23.feet,
                     d24: val.d24.feet,
                     d25: val.d25.feet,
                     d26: val.d26.feet,
                     d27: val.d27.feet,
                     d28: val.d28.feet,
                     d29: val.d29.feet,
                     d30: val.d30.feet,
                     d31: val.d31.feet,
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
            ["d01", 20],
            // ["02", 20],
            // ["03", 20],
            // ["04", 20],
            // ["05", 20],
            // ["06", 20],
            // ["07", 20],
            // ["08", 20],
            // ["09", 20],
            // ["10", 20],
            // ["11", 20],
            // ["12", 20],
            // ["13", 20],
            // ["14", 20],
            // ["15", 20],
            // ["16", 20],
            // ["17", 20],
            // ["18", 20],
            // ["19", 20],
            // ["20", 20],
            // ["21", 20],
            // ["22", 20],
            // ["23", 20],
            // ["24", 20],
            // ["25", 20],
            // ["26", 20],
            // ["27", 20],
            // ["28", 20],
            // ["29", 20],
            // ["30", 20],
            // ["31", 20],
         ];
         this.columns!.push({
            text: "Chair",
            width: columnWidths[0][1],
            datafield: "ASSETLABEL",
            align: "center",
            cellclassname: "ASSETLABELClass",
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
         console.log(`this.columns:`);
         console.dir(this.columns);
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
                     Output CSV
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
      console.log(
         `render(), isLoggedInToFirebase[${isLoggedInToFirebase}], subscribedToDistanceReport[${this.state.subscribedToDistanceReport}]`
      );
      if (isLoggedInToFirebase && !this.state.subscribedToDistanceReport) {
         this.subscribeToDistanceReport();
      }
      if (!isLoggedInToFirebase && this.state.subscribedToDistanceReport) {
         this.unsubscribeFromDistanceReport();
      }
      if (userObjFmServer.role === Roles.notloggedin && isLoggedInToFirebase) {
         this.unsubscribeFromDistanceReport();
      }
      return <div>{this.showReportContent()}</div>;
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

   private csvButtonClicked() {
      this.props.myPanel.current!.append(
         `<p style="color:#286107 ; font-size:11px;">CSV Button Clicked</p>`
      );
   }
}

export default ShowDistanceReport;
