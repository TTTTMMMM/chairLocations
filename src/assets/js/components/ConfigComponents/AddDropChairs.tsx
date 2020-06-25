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

import addChair from "../../fetches/addChair";
import removeChair from "../../fetches/removeChair";

import cellRendererDelete from "../../renderers/cellRendererDelete";

import { AuthContext } from "../../contexts/AuthContext";

interface MyState extends IDataTableProps {
   chairsWatch?: any;
   subscribed?: boolean;
   sourceRentalAgent: Array<string>;
   sourceChairAssetLabel: Array<string>;
   alreadyGotInfo: boolean;
}
class AddDropChairs extends React.PureComponent<{ myPanel: any }, MyState> {
   chairsCollection: any;
   rentalAgentCollection: any;
   chairAssetLabelCollection: any;
   numUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   modifyKey: string | undefined;
   static contextType = AuthContext;

   private myChairsTable = React.createRef<JqxDataTable>();
   private addChairButton = React.createRef<JqxButton>();
   private chairInput = React.createRef<JqxInput>();
   private rentalAgentInput = React.createRef<JqxInput>();

   constructor(props: { myPanel: any }) {
      super(props);
      this.chairsCollection = "";
      this.rentalAgentCollection = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.dataAdapter = null;

      this.onRowSelect = this.onRowSelect.bind(this);
      this.onRowDoubleClick = this.onRowDoubleClick.bind(this);

      this.state = {
         subscribed: false,
         chairsWatch: [],
         sourceRentalAgent: [],
         sourceChairAssetLabel: [],
         alreadyGotInfo: false,
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
      this.getChairsContent = this.getChairsContent.bind(this);
      this.addChairButtonClicked = this.addChairButtonClicked.bind(this);
   }

   subscribeToChairs() {
      this.chairsCollection = firebase
         .firestore()
         .collection("chairDeployments");
      this.unsubscribe = this.chairsCollection.onSnapshot(
         this.onCollectionUpdate
      );
      this.setState({ subscribed: true });
   }

   unsubscribeFromChairs() {
      if (typeof this.unsubscribe != "undefined") {
         this.unsubscribe();
         this.setState({ subscribed: false });
         this.numUpdates = 0;
      }
   }
   componentDidMount() {}

   onCollectionUpdate = (querySnapshot: any) => {
      this.numUpdates!++;
      let chairsWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               chair: string;
               rentalagent: string;
               created: string;
            };
            id: any;
         }) => {
            let { chair, rentalagent, created } = doc.data();
            chairsWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               chair,
               rentalagent,
               created,
            });
         }
      );
      this.setState({
         chairsWatch,
      });
      this.numRows++;
      console.log(
         `%c chairsWatch<${this.numUpdates}>`,
         "background: white; border: 3px solid #889900; margin: 2px; padding: 3px; color:#889900;"
      );
   };

   getRentalAgentInfo() {
      let sourceRentalAgents: Array<string> = [];

      this.rentalAgentCollection = firebase
         .firestore()
         .collection("uniqueRentalAgents");
      this.rentalAgentCollection
         .get()
         .then((snapshot: any) => {
            snapshot.forEach((doc: any) => {
               sourceRentalAgents.push(doc.data().RENTALAGENT);
            });
            this.setState({
               sourceRentalAgent: [...new Set(sourceRentalAgents)],
            });
            this.setState({ alreadyGotInfo: true });
         })
         .catch((err: any) => {
            console.log(
               "C0135: Error getting rental agents from 'uniqueRentalAgents'",
               err
            );
         });
   }

   getChairAssetLabelInfo() {
      let sourceChairAssetLabels: Array<string> = [];

      this.chairAssetLabelCollection = firebase
         .firestore()
         .collection("uniqueAssetLabels");
      this.chairAssetLabelCollection
         .get()
         .then((snapshot: any) => {
            snapshot.forEach((doc: any) => {
               sourceChairAssetLabels.push(doc.data().ASSETLABEL);
            });
            this.setState({
               sourceChairAssetLabel: [...new Set(sourceChairAssetLabels)],
            });
            this.setState({ alreadyGotInfo: true });
         })
         .catch((err: any) => {
            console.log(
               "C0136: Error getting Chair Labels from 'uniqueAssetLabels'",
               err
            );
         });
   }

   getChairsContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         const source = {
            datafields: [
               { name: "chair", type: "string" },
               { name: "key", type: "string" },
               { name: "rentalagent", type: "string" },
               { name: "created", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.chairsWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     chair: val.chair,
                     rentalagent: val.rentalagent,
                     created: val.created,
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
            ["chair", 200],
            ["rentalagent", 300],
            ["created", 100],
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
               text: "Chair",
               width: columnWidths[1][1],
               datafield: "chair",
               align: "center",
               cellclassname: "ChairClass",
               editable: false,
            },
            {
               text: "Created",
               width: columnWidths[3][1],
               datafield: "created",
               align: "center",
               cellclassname: "CreatedClass",
               editable: false,
               hidden: true,
            },
         ];
         return (
            <fieldset style={rs.fieldsetBeachStyle}>
               <legend>Manage Rental Agents/Chairs</legend>
               <JqxDataTable
                  ref={this.myChairsTable}
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
                     minLength={2}
                     maxLength={60}
                     theme={"fresh"}
                     width={325}
                     source={this.state.sourceRentalAgent}
                     placeHolder={"Rental Agent"}
                  />
               </div>
               <div style={rs.divThin}>
                  <label style={rs.labelStyleBeach}>Chair:</label>
                  <JqxInput
                     ref={this.chairInput}
                     minLength={2}
                     maxLength={60}
                     theme={"fresh"}
                     width={170}
                     source={this.state.sourceChairAssetLabel}
                     placeHolder={"Chair Label"}
                  />
               </div>
               <div style={rs.divFlexRowBeach}>
                  <JqxButton
                     ref={this.addChairButton}
                     onClick={this.addChairButtonClicked}
                     width={160}
                     height={50}
                     theme={"fresh"}
                     textImageRelation={"imageAboveText"}
                     imgSrc={"../images/beach1.png"}
                     textPosition={"center"}
                  >
                     Add Chair Deployment
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
         this.subscribeToChairs();
      }
      if (isLoggedInToFirebase && !this.state.alreadyGotInfo) {
         this.getRentalAgentInfo();
         this.getChairAssetLabelInfo();
      }
      if (!isLoggedInToFirebase && this.state.subscribed) {
         this.unsubscribeFromChairs();
      }
      return <div>{this.getChairsContent()}</div>;
   }

   private onRowDoubleClick(e: any): void {
      const { googleToken } = this.context;
      const rowIndex = e.args.index;
      const columnSelected = e.args.dataField;

      if (columnSelected.localeCompare("D") == 0) {
         let theKey = this.myChairsTable.current!.getCellValue(rowIndex, "key");
         removeChair(googleToken, theKey)
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
         `<p style="color:#000000 ; font-size:10px;">${prepend}</p>`
      );
      theKeys.forEach((x) => {
         this.props.myPanel.current!.append(
            `<p style="color:#000000 ; font-size:10px;">${x}: "${jsr[x]}",</p>`
         );
      });
      this.props.myPanel.current!.append(
         `<p style="color:#000000 ; font-size:10px;">});</p>`
      );
   }

   private addChairButtonClicked() {
      const { googleToken } = this.context;

      const chairLabel = escapeHTML(
         this.chairInput.current!.val().trim().substring(0, 15)
      );
      const rentalAgent = escapeHTML(
         this.rentalAgentInput.current!.val().trim().substring(0, 59)
      );
      let today = moment().format("YYYY-MM-DD");
      addChair(googleToken, chairLabel, rentalAgent, today)
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

export default AddDropChairs;
