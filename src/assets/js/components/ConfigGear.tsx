import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

class ConfigGear extends React.PureComponent<{
   isAdmin: boolean;
   auth2: any;
   idToken: any;
}> {
   constructor(props: { isAdmin: boolean; auth2: any; idToken: any }) {
      super(props);
   }

   render() {
      return this.props.isAdmin ? (
         <Link to="/configuration">
            <FontAwesomeIcon icon={faCog} />
         </Link>
      ) : (
         <div style={{ display: "none" }}></div>
      );
   }
}

export default ConfigGear;
