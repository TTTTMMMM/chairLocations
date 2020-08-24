import * as React from "react";
import * as ReactDOM from "react-dom";

var escapeHTML = require("escape-html");
import moment from "moment";

// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../../configs/firebaseInit";

import * as rs from "../../../styles/reactStyling";

import addTask from "../../fetches/addTask";
import removeTask from "../../fetches/removeTask";
import hashOfTask from "./hashOfTask";

import cellRendererDelete from "../../renderers/cellRendererDelete";
import cellRendererDelete1 from "../../renderers/cellRendererDelete1";

import { AuthContext } from "../../contexts/AuthContext";

interface MyState extends IDataTableProps {
   tasksWatch?: any;
   detailsWatch?: any;
   subscribed?: boolean;
   subscribedToTaskedAssets?: boolean;
   chairAssets?: Array<string>;
}
class AddDropTasks extends React.PureComponent<{ myPanel: any }, MyState> {
   tasksCollection: any;
   taskedAssetsCollection: any;
   numUpdates: number | undefined;
   numTaskedAssetsUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   detailsAdapter: any;
   modifyKey: string | undefined;
   chairAssets: any[] = [];
   private count: number = 0;
   private nestedTables: any[] = [];
   initRowDetails: any;

   static contextType = AuthContext;

   private myTasksTable = React.createRef<JqxDataTable>();
   private addTaskButton = React.createRef<JqxButton>();
   private taskInput = React.createRef<JqxInput>();

   constructor(props: { myPanel: any }) {
      super(props);
      this.tasksCollection = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.dataAdapter = null;

      this.onRowSelect = this.onRowSelect.bind(this);
      this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
      this.onRowDoubleClickNested = this.onRowDoubleClickNested.bind(this);

      this.state = {
         chairAssets: [],
         subscribed: false,
         tasksWatch: [],
         detailsWatch: [],
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
      this.getTasksContent = this.getTasksContent.bind(this);
      this.addTaskButtonClicked = this.addTaskButtonClicked.bind(this);
   }

   subscribeToTasks() {
      this.tasksCollection = firebase
         .firestore()
         .collection("tasks")
         .where("docID", ">", "T");
      this.unsubscribe = this.tasksCollection.onSnapshot(
         this.onCollectionUpdate
      );
      this.setState({ subscribed: true });
   }

   unsubscribeFromTasks() {
      if (typeof this.unsubscribe != "undefined") {
         this.unsubscribe();
         this.setState({ subscribed: false });
         this.numUpdates = 0;
      }
   }

   subscribeToTaskedAssets() {
      this.taskedAssetsCollection = firebase
         .firestore()
         .collection("tasks")
         .where("docID", "<", "T");
      this.unsubscribeFromTaskedAssets = this.taskedAssetsCollection.onSnapshot(
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

   componentDidMount() {
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

   onCollectionUpdate = (querySnapshot: any) => {
      this.numUpdates!++;
      let tasksWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               task: string;
               // asset: string;
               // dateDone: string;
               taskID: string;
            };
            id: any;
         }) => {
            let { task, taskID } = doc.data();
            // let { task, asset, dateDone, taskID } = doc.data();
            tasksWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               task,
               // asset,
               // dateDone,
               taskID,
            });
         }
      );
      this.setState({
         tasksWatch,
      });
      this.numRows++;
      console.log(
         `%c tasksWatch<${this.numUpdates}>`,
         "background:rgb(206, 197, 129); border: 3px solid hsla(113, 37%, 66%); margin: 2px; padding: 3px; color:hsla(23, 79%, 8%);"
      );
   };

   onDetailsUpdate = (querySnapshot: any) => {
      this.numUpdates!++;
      let detailsWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               task: string;
               asset: string;
               dateDone: string;
               taskID: string;
            };
            id: any;
         }) => {
            // let { task, taskID } = doc.data();
            let { task, asset, dateDone, taskID } = doc.data();
            detailsWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               task,
               asset,
               dateDone,
               taskID,
            });
         }
      );
      this.setState({
         detailsWatch,
      });
      this.numRows++;
      console.log(
         `%c detailsWatch<${this.numUpdates}>`,
         "background:rgb(4, 191, 138); border: 3px solid hsla(355, 51%, 71%); margin: 2px; padding: 3px; color:hsla(23, 21%, 22%);"
      );
   };

   getTasksContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         const source = {
            datafields: [
               { name: "task", type: "string" },
               { name: "key", type: "string" },
               { name: "taskID", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.tasksWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     task: val.task,
                     taskID: val.taskID,
                  };
                  this.numRows!++;
               });
               return data;
            },
         };
         this.dataAdapter = new jqx.dataAdapter(source);
         // --
         const detailsSource = {
            datafields: [
               { name: "task", type: "string" },
               { name: "key", type: "string" },
               { name: "asset", type: "string" },
               { name: "dateDone", type: "string" },
               { name: "taskID", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.detailsWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     task: val.task,
                     asset: val.asset,
                     dateDone: val.dateDone,
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
            const container = document.createElement("div");
            container.style.margin = "10px";
            element[0].appendChild(container);
            const nestedDataTable = element[0].children[0];
            const containerID = `nestedDataTable${this.count}`;
            nestedDataTable.id = containerID;
            const filterGroup = new jqx.filter();
            const filterValue = id;
            const filterCondition = "equal";
            const filter = filterGroup.createfilter(
               "stringfilter",
               filterValue,
               filterCondition
            );
            // fill the taskedAssets based on TaskID
            const taskedAssets: any[] = this.detailsAdapter.records;
            const taskedAssetsByTaskedID = [];
            for (const tA of taskedAssets) {
               const result = filter.evaluate(tA.taskID);
               if (result) {
                  taskedAssetsByTaskedID.push(tA);
               }
            }
            const nestedOrdersSource = {
               dataFields: [
                  { name: "task", type: "string" },
                  { name: "key", type: "string" },
                  { name: "asset", type: "string" },
                  { name: "dateDone", type: "string" },
                  { name: "taskID", type: "string" },
               ],
               id: "key",
               localdata: taskedAssetsByTaskedID,
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
                  { text: "Asset", dataField: "asset", width: 130 },
                  {
                     text: "Date Done",
                     dataField: "dateDone",
                     width: 130,
                  },
                  { text: "Task ID", dataField: "taskID", width: 130 },
               ];
               // nested table
               ReactDOM.render(
                  <JqxDataTable
                     width={438}
                     height={180}
                     columns={columns}
                     pageable={false}
                     source={nestedDataTableAdapter}
                     onRowDoubleClick={this.onRowDoubleClickNested}
                     sortable={true}
                     columnsReorder={true}
                     altRows={true}
                     pageSize={250}
                  />,
                  document.querySelector(`#${containerID}`)
               );
               // store the nested Data Tables and use the docID as a key.
               this.nestedTables[id] = nestedDataTable;
               this.count++;
            }
         };
         // --
         const columnWidths = [
            ["", 33] /* trash can */,
            ["task", 443],
            ["taskID", 100],
         ];
         this.columns = [
            {
               text: "2X",
               datafield: "D",
               width: columnWidths[0][1],
               cellsrenderer: cellRendererDelete,
               align: "center",
               cellclassname: "trashcan",
            },
            {
               text: "Task",
               width: columnWidths[1][1],
               datafield: "task",
               align: "center",
               cellclassname: "TaskClass",
               editable: false,
            },
            {
               text: "TaskID",
               width: columnWidths[2][1],
               datafield: "taskID",
               align: "center",
               cellclassname: "TaskIDClass",
               editable: false,
            },
         ];
         return (
            <fieldset style={rs.fieldsetTaskStyle}>
               <legend>Tasks</legend>
               <JqxDataTable
                  ref={this.myTasksTable}
                  width={598}
                  theme={"fresh"}
                  source={this.dataAdapter}
                  columns={this.columns}
                  filterable={true}
                  pageable={true}
                  altRows={true}
                  autoRowHeight={true}
                  height={550}
                  sortable={true}
                  onRowDoubleClick={this.onRowDoubleClick}
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
               <div style={rs.divThick}>
                  <label style={rs.labelStyleRental}>Task:</label>
                  <JqxInput
                     ref={this.taskInput}
                     minLength={5}
                     maxLength={79}
                     theme={"fresh"}
                     width={570}
                     placeHolder={"New Task"}
                  />
               </div>
               <div style={rs.divFlexRowTask}>
                  <JqxButton
                     ref={this.addTaskButton}
                     onClick={this.addTaskButtonClicked}
                     width={130}
                     height={40}
                     theme={"fresh"}
                     textImageRelation={"imageBeforeText"}
                     imgSrc={"../images/work.png"}
                     textPosition={"center"}
                  >
                     Add Task
                  </JqxButton>
               </div>
            </fieldset>
         );
      } else {
         return <div></div>;
      }
   }
   render() {
      const { isLoggedInToFirebase } = this.context;

      if (isLoggedInToFirebase && !this.state.subscribed) {
         this.subscribeToTasks();
         this.subscribeToTaskedAssets();
      }
      if (!isLoggedInToFirebase && this.state.subscribed) {
         this.unsubscribeFromTasks();
         this.unsubscribeFromTaskedAssets();
      }
      return <div>{this.getTasksContent()}</div>;
   }

   private onRowDoubleClick(e: any): void {
      const { googleToken } = this.context;
      const theKey = e.args.key;

      if (e.args.dataField.localeCompare("D") == 0) {
         removeTask(googleToken, theKey)
            .then((retVal: any) => {
               const msg = retVal.message;
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:blue; font-size:11px;">${msg}</p>`
               );
            })
            .catch((err: any) => {
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:red; font-size:11px;">C0228: ${err}</p>`
               );
            });
         // remove all assets that had the taskID from above
         if (theKey.startsWith("T")) {
            const lengthOfTimeIn_mSec = 6000;
            this.state.detailsWatch.forEach((val: any) => {
               const randomTime = Math.floor(
                  Math.random() * lengthOfTimeIn_mSec
               );
               let taskID = val.taskID;
               if (taskID === theKey) {
                  setTimeout(() => {
                     removeTask(googleToken, val.key)
                        .then((retVal: any) => {
                           const msg = retVal.message;
                           this.props.myPanel.current!.append(
                              `<p style="font-style: normal; color:blue; font-size:11px;">${msg}</p>`
                           );
                        })
                        .catch((err: any) => {
                           this.props.myPanel.current!.append(
                              `<p style="font-style: normal; color:red; font-size:11px;">C0328: ${err}</p>`
                           );
                        });
                  }, randomTime);
               }
            });
         }
      }
   }

   // this handler deletes one asset from the task
   private onRowDoubleClickNested(e: any): void {
      const { googleToken } = this.context;

      if (e.args.dataField.localeCompare("DNested") == 0) {
         removeTask(googleToken, e.args.key)
            .then((retVal: any) => {
               const msg = retVal.message;
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:blue; font-size:11px;">${msg}</p>`
               );
            })
            .catch((err: any) => {
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:red; font-size:11px;">C0228: ${err}</p>`
               );
            });
      }
   }

   private onRowSelect(e: any): void {
      let jsr = e.args.row;
      let theKeys = Object.keys(jsr);
      theKeys.forEach((x) => {
         this.props.myPanel.current!.append(
            `<br style="color:#389304 ; font-size:9px;">${x}: "${jsr[x]}",`
         );
      });
      this.props.myPanel.current!.append(
         `<br style="color:#000000 ; font-size:10px;">------`
      );
   }

   private addTaskButtonClicked() {
      const { googleToken } = this.context;

      let task = escapeHTML(
         this.taskInput.current!.val().trim().substring(0, 59)
      );
      task = `${moment().format("YYYY")} - ${task}`;
      let taskDefinition: boolean = true;
      const taskID = hashOfTask(task, taskDefinition);

      addTask(googleToken, taskID, taskID, task, "", "")
         .then((retVal: any) => {
            const msg = retVal.message;
            this.props.myPanel.current!.append(
               `<p style="font-style: normal; color:blue; font-size:11px;">${msg}</p>`
            );
         })
         .catch((err: any) => {
            this.props.myPanel.current!.append(
               `<p style="font-style: normal; color:red; font-size:11px;">C0078: ${err}</p>`
            );
         });

      this.state.chairAssets!.forEach((chair: any) => {
         taskDefinition = false;
         const docID = hashOfTask(`${taskID}${chair}`, taskDefinition);
         addTask(googleToken, docID, taskID, task, chair, "")
            .then((retVal: any) => {
               const msg = retVal.message;
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:blue; font-size:11px;">${msg}</p>`
               );
            })
            .catch((err: any) => {
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:red; font-size:11px;">C0078: ${err}</p>`
               );
            });
      });
   }
}

export default AddDropTasks;
