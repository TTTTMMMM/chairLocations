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
import "../configs/firebaseInit";
import { divFlexRowBeach } from "../../styles/reactStyling";
import { divThin } from "../../styles/reactStyling";
import { labelStyleBeach } from "../../styles/reactStyling";

import { fieldsetBeachStyle } from "../../styles/reactStyling";

import cellRendererDelete from "../renderers/cellRendererDelete";

interface MyState extends IDataTableProps {
   beachesWatch?: any;
   subscribed?: boolean;
}
class ShowBeaches extends React.PureComponent<
   {
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      myPanel: any;
   },
   MyState
> {
   beachesCollection: any;
   numUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   modifyKey: string | undefined;

   private myBeachesTable = React.createRef<JqxDataTable>();
   private addBeachButton = React.createRef<JqxButton>();
   private beachInput = React.createRef<JqxInput>();

   constructor(props: {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      myPanel: any;
      asset: string;
   }) {
      super(props);
      this.beachesCollection = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.dataAdapter = null;
      // this.mapModeButtonClicked = this.mapModeButtonClicked.bind(this);

      this.onRowSelect = this.onRowSelect.bind(this);

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
      // console.log(`In onCollectionUpdate() <${util.inspect(querySnapshot)}>`);
      this.numUpdates!++;
      let beachesWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               BEACH: string;
            };
            id: any;
         }) => {
            const { BEACH } = doc.data();
            beachesWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               BEACH,
            });
         }
      );
      this.setState({
         beachesWatch,
      });
      this.numRows++;
      console.log(
         `%c beachesWatch<${this.numUpdates}>`,
         "background:white; border: 3px solid blue; margin: 2px; padding: 3px; color:blue;"
      );
   };

   getBeachesContent() {
      if (this.props.loggedInToFirebase) {
         const source = {
            datafields: [
               { name: "BEACH", type: "string" },
               { name: "key", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.beachesWatch.forEach((val: any) => {
                  data[i++] = {
                     key: val.key,
                     BEACH: val.BEACH,
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
            ["BEACH", 200],
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
               text: "Beach",
               width: columnWidths[1][1],
               datafield: "BEACH",
               align: "center",
               cellclassname: "BeachClass",
               editable: false,
            },
         ];
         return (
            <fieldset style={fieldsetBeachStyle}>
               <legend>Manage Beaches</legend>
               <JqxDataTable
                  ref={this.myBeachesTable}
                  width={225}
                  theme={"fresh"}
                  source={this.dataAdapter}
                  columns={this.columns}
                  filterable={true}
                  pageable={true}
                  altRows={true}
                  autoRowHeight={true}
                  height={275}
                  sortable={true}
                  onRowSelect={this.onRowSelect}
                  columnsReorder={true}
                  columnsResize={true}
                  editable={false}
                  key={this.numUpdates} // this forces a re-render of the table!
                  editSettings={this.state.editSettings}
                  pageSize={50}
               />
               <div style={divThin}>
                  <label style={labelStyleBeach}>Beach:</label>
                  <JqxInput
                     ref={this.beachInput}
                     minLength={3}
                     maxLength={50}
                     theme={"fresh"}
                     width={150}
                     placeHolder={"Name of Beach"}
                  />
               </div>
               <div style={divFlexRowBeach}>
                  <JqxButton
                     ref={this.addBeachButton}
                     onClick={this.addBeachButtonClicked}
                     width={90}
                     height={50}
                     theme={"fresh"}
                     textImageRelation={"imageAboveText"}
                     imgSrc={"./images/beach1.png"}
                     textPosition={"center"}
                  >
                     Add Beach
                  </JqxButton>
               </div>
            </fieldset>
         );
      } else {
         return <div></div>;
      }
   }
   render() {
      if (this.props.loggedInToFirebase && !this.state.subscribed) {
         this.subscribeToBeaches();
      }
      if (!this.props.loggedInToFirebase && this.state.subscribed) {
         this.unsubscribeFromBeaches();
      }
      return <div>{this.getBeachesContent()}</div>;
   }

   private onRowSelect(e: any): void {
      let jsr = e.args.row;
      let theKeys = Object.keys(jsr);
      let prepend = `temp.push({`;
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
      const beachName = escapeHTML(
         this.beachInput.current!.val().trim().substring(0, 49)
      );
      this.props.myPanel.current!.append(
         `<br style="color:#389304 ; font-size:10px;">${beachName}`
      );
   }
}

export default ShowBeaches;
