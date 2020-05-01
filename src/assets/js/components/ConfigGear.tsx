import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router-dom";

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
         <NavLink to="/configuration">
            <FontAwesomeIcon icon={faCog} />
         </NavLink>
      ) : (
         <div style={{ display: "none" }}></div>
      );
   }
}

export default ConfigGear;
