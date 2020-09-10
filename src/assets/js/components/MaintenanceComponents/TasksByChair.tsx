import * as React from "react";
import * as ReactDOM from "react-dom";

// var escapeHTML = require("escape-html");
import moment from "moment";

// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
// import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
// import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxDateTimeInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../../configs/firebaseInit";

import * as rs from "../../../styles/reactStyling";

import removeTask from "../../fetches/removeTask";

import cellRendererDelete1 from "../../renderers/cellRendererDelete1";

import { AuthContext } from "../../contexts/AuthContext";
// import { months } from "../../misc/months";
import updateTaskCompletion from "../../fetches/updateTaskCompletion";

interface MyState extends IDataTableProps {
   taskedAssetsWatch?: any;
   detailsWatch?: any;
   subscribed?: boolean;
   subscribedToTaskedAssets?: boolean;
   chairAssets?: Array<string>;
   calVal: Date;
}
class AddDropTasks extends React.PureComponent<{ myPanel: any }, MyState> {
   tasksCollection: any;
   taskedAssetsCollection: any;
   numUpdates: number | undefined;
   numTaskedAssetsUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   assetsAdapter: null;
   detailsAdapter: any;
   modifyKey: string | undefined;
   detailsOpenIndex: number = 0;
   calendarDateUponOpen: string | undefined;
   selectedRow: number | undefined;
   selectedRow1: number | undefined;
   tasksTableRowSelected: number | undefined;
   chairAssets: any[] = [];
   private count: number = 0;
   private nestedTables: any[] = [];
   initRowDetails: any;
   numHits: number = 5;
   calendarValue: Date = moment().subtract(1, "days").toDate(); // initialize jqxDateTimeInput to yesterday if dateDone is not present

   static contextType = AuthContext;

   private myAssetsTable = React.createRef<JqxDataTable>();
   private myDetailsAssetsTable = React.createRef<JqxDataTable>();
   private myDateDoneInput = React.createRef<JqxDateTimeInput>();

   constructor(props: { myPanel: any }) {
      super(props);
      this.tasksCollection = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.assetsAdapter = null;

      this.onRowSelect = this.onRowSelect.bind(this);
      this.onRowDoubleClickNested = this.onRowDoubleClickNested.bind(this);
      this.onCalendarChange = this.onCalendarChange.bind(this);
      this.onCalendarClose = this.onCalendarClose.bind(this);
      this.onCalendarOpen = this.onCalendarOpen.bind(this);

      this.state = {
         chairAssets: [],
         subscribed: false,
         taskedAssetsWatch: [],
         detailsWatch: [],
         calVal: this.calendarValue,
         editSettings: {
            cancelOnEsc: true,
            editOnDoubleClick: true,
            editOnF2: true,
            editSingleCell: true,
            saveOnBlur: true,
            saveOnEnter: true,
            saveOnPageChange: true,
            saveOnSelectionChange: true,
         },
      };
      this.getAssetsTaskContent = this.getAssetsTaskContent.bind(this);
   }

   getAllAssets() {
      let chairAssets: Array<string> = [];
      firebase
         .firestore()
         .collection("uniqueAssetLabels")
         .get()
         .then((snapshot: any) => {
            snapshot.forEach((doc: any) => {
               chairAssets.push(doc.data().ASSETLABEL);
            });
            this.setState({
               chairAssets: [...new Set(chairAssets)],
            });
         })
         .catch((err: any) => {
            console.log(
               "C0735: Error getting chairs documents from 'uniqueAssetLabels'",
               err
            );
         });
   }

   subscribeToTaskedAssets() {
      this.taskedAssetsCollection = firebase
         .firestore()
         .collection("tasks")
         .where("docID", "<", "T");
      this.unsubscribeFromTaskedAssets = this.taskedAssetsCollection.onSnapshot(
         // this.onCollectionUpdate
         this.onDetailsUpdate
      );
      this.setState({ subscribedToTaskedAssets: true });
   }

   unsubscribeFromTaskedAssets() {
      if (typeof this.unsubscribeFromTaskedAssets != "undefined") {
         this.unsubscribe();
         this.setState({ subscribedToTaskedAssets: false });
         this.numTaskedAssetsUpdates = 0;
      }
   }

   componentDidMount() {}

   onDetailsUpdate = (querySnapshot: any) => {
      this.numUpdates!++;
      let taskedAssetsWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               asset: string;
               dateDone: string;
               docID: string;
               task: string;
               taskID: string;
            };
            id: any;
         }) => {
            let { asset, dateDone, docID, task, taskID } = doc.data();
            taskedAssetsWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               asset,
               dateDone,
               docID,
               task,
               taskID,
            });
         }
      );
      this.setState({
         taskedAssetsWatch,
      });
      this.numRows++;
      console.log(
         `%c taskedAssetsWatch<${this.numUpdates}>`,
         "background:rgb(206, 197, 129); border: 3px solid hsla(113, 37%, 66%); margin: 2px; padding: 3px; color:hsla(23, 79%, 8%);"
      );
   };

   getAssetsTaskContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         const assetsSource = {
            datafields: [{ name: "ASSETLABEL", type: "string" }],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;
               this.state.chairAssets!.forEach((val: any) => {
                  data[i++] = {
                     ASSETLABEL: val,
                  };
               });
               return data;
            },
         };
         this.assetsAdapter = new jqx.dataAdapter(assetsSource);
         // --  detailsSource ------------------------------------------------------------//
         const detailsSource = {
            datafields: [
               { name: "task", type: "string" },
               { name: "asset", type: "string" },
               { name: "key", type: "string" },
               { name: "dateDone", type: "string" },
               { name: "taskID", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.taskedAssetsWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     asset: val.asset,
                     dateDone: val.dateDone,
                     docID: val.docID,
                     task: val.task,
                     taskID: val.taskID,
                  };
                  this.numRows!++;
               });
               return data;
            },
         };
         this.detailsAdapter = new jqx.dataAdapter(detailsSource, {
            autoBind: true,
         });
         // --
         this.initRowDetails = (
            id: any,
            row: number | undefined,
            element: any,
            rowinfo: any
         ): void => {
            rowinfo.detailsHeight = 320;
            const container = document.createElement("div");
            container.style.margin = "10px";
            element[0].appendChild(container);
            const nestedDataTable = element[0].children[0];
            const containerID = `nestedDataTable${this.count}`;
            nestedDataTable.id = containerID;
            const filterGroup = new jqx.filter();
            // const filterValue = id;
            const filterValue = rowinfo.row.ASSETLABEL;
            const filterCondition = "equal";
            const filter = filterGroup.createfilter(
               "stringfilter",
               filterValue,
               filterCondition
            );
            // fill the details table, taskedAssets, based on asset
            const taskedAssets: any[] = this.detailsAdapter.records;
            this.numHits = 0;
            const taskedAssetsByAsset = [];
            for (const tA of taskedAssets) {
               // const result = filter.evaluate(tA.taskID);
               const result = filter.evaluate(tA.asset);
               if (result) {
                  taskedAssetsByAsset.push(tA);
                  this.numHits++;
               }
            }
            let detailsTableHeight = Math.min(this.numHits * 38, 300);
            rowinfo.detailsHeight = detailsTableHeight + 25;

            const nestedOrdersSource = {
               dataFields: [
                  { name: "task", type: "string" },
                  { name: "key", type: "string" },
                  { name: "asset", type: "string" },
                  { name: "dateDone", type: "string" },
                  { name: "taskID", type: "string" },
               ],
               id: "key",
               localdata: taskedAssetsByAsset,
            };
            if (nestedDataTable !== null) {
               const nestedDataTableAdapter = new jqx.dataAdapter(
                  nestedOrdersSource
               );
               const columns: IDataTableProps["columns"] = [
                  {
                     text: "2X",
                     dataField: "DNested",
                     cellsRenderer: cellRendererDelete1,
                     width: 33,
                     align: "center",
                  },
                  {
                     text: "Asset",
                     dataField: "asset",
                     width: 100,
                     editable: false,
                  },
                  {
                     text: "Date Done",
                     dataField: "dateDone",
                     width: 100,
                     align: "center",
                     cellsAlign: "center",
                     columnType: "template",
                     createEditor: (
                        row: any,
                        cellvalue: any,
                        editor: any,
                        cellText: any,
                        width: any,
                        height: any
                     ): void => {
                        ReactDOM.render(
                           <JqxDateTimeInput
                              ref={this.myDateDoneInput}
                              theme={"fresh"}
                              width={100}
                              height={40}
                              showFooter={true}
                              min={moment("2020-01-01").toDate()}
                              max={moment().toDate()}
                              showCalendarButton={true}
                              onChange={this.onCalendarChange}
                              onClose={this.onCalendarClose}
                              onOpen={this.onCalendarOpen}
                              value={this.calendarValue}
                              formatString={"M/d/yyyy"}
                           />,
                           editor[0]
                        );
                     },
                  },
                  {
                     text: "Task",
                     dataField: "task",
                     width: 340,
                     editable: false,
                  },
               ];
               // nested table
               ReactDOM.render(
                  <JqxDataTable
                     ref={this.myDetailsAssetsTable}
                     width={576}
                     theme={"fresh"}
                     source={nestedDataTableAdapter}
                     columns={columns}
                     pageable={false}
                     altRows={true}
                     height={detailsTableHeight}
                     sortable={true}
                     columnsReorder={true}
                     columnsResize={true}
                     editable={true}
                     onCellBeginEdit={this.onRowDoubleClickNested}
                     editSettings={this.state.editSettings}
                     pageSize={250}
                  />,
                  document.querySelector(`#${containerID}`)
               );
               // store the nested Data Tables and use the docID as a key.
               this.nestedTables[id] = nestedDataTable;
               this.count++;
               this.myDetailsAssetsTable.current!.sortBy("dateDone", "desc");
            }
         };
         // --
         const columnWidths = [
            ["", 33] /* trash can */,
            ["ASSETLABEL", 578],
         ];
         this.columns = [
            {
               text: "Asset",
               width: columnWidths[1][1],
               datafield: "ASSETLABEL",
               align: "center",
               cellclassname: "AssetClass",
               editable: false,
            },
         ];
         return (
            <fieldset style={rs.fieldsetTaskStyle}>
               <legend>Assets</legend>
               <JqxDataTable
                  ref={this.myAssetsTable}
                  width={620}
                  theme={"fresh"}
                  source={this.assetsAdapter}
                  columns={this.columns}
                  filterable={true}
                  pageable={true}
                  altRows={true}
                  autoRowHeight={true}
                  height={550}
                  sortable={true}
                  onRowSelect={this.onRowSelect}
                  columnsReorder={true}
                  columnsResize={true}
                  editable={false}
                  key={this.numUpdates} // this forces a re-render of the table!
                  editSettings={this.state.editSettings}
                  pageSize={100}
                  rowDetails={true}
                  initRowDetails={this.initRowDetails}
               />
            </fieldset>
         );
      } else {
         return <div></div>;
      }
   }
   render() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase && !this.state.subscribedToTaskedAssets) {
         this.getAllAssets();
         this.subscribeToTaskedAssets();
      }
      if (!isLoggedInToFirebase && this.state.subscribedToTaskedAssets) {
         // this.unsubscribeFromTasks();
         this.unsubscribeFromTaskedAssets();
      }
      return <div>{this.getAssetsTaskContent()}</div>;
   }

   // this handler deletes one asset from the task or initializes the dateTimeinput widget
   private onRowDoubleClickNested(e: any): void {
      const { googleToken } = this.context;
      this.modifyKey = e.args.key;
      if (e.args.dataField.localeCompare("DNested") == 0) {
         removeTask(googleToken, e.args.key)
            .then((retVal: any) => {
               const msg = retVal.message;
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:blue; font-size:11px;">${msg}</p>`
               );
               setTimeout(() => {
                  this.myAssetsTable.current!.showDetails(
                     this.detailsOpenIndex
                  );
                  this.myAssetsTable.current!.ensureRowVisible(
                     this.detailsOpenIndex + 2
                  );
               }, 2300); //
            })
            .catch((err: any) => {
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:red; font-size:11px;">C0228: ${err}</p>`
               );
            });
      }
      this.myDateDoneInput.current != null
         ? this.myDateDoneInput.current!.setDate(this.calendarValue)
         : {};
   }

   private onRowSelect(e: any): void {
      let jsr = e.args.row;
      // console.dir(jsr);
      this.modifyKey = e.args.key;
      this.selectedRow = e.args.index;
      this.selectedRow1 = e.args.boundIndex;
      this.props.myPanel.current!.append(
         `<p style="color:#000000 ; font-size:13px;">-----------------------------</p>`
      );
      let theKeys = Object.keys(jsr);
      theKeys.forEach((x) => {
         this.props.myPanel.current!.append(
            `<p style="color:black ; font-size:11px;">${x}-> "${jsr[x]}",</p>`
         );

         if (x === "dateDone") {
            this.calendarValue =
               jsr[x].length > 0
                  ? moment(`${jsr[x]}`).toDate()
                  : moment().subtract(1, "days").toDate();
         }

         if (x === "asset") {
            this.detailsOpenIndex = this.state.chairAssets!.indexOf(jsr[x]);
         }
      });
   }

   // this handler updates the date of completion of a specific task for a specific asset
   private onCalendarChange(e: any): void {
      const { googleToken } = this.context;
      let dunDt = this.myDateDoneInput.current!.val();
      let formDate = `${dunDt.split("/")[2]}-${parseInt(
         dunDt.split("/")[0]
      ).toLocaleString("en", { minimumIntegerDigits: 2 })}-${parseInt(
         dunDt.split("/")[1]
      ).toLocaleString("en", { minimumIntegerDigits: 2 })}`;
      if (dunDt.length === 0) {
         this.myDateDoneInput.current!.close();
         this.myDetailsAssetsTable.current!.clearSelection();
         this.myDetailsAssetsTable.current!.unselectRow(this.selectedRow!);
         this.myDetailsAssetsTable.current!.unselectRow(this.selectedRow1!);
      }
      updateTaskCompletion(
         googleToken,
         this.modifyKey,
         formDate,
         this.props.myPanel
      ).then(() => {
         setTimeout(() => {
            this.myAssetsTable.current!.showDetails(this.detailsOpenIndex);
            this.myAssetsTable.current!.ensureRowVisible(
               this.detailsOpenIndex + 2
            );
         }, 2300); //
      });
   }

   private onCalendarOpen(e: any): void {
      this.calendarDateUponOpen = this.myDateDoneInput.current!.val();
   }

   // this handler takes care of the case when the user enters the same date that was already there
   // i.e., you can think of this as onCalendar_NO_Change event
   private onCalendarClose(e: any): void {
      const { googleToken } = this.context;
      let dunDt = this.myDateDoneInput.current!.val();
      let formDate = `${dunDt.split("/")[2]}-${parseInt(
         dunDt.split("/")[0]
      ).toLocaleString("en", { minimumIntegerDigits: 2 })}-${parseInt(
         dunDt.split("/")[1]
      ).toLocaleString("en", { minimumIntegerDigits: 2 })}`;
      let same = dunDt === this.calendarDateUponOpen;
      if (same) {
         updateTaskCompletion(
            googleToken,
            this.modifyKey,
            "undefined-NaN-NaN",
            this.props.myPanel
         ).then(() => {
            updateTaskCompletion(
               googleToken,
               this.modifyKey,
               formDate,
               this.props.myPanel
            ).then(() => {
               setTimeout(() => {
                  this.myAssetsTable.current!.showDetails(
                     this.detailsOpenIndex
                  );
                  this.myAssetsTable.current!.ensureRowVisible(
                     this.detailsOpenIndex + 2
                  );
               }, 2300); //
            });
         });
      }
   }
}

export default AddDropTasks;
