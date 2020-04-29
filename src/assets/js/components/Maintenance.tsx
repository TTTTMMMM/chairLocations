import React, { Component } from "react";
import { divFlexRow } from "../../styles/reactStyling";
import { aStyling } from "../../styles/reactStyling";
import { Link } from "react-router-dom";

class Maintenance extends Component {
   render() {
      return (
         <>
            <div style={divFlexRow}>Maintenance Page</div>
            <Link to="/" style={aStyling}>
               Main
            </Link>
            <Link to="/upload" style={aStyling}>
               Upload
            </Link>
            <Link to="/mappinganalytics" style={aStyling}>
               Mapping Analytics
            </Link>
            <Link to="/maintenance" style={aStyling}>
               Maintenance
            </Link>
         </>
      );
   }
}

export default Maintenance;
