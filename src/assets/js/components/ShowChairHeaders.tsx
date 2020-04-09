import * as React from "react";
import * as ReactDOM from "react-dom";
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
import JqxDropDownList from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "../configs/firebaseInit";

import cellRendererKeep from "../renderers/cellRendererKeep";
import updateKeepChairHdr from "../fetches/updateKeepChairHdr";

// class ShowTableHeaders extends Component<{ auth2: any; idToken: any }, {}>
interface MyState extends IDataTableProps {
   chairHeadersWatch?: any;
   keepEditorRenderer?: any;
   subscribed?: boolean;
}
class ShowChairHeaders extends React.PureComponent<
   {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      myPanel: any;
   },
   MyState
> {
   headerCollection: any;
   numUpdates: number | undefined;
   unsubscribe: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   modifyKey: string | undefined;
   boundIndex: number | 0;

   private myChairHeadersTable = React.createRef<JqxDataTable>();
   private keepDropDownList = React.createRef<JqxDropDownList>();

   constructor(props: {
      loggedInWithGoogle: boolean;
      auth2: any;
      idToken: any;
      loggedInToFirebase: boolean;
      myPanel: any;
   }) {
      super(props);
      this.headerCollection = "";
      this.numRows = 0;
      this.columns = [];
      this.modifyKey = "";
      this.numUpdates = 0;
      this.boundIndex = 0;

      this.keepOnSelect = this.keepOnSelect.bind(this);
      this.onRowSelect = this.onRowSelect.bind(this);

      this.state = {
         subscribed: false,
         chairHeadersWatch: [],
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
         keepEditorRenderer: (
            index: number,
            label: string,
            value: any
         ): string => {
            let ss: any = "";
            let img: any = "";
            const imgYesURL = "./images/checkYes.png";
            const imgNoURL = "./images/checkNo.png";
            if (index === 0) {
               img = '<img height="20" width="20" src="' + imgYesURL + '"/>';
               ss = `Yes`;
            } else {
               img = '<img height="20" width="20" src="' + imgNoURL + '"/>';
               ss = `No`;
            }
            const table =
               "<table style='width: 60px;'><tr><td style='width: 55px;'>" +
               img +
               "</td><td>" +
               ss +
               "</td></tr></table>";
            return table;
         },
      };
      this.getChairHeadersContent = this.getChairHeadersContent.bind(this);
   }

   subscribeToChairHeaders() {
      this.headerCollection = firebase.firestore().collection("chairheaders");
      this.unsubscribe = this.headerCollection.onSnapshot(
         this.onCollectionUpdate
      );
      this.setState({ subscribed: true });
   }

   unsubscribeFromChairHeadersTable() {
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
      let chairHeadersWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               chairHeader: any;
               keep: boolean;
            };
            id: any;
         }) => {
            const { chairHeader, keep } = doc.data();
            chairHeadersWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               chairHeader,
               keep,
            });
         }
      );
      this.setState({
         chairHeadersWatch,
      });
      this.numRows++;
      console.log(
         `%cChairHeaders<${this.numUpdates}>`,
         "background:white; border: 3px solid green; margin: 2px; padding: 3px; color:green;"
      );
      setTimeout(() => {
         this.myChairHeadersTable.current!.ensureRowVisible(this.boundIndex!);
      }, 150);
   };

   getChairHeadersContent() {
      if (this.props.loggedInToFirebase) {
         const source = {
            datafields: [
               { name: "chairHeader", type: "string" },
               { name: "keep", type: "bool" },
               { name: "key", type: "string" },
            ],
            id: "key",
            dataType: "json",
            localData: () => {
               let data: any[] = [];
               let i = 0;

               this.state.chairHeadersWatch.forEach((hdr: any) => {
                  data[i++] = {
                     key: hdr.key,
                     chairHeader: hdr.chairHeader,
                     keep: hdr.keep,
                  };
                  this.numRows!++;
               });
               return data;
            },
         };
         this.dataAdapter = new jqx.dataAdapter(source);
         // --
         const getEditorDataAdapter = (dataField: any): any => {
            const editorSource = {
               dataFields: [
                  { name: "chairHeader", type: "string" },
                  { name: "keep", type: "bool" },
                  { name: "key", type: "string" },
               ],
               dataType: "array",
               localData: source.localData(),
            };
            const dataAdapter = new jqx.dataAdapter(editorSource, {
               uniqueDataFields: [dataField],
            });
            return dataAdapter;
         };
         // --
         const columnWidths = [
            ["keepWidth", 60],
            ["chairHeaderWidth", 230],
         ];
         this.columns = [
            {
               text: "Keep",
               width: columnWidths[0][1],
               datafield: "keep",
               cellsrenderer: cellRendererKeep,
               align: "center",
               cellclassname: "keepClass",
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
                     <JqxDropDownList
                        ref={this.keepDropDownList}
                        autoOpen={true}
                        width={80}
                        height={80}
                        source={getEditorDataAdapter("keep")}
                        // selectedIndex={0}
                        onSelect={this.keepOnSelect}
                        itemHeight={40}
                        dropDownHeight={80}
                        valueMember={"own"}
                        renderer={this.state.keepEditorRenderer}
                        dropDownVerticalAlignment={"top"}
                     />,
                     editor[0]
                  );
               },
               getEditorValue: (
                  row: any,
                  cellvalue: any,
                  editor: any
               ): void => {
                  // return the editor's value.
                  return cellvalue;
               },
               initEditor: (
                  row: any,
                  cellvalue: any,
                  editor: any,
                  celltext: any,
                  width: any,
                  height: any
               ): void => {
                  let theKey = this.myChairHeadersTable.current!.getCellValue(
                     row,
                     "key"
                  );
                  this.modifyKey = theKey;
                  let selectedIndex = cellvalue ? 0 : 1;
                  editor.selectedIndex = selectedIndex;
               },
            },
            {
               text: "Property",
               datafield: "chairHeader",
               width: columnWidths[1][1],
               align: "center",
               editable: false,
            },
         ];

         return (
            <JqxDataTable
               ref={this.myChairHeadersTable}
               width={310}
               theme={"fresh"}
               source={this.dataAdapter}
               columns={this.columns}
               filterable={true}
               pageable={true}
               altRows={true}
               autoRowHeight={true}
               height={350}
               sortable={true}
               onRowSelect={this.onRowSelect}
               columnsReorder={true}
               columnsResize={true}
               editable={true}
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
         this.subscribeToChairHeaders();
      }
      if (!this.props.loggedInToFirebase && this.state.subscribed) {
         this.unsubscribeFromChairHeadersTable();
      }
      return <div>{this.getChairHeadersContent()}</div>;
   }

   private keepOnSelect(e: any): void {
      const index = e.args.item.index;
      this.keepDropDownList.current!.close();
      let keeper = index === 0 ? true : false;
      updateKeepChairHdr(
         this.props.auth2,
         this.props.idToken,
         this.modifyKey,
         keeper,
         this.props.myPanel
      ).then(() => {});
   }

   private onRowSelect(e: any): void {
      this.myChairHeadersTable.current!.sortBy("chairHeader", "asc");
      this.myChairHeadersTable.current!.removeFilter("keep");
      this.myChairHeadersTable.current!.removeFilter("chairHeader");
      this.boundIndex = e.args.boundIndex;
      setTimeout(() => {
         this.myChairHeadersTable.current!.ensureRowVisible(e.args.boundIndex);
      }, 300);
      this.myChairHeadersTable.current!.beginCellEdit(
         e.args.boundIndex,
         "keep"
      );
   }
}

export default ShowChairHeaders;
