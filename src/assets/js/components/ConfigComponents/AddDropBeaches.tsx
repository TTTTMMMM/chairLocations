import * as React from "react";
var escapeHTML = require("escape-html");

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

import addBeach from "../../fetches/addBeach";
import removeBeach from "../../fetches/removeBeach";

import cellRendererDelete from "../../renderers/cellRendererDelete";

import { AuthContext } from "../../contexts/AuthContext";

interface MyState extends IDataTableProps {
   beachesWatch?: any;
   subscribed?: boolean;
}
class AddDropBeaches extends React.PureComponent<{ myPanel: any }, MyState> {
   beachesCollection: any;
   numUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   modifyKey: string | undefined;
   static contextType = AuthContext;

   private myBeachesTable = React.createRef<JqxDataTable>();
   private addBeachButton = React.createRef<JqxButton>();
   private beachInput = React.createRef<JqxInput>();
   private rentalAgentInput = React.createRef<JqxInput>();

   constructor(props: { myPanel: any }) {
      super(props);
      this.beachesCollection = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.dataAdapter = null;

      this.onRowSelect = this.onRowSelect.bind(this);
      this.onRowDoubleClick = this.onRowDoubleClick.bind(this);

      this.state = {
         subscribed: false,
         beachesWatch: [],
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
      this.getBeachesContent = this.getBeachesContent.bind(this);
      this.addBeachButtonClicked = this.addBeachButtonClicked.bind(this);
   }

   subscribeToBeaches() {
      this.beachesCollection = firebase.firestore().collection("beaches");
      this.unsubscribe = this.beachesCollection.onSnapshot(
         this.onCollectionUpdate
      );
      this.setState({ subscribed: true });
   }

   unsubscribeFromBeaches() {
      if (typeof this.unsubscribe != "undefined") {
         this.unsubscribe();
         this.setState({ subscribed: false });
         this.numUpdates = 0;
      }
   }
   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      this.numUpdates!++;
      let beachesWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               beach: string;
               rentalagent: string;
            };
            id: any;
         }) => {
            let { beach, rentalagent } = doc.data();
            beachesWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               beach,
               rentalagent,
            });
         }
      );
      this.setState({
         beachesWatch,
      });
      this.numRows++;
      console.log(
         `%c beachesWatch<${this.numUpdates}>`,
         "background:rgb(250, 245, 198); border: 3px solid hsla(12, 95%, 47%, 0.98); margin: 2px; padding: 3px; color:hsla(12, 95%, 47%, 0.98);"
      );
   };

   getBeachesContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         const source = {
            datafields: [
               { name: "beach", type: "string" },
               { name: "key", type: "string" },
               { name: "rentalagent", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.beachesWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     beach: val.beach,
                     rentalagent: val.rentalagent,
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
            ["beach", 200],
            ["rentalagent", 300],
         ];
         this.columns = [
            {
               text: "",
               datafield: "D",
               width: columnWidths[0][1],
               cellsrenderer: cellRendererDelete,
               align: "center",
               cellclassname: "trashcan",
            },
            {
               text: "Rental Agent",
               width: columnWidths[2][1],
               datafield: "rentalagent",
               align: "center",
               cellclassname: "RentalAgentClass",
               editable: false,
            },
            {
               text: "Beach",
               width: columnWidths[1][1],
               datafield: "beach",
               align: "center",
               cellclassname: "BeachClass",
               editable: false,
            },
         ];
         return (
            <fieldset style={rs.fieldsetBeachStyle}>
               <legend>Manage Rental Agents/Beaches</legend>
               <JqxDataTable
                  ref={this.myBeachesTable}
                  width={500}
                  theme={"fresh"}
                  source={this.dataAdapter}
                  columns={this.columns}
                  filterable={true}
                  pageable={true}
                  altRows={true}
                  autoRowHeight={true}
                  height={400}
                  sortable={true}
                  onRowDoubleClick={this.onRowDoubleClick}
                  onRowSelect={this.onRowSelect}
                  columnsReorder={true}
                  columnsResize={true}
                  editable={false}
                  key={this.numUpdates} // this forces a re-render of the table!
                  editSettings={this.state.editSettings}
                  pageSize={100}
               />
               <div style={rs.divThin}>
                  <label style={rs.labelStyleRental}>RentalAgent:</label>
                  <JqxInput
                     ref={this.rentalAgentInput}
                     minLength={3}
                     maxLength={60}
                     theme={"fresh"}
                     width={300}
                     placeHolder={"Rental Agent"}
                  />
               </div>
               <div style={rs.divThin}>
                  <label style={rs.labelStyleBeach}>Beach:</label>
                  <JqxInput
                     ref={this.beachInput}
                     minLength={3}
                     maxLength={60}
                     theme={"fresh"}
                     width={170}
                     placeHolder={"Name of Beach"}
                  />
               </div>
               <div style={rs.divFlexRowBeach}>
                  <JqxButton
                     ref={this.addBeachButton}
                     onClick={this.addBeachButtonClicked}
                     width={140}
                     height={50}
                     theme={"fresh"}
                     textImageRelation={"imageAboveText"}
                     imgSrc={"../images/beach1.png"}
                     textPosition={"center"}
                  >
                     Add Rental/Beach
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
         this.subscribeToBeaches();
      }
      if (!isLoggedInToFirebase && this.state.subscribed) {
         this.unsubscribeFromBeaches();
      }
      return <div>{this.getBeachesContent()}</div>;
   }

   private onRowDoubleClick(e: any): void {
      const { googleToken } = this.context;
      const rowIndex = e.args.index;
      const columnSelected = e.args.dataField;

      if (columnSelected.localeCompare("D") == 0) {
         let theKey = this.myBeachesTable.current!.getCellValue(
            rowIndex,
            "key"
         );
         removeBeach(googleToken, theKey)
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

   private addBeachButtonClicked() {
      const { googleToken } = this.context;

      const beachName = escapeHTML(
         this.beachInput.current!.val().trim().substring(0, 59)
      );
      const rentalAgent = escapeHTML(
         this.rentalAgentInput.current!.val().trim().substring(0, 59)
      );
      addBeach(googleToken, beachName, rentalAgent)
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

export default AddDropBeaches;
