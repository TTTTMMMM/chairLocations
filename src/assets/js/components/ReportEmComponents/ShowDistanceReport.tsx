import * as React from "react";
// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxCheckBox from "jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import "../../../styles/index.css";
import cellsRendererFeet from "../../renderers/cellRendererFeet";
import cellsRendererMiles from "../../renderers/cellRendererMiles";

import { AuthContext } from "../../contexts/AuthContext";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

import { divFlexRow } from "../../../styles/reactStyling";
import { RangeObject, Roles, DistanceObj } from "../../misc/chairLocTypes";

interface MyState extends IDataTableProps {
   reportWatch?: any;
   subscribedToDistanceReport: boolean;
   assets: Array<string>;
   range: RangeObject;
   milesCheckBoxIsChecked: boolean;
}
class ShowDistanceReport extends React.PureComponent<
   {
      myPanel: any;
      assets: Array<string>;
      range: RangeObject;
   },
   MyState
> {
   distReport: any;
   numUpdates: number | undefined;
   unsubFromDistanceReport: any | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;
   dataAdapter: null;
   milesCheckBoxIsChecked: boolean = false;

   static contextType = AuthContext;

   private feetReportTable = React.createRef<JqxDataTable>();
   private csvButton = React.createRef<JqxButton>();
   private milesCheckBox = React.createRef<JqxCheckBox>();

   constructor(props: {
      myPanel: any;
      assets: Array<string>;
      range: RangeObject;
   }) {
      super(props);
      this.distReport = "";
      this.numRows = 0;
      this.columns = [];
      this.numUpdates = 0;
      this.csvButtonClicked = this.csvButtonClicked.bind(this);

      this.onRowSelect = this.onRowSelect.bind(this);
      this.showReportContent = this.showReportContent.bind(this);
      this.checkedEvent = this.checkedEvent.bind(this);
      this.unCheckedEvent = this.unCheckedEvent.bind(this);

      this.state = {
         subscribedToDistanceReport: false,
         reportWatch: [],
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
         range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         assets: [],
         milesCheckBoxIsChecked: false,
      };
   }

   subscribeToDistanceReport() {
      if (this.props.assets.length > 0) {
         this.setState({ assets: this.props.assets });
         this.setState({ range: this.props.range });
         this.setState({ reportWatch: [] });
         this.numUpdates = 0;
         // console.dir(this.props.assets);
         // console.dir(this.props.range);
         let period = this.props.range.startDate
            .split("-")[0]
            .concat(this.props.range.startDate.split("-")[1]);
         this.props.assets.forEach((asset) => {
            // this.unsubFromDistanceReport();
            this.distReport = firebase
               .firestore()
               .collection(`distReport`)
               .where("assetlabel", "==", asset)
               .where("period", "==", period);
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
      let reportWatch: any[] = [];
      this.numRows = 0;
      querySnapshot.forEach(
         (doc: {
            data: () => {
               assetlabel: string;
               rentalAgent: string;
               period: string;
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
               rentalAgent,
               period,
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
            reportWatch.push({
               key: doc.id,
               doc, // DocumentSnapshot
               assetlabel,
               rentalAgent,
               period,
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
         reportWatch: this.state.reportWatch.concat(reportWatch),
      });
      this.numRows++;
      // console.log(
      //    `%c reportWatch<${this.numUpdates}>`,
      //    "background:white; border: 3px solid #7713AD; margin: 2px; padding: 3px; color: #7713AD;"
      // );
   };

   showReportContent() {
      const { isLoggedInToFirebase } = this.context;
      if (isLoggedInToFirebase) {
         let source = {};
         if (!this.state.milesCheckBoxIsChecked) {
            source = {
               datafields: [
                  { name: "assetlabel", type: "string" },
                  { name: "rentalAgent", type: "string" },
                  { name: "period", type: "string" },
                  { name: "d01", type: "number" },
                  { name: "d02", type: "number" },
                  { name: "d03", type: "number" },
                  { name: "d04", type: "number" },
                  { name: "d05", type: "number" },
                  { name: "d06", type: "number" },
                  { name: "d07", type: "number" },
                  { name: "d08", type: "number" },
                  { name: "d09", type: "number" },
                  { name: "d10", type: "number" },
                  { name: "d11", type: "number" },
                  { name: "d12", type: "number" },
                  { name: "d13", type: "number" },
                  { name: "d14", type: "number" },
                  { name: "d15", type: "number" },
                  { name: "d16", type: "number" },
                  { name: "d17", type: "number" },
                  { name: "d18", type: "number" },
                  { name: "d19", type: "number" },
                  { name: "d20", type: "number" },
                  { name: "d21", type: "number" },
                  { name: "d22", type: "number" },
                  { name: "d23", type: "number" },
                  { name: "d24", type: "number" },
                  { name: "d25", type: "number" },
                  { name: "d26", type: "number" },
                  { name: "d27", type: "number" },
                  { name: "d28", type: "number" },
                  { name: "d29", type: "number" },
                  { name: "d30", type: "number" },
                  { name: "d31", type: "number" },
               ],
               id: "key",
               dataType: "json",
               localData: () => {
                  let data: any[] = [];
                  this.columns!.length = 0;
                  let i = 0;
                  this.state.reportWatch.forEach((val: any) => {
                     data[i] = {
                        key: val.key,
                        assetlabel: val.assetlabel,
                        rentalAgent: val.rentalAgent,
                        period: val.period,
                        d01: val.d01 && val.d01.inFeet,
                        d02: val.d02 && val.d02.inFeet,
                        d03: val.d03 && val.d03.inFeet,
                        d04: val.d04 && val.d04.inFeet,
                        d05: val.d05 && val.d05.inFeet,
                        d06: val.d06 && val.d06.inFeet,
                        d07: val.d07 && val.d07.inFeet,
                        d08: val.d08 && val.d08.inFeet,
                        d09: val.d09 && val.d09.inFeet,
                        d10: val.d10 && val.d10.inFeet,
                        d11: val.d11 && val.d11.inFeet,
                        d12: val.d12 && val.d12.inFeet,
                        d13: val.d13 && val.d13.inFeet,
                        d14: val.d14 && val.d14.inFeet,
                        d15: val.d15 && val.d15.inFeet,
                        d16: val.d16 && val.d16.inFeet,
                        d17: val.d17 && val.d17.inFeet,
                        d18: val.d18 && val.d18.inFeet,
                        d19: val.d19 && val.d19.inFeet,
                        d20: val.d20 && val.d20.inFeet,
                        d21: val.d21 && val.d21.inFeet,
                        d22: val.d22 && val.d22.inFeet,
                        d23: val.d23 && val.d23.inFeet,
                        d24: val.d24 && val.d24.inFeet,
                        d25: val.d25 && val.d25.inFeet,
                        d26: val.d26 && val.d26.inFeet,
                        d27: val.d27 && val.d27.inFeet,
                        d28: val.d28 && val.d28.inFeet,
                        d29: val.d29 && val.d29.inFeet,
                        d30: val.d30 && val.d30.inFeet,
                        d31: val.d31 && val.d31.inFeet,
                     };
                     let j = 0;
                     while (j++ <= 31) {
                        if (
                           typeof data[i][
                              "d".concat(
                                 j.toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                 })
                              )
                           ] === "undefined"
                        ) {
                           data[i][
                              "d".concat(
                                 j.toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                 })
                              )
                           ] = -1;
                        }
                     }
                     this.numRows!++;
                     i++;
                  });
                  return data;
               },
            };
         } else {
            source = {
               datafields: [
                  { name: "assetlabel", type: "string" },
                  { name: "rentalAgent", type: "string" },
                  { name: "period", type: "string" },
                  { name: "d01", type: "number" },
                  { name: "d02", type: "number" },
                  { name: "d03", type: "number" },
                  { name: "d04", type: "number" },
                  { name: "d05", type: "number" },
                  { name: "d06", type: "number" },
                  { name: "d07", type: "number" },
                  { name: "d08", type: "number" },
                  { name: "d09", type: "number" },
                  { name: "d10", type: "number" },
                  { name: "d11", type: "number" },
                  { name: "d12", type: "number" },
                  { name: "d13", type: "number" },
                  { name: "d14", type: "number" },
                  { name: "d15", type: "number" },
                  { name: "d16", type: "number" },
                  { name: "d17", type: "number" },
                  { name: "d18", type: "number" },
                  { name: "d19", type: "number" },
                  { name: "d20", type: "number" },
                  { name: "d21", type: "number" },
                  { name: "d22", type: "number" },
                  { name: "d23", type: "number" },
                  { name: "d24", type: "number" },
                  { name: "d25", type: "number" },
                  { name: "d26", type: "number" },
                  { name: "d27", type: "number" },
                  { name: "d28", type: "number" },
                  { name: "d29", type: "number" },
                  { name: "d30", type: "number" },
                  { name: "d31", type: "number" },
               ],
               id: "key",
               dataType: "json",
               localData: () => {
                  let data: any[] = [];
                  this.columns!.length = 0;
                  let i = 0;
                  this.state.reportWatch.forEach((val: any) => {
                     data[i] = {
                        key: val.key,
                        assetlabel: val.assetlabel,
                        rentalAgent: val.rentalAgent,
                        period: val.period,
                        d01: val.d01 && val.d01.inMiles,
                        d02: val.d02 && val.d02.inMiles,
                        d03: val.d03 && val.d03.inMiles,
                        d04: val.d04 && val.d04.inMiles,
                        d05: val.d05 && val.d05.inMiles,
                        d06: val.d06 && val.d06.inMiles,
                        d07: val.d07 && val.d07.inMiles,
                        d08: val.d08 && val.d08.inMiles,
                        d09: val.d09 && val.d09.inMiles,
                        d10: val.d10 && val.d10.inMiles,
                        d11: val.d11 && val.d11.inMiles,
                        d12: val.d12 && val.d12.inMiles,
                        d13: val.d13 && val.d13.inMiles,
                        d14: val.d14 && val.d14.inMiles,
                        d15: val.d15 && val.d15.inMiles,
                        d16: val.d16 && val.d16.inMiles,
                        d17: val.d17 && val.d17.inMiles,
                        d18: val.d18 && val.d18.inMiles,
                        d19: val.d19 && val.d19.inMiles,
                        d20: val.d20 && val.d20.inMiles,
                        d21: val.d21 && val.d21.inMiles,
                        d22: val.d22 && val.d22.inMiles,
                        d23: val.d23 && val.d23.inMiles,
                        d24: val.d24 && val.d24.inMiles,
                        d25: val.d25 && val.d25.inMiles,
                        d26: val.d26 && val.d26.inMiles,
                        d27: val.d27 && val.d27.inMiles,
                        d28: val.d28 && val.d28.inMiles,
                        d29: val.d29 && val.d29.inMiles,
                        d30: val.d30 && val.d30.inMiles,
                        d31: val.d31 && val.d31.inMiles,
                     };
                     let j = 0;
                     while (j++ <= 31) {
                        if (
                           typeof data[i][
                              "d".concat(
                                 j.toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                 })
                              )
                           ] === "undefined"
                        ) {
                           data[i][
                              "d".concat(
                                 j.toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                 })
                              )
                           ] = -1;
                        }
                     }
                     this.numRows!++;
                     i++;
                  });
                  return data;
               },
            };
         }
         this.dataAdapter = new jqx.dataAdapter(source);
         // --
         const columnWidths = [
            ["ASSETLABEL", 80],
            ["d01", 62],
            ["RENTALAGENT", 160],
         ];
         this.columns!.push({
            text: "Chair",
            width: columnWidths[0][1],
            datafield: "assetlabel",
            align: "center",
            cellclassname: "assetlabelClass",
            editable: false,
            pinned: true,
         });
         this.columns!.push({
            text: "Rental Agent",
            width: columnWidths[2][1],
            datafield: "rentalAgent",
            align: "center",
            cellclassname: "rentalAgentClass",
            editable: false,
            hidden: true,
         });
         this.columns!.push({
            text: "Period",
            width: columnWidths[2][1],
            datafield: "period",
            align: "center",
            hidden: true,
            editable: false,
         });
         let i = 0;
         while (i++ < 31) {
            if (!this.state.milesCheckBoxIsChecked) {
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
                  cellsrenderer: cellsRendererFeet,
               });
            } else {
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
                  cellsrenderer: cellsRendererMiles,
               });
            }
         }
         return (
            <>
               <div className="animateDiv">
                  <JqxDataTable
                     ref={this.feetReportTable}
                     width={920}
                     theme={"fresh"}
                     source={this.dataAdapter}
                     columns={this.columns}
                     groups={["rentalAgent"]}
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
               </div>
               <div style={divFlexRow}>
                  <JqxButton
                     ref={this.csvButton}
                     onClick={this.csvButtonClicked}
                     width={325}
                     height={30}
                     theme={"fresh"}
                     textPosition={"center"}
                  >
                     Output CSV File
                  </JqxButton>
                  <JqxCheckBox
                     ref={this.milesCheckBox}
                     style={{ marginLeft: "10px", float: "left" }}
                     width={200}
                     height={30}
                     onChecked={this.checkedEvent}
                     onUnchecked={this.unCheckedEvent}
                     theme={"fresh"}
                  >
                     Show Distance in Miles
                  </JqxCheckBox>
               </div>
            </>
         );
      } else {
         return <div></div>;
      }
   }

   render() {
      const { isLoggedInToFirebase, userObjFmServer } = this.context;
      let changeInAssets = false;
      changeInAssets =
         JSON.stringify(this.props.assets) != JSON.stringify(this.state.assets);
      let changeInRange =
         this.props.range.startDate !== this.state.range.startDate;
      if (isLoggedInToFirebase && (changeInAssets || changeInRange)) {
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
         `<p style="color:#7713AD ; font-size:11px;">${prepend}</p>`
      );
      theKeys.forEach((x) => {
         this.props.myPanel.current!.append(
            `<p style="color:#7713AD ; font-size:11px;">${x}: "${jsr[x]}",</p>`
         );
      });
      this.props.myPanel.current!.append(
         `<p style="color:#7713AD ; font-size:11px;">});</p>`
      );
   }

   private csvButtonClicked() {
      this.props.myPanel.current!.append(
         `<p style="color:#7713AD ; font-size:11px;">CSV Button Clicked</p>`
      );
   }

   private checkedEvent() {
      this.setState({ milesCheckBoxIsChecked: true });
      let flipDiv = document.querySelector(".animateDiv") as HTMLDivElement;
      flipDiv.style.animation = "scaleyBird 5s";
      // flipDiv.style.transform = "rotateY(360deg)";
   }

   private unCheckedEvent() {
      this.setState({ milesCheckBoxIsChecked: false });
      let flipDiv = document.querySelector(".animateDiv") as HTMLDivElement;
      flipDiv.style.animation = "scaleyBirdR 5s";
      // flipDiv.style.transition = "transform 4s";
      // flipDiv.style.transform = "rotateY(-360deg)";
   }
}

export default ShowDistanceReport;
