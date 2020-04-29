import React, { Component } from "react";
import { divFlexRow } from "../../styles/reactStyling";
import { aStyling } from "../../styles/reactStyling";
import { Link } from "react-router-dom";

class MappingAnalytics extends Component {
   render() {
      return (
         <>
            <div style={divFlexRow}>Mapping Analytics Page</div>
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

export default MappingAnalytics;
