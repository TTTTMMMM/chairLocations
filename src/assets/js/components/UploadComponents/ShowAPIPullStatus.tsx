import * as React from "react";
// @ts-ignore
import JqxDataTable, {
   IDataTableProps,
   // jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdatatable";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

import "../../../styles/index.css";

import { AuthContext } from "../../contexts/AuthContext";

import getGeosFromTrak4 from "../../fetches/getGeosFromTrak4";

// import firebase from "firebase/app";
// import "firebase/database";
// import "firebase/firestore";
// import "firebase/auth";

// import { divFlexRow } from "../../../styles/reactStyling";
import { RangeObject, ChairIMEI } from "../../misc/chairLocTypes";

interface MyState extends IDataTableProps {
   reportWatch?: any;
   pairings: Array<ChairIMEI>;
   range: RangeObject;
}
class ShowAPIPullStatus extends React.PureComponent<
   {
      myPanel: any;
      pairings: Array<ChairIMEI>;
      range: RangeObject;
   },
   MyState
> {
   numUpdates: number | undefined;
   numRows: number | undefined;
   columns: any[] | undefined;

   static contextType = AuthContext;

   constructor(props: {
      myPanel: any;
      pairings: Array<ChairIMEI>;
      range: RangeObject;
   }) {
      super(props);
      this.numRows = 0;
      this.columns = [];
      this.numUpdates = 0;

      this.state = {
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
         pairings: [],
      };
   }

   pullGeoReport() {
      if (this.props.pairings.length > 0) {
         this.setState({ pairings: this.props.pairings });
         this.setState({ range: this.props.range });
         this.setState({ reportWatch: [] });
         this.numUpdates = 0;
         console.log(`ShowAPIPullStatus>pullGeoReport()>this.props.pairings:`);
         console.dir(this.props.pairings);
         console.log(`ShowAPIPullStatus>pullGeoReport()>this.props.range:`);
         console.dir(this.props.range);
         // let period = this.props.range.startDate
         //    .split("-")[0]
         //    .concat(this.props.range.startDate.split("-")[1]);
         this.props.pairings.forEach((pairing) => {
            let numRows = 0;
            getGeosFromTrak4(pairing, this.props.range)
               .then((retVal: any) => {
                  let geoLocArray = retVal.data;
                  geoLocArray.forEach((fatChairObj: any) => {
                     console.dir(fatChairObj);
                     numRows++;
                  });
                  this.props.myPanel.current!.append(
                     `<p style="font-style: normal; color:black; font-size:12px;"> pairing[${pairing.chair} ${pairing.imei}], range[${this.props.range.startDate}-${this.props.range.endDate}]: rows[${numRows}]</p>`
                  );
               })
               .catch((err: any) => {
                  this.props.myPanel.current!.append(
                     `<p style="font-style: normal; color:red; font-size:12px;">C0028: ${err}</p>`
                  );
               });
         });
      }
   }

   componentDidMount() {}

   showAPIContent() {
      return <>Hi, from showAPIContent()</>;
   }

   render() {
      return <>{this.showAPIContent()}</>;
   }
}

export default ShowAPIPullStatus;
