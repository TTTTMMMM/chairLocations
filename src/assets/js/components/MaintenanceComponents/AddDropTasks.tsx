import * as React from "react";
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

import { AuthContext } from "../../contexts/AuthContext";

interface MyState extends IDataTableProps {
   tasksWatch?: any;
   subscribed?: boolean;
}
class AddDropTasks extends React.PureComponent<{ myPanel: any }, MyState> {
   tasksCollection: any;
   numUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   modifyKey: string | undefined;
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

      this.state = {
         subscribed: false,
         tasksWatch: [],
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
      this.tasksCollection = firebase.firestore().collection("tasks");
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
   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      this.numUpdates!++;
      let tasksWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               task: string;
               asset: string;
               dateDone: string;
            };
            id: any;
         }) => {
            let { task, asset, dateDone } = doc.data();
            tasksWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               task,
               asset,
               dateDone,
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

   getTasksContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         const source = {
            datafields: [
               { name: "task", type: "string" },
               { name: "key", type: "string" },
               { name: "asset", type: "string" },
               { name: "dateDone", type: "string" },
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
                     asset: val.asset,
                     dateDone: val.dateDone,
                  };
                  this.numRows!++;
               });
               return data;
            },
         };
         this.dataAdapter = new jqx.dataAdapter(source);
         // --
         const columnWidths = [
            ["", 33] /* trash can */,
            ["task", 200],
            ["asset", 300],
            ["dateDone", 400],
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
               width: columnWidths[2][1],
               datafield: "task",
               align: "center",
               cellclassname: "TaskClass",
               editable: false,
            },
            {
               text: "Asset",
               width: columnWidths[1][1],
               datafield: "asset",
               align: "center",
               cellclassname: "AssetClass",
               editable: false,
            },
            {
               text: "Date",
               width: columnWidths[2][1],
               datafield: "dateDone",
               align: "center",
               cellclassname: "DateDoneClass",
               editable: false,
            },
         ];
         return (
            <fieldset style={rs.fieldsetTaskStyle}>
               <legend>Tasks</legend>
               <JqxDataTable
                  ref={this.myTasksTable}
                  width={1000}
                  theme={"fresh"}
                  source={this.dataAdapter}
                  columns={this.columns}
                  filterable={true}
                  pageable={true}
                  altRows={true}
                  autoRowHeight={true}
                  height={500}
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
               />
               <div style={rs.divThick}>
                  <label style={rs.labelStyleRental}>Task:</label>
                  <JqxInput
                     ref={this.taskInput}
                     minLength={3}
                     maxLength={60}
                     theme={"fresh"}
                     width={600}
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
      }
      if (!isLoggedInToFirebase && this.state.subscribed) {
         this.unsubscribeFromTasks();
      }
      return <div>{this.getTasksContent()}</div>;
   }

   private onRowDoubleClick(e: any): void {
      const { googleToken } = this.context;
      const rowIndex = e.args.index;
      const columnSelected = e.args.dataField;

      if (columnSelected.localeCompare("D") == 0) {
         let theKey = this.myTasksTable.current!.getCellValue(rowIndex, "key");
         removeTask(googleToken, theKey)
            .then((retVal: any) => {
               const msg = retVal.message;
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:blue; font-size:12px;">${msg}</p>`
               );
            })
            .catch((err: any) => {
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:red; font-size:12px;">C0028: ${err}</p>`
               );
            });
      }
   }

   private onRowSelect(e: any): void {
      let jsr = e.args.row;
      let theKeys = Object.keys(jsr);
      let prepend = `{`;
      this.props.myPanel.current!.append(
         `<br style="color:#389304 ; font-size:10px;">${prepend}`
      );
      theKeys.forEach((x) => {
         this.props.myPanel.current!.append(
            `<br style="color:#389304 ; font-size:10px;">${x}: "${jsr[x]}",`
         );
      });
      this.props.myPanel.current!.append(
         `<br style="color:#389304 ; font-size:10px;">});`
      );
   }

   private addTaskButtonClicked() {
      const { googleToken } = this.context;

      let task = escapeHTML(
         this.taskInput.current!.val().trim().substring(0, 59)
      );
      task = `${moment().format("YYYY")} - ${task}`;
      const taskID = hashOfTask(task);
      const dateDone = "";

      addTask(googleToken, task, taskID, dateDone)
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
   }
}

export default AddDropTasks;
