// Client-side code follows:

import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class ConfigSubheader extends Component<{ match: any }, {}> {
   constructor(props: { match: any }) {
      super(props);
      this.state = {};
      this.getHeader = this.getHeader.bind(this);
   }

   componentDidMount() {}

   getHeader() {
      return (
         <header>
            <section></section>
            <section>
               <nav>
                  <ul>
                     <li>
                        <NavLink
                           to={`${this.props.match.url}/usermanagement`}
                           activeStyle={{
                              border: "solid hsla(12, 95%, 47%, 0.98) 2px ",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                           }}
                        >
                           User Management
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                           to={`${this.props.match.url}/rentalagentmanagement`}
                           activeStyle={{
                              border: "solid hsla(12, 95%, 47%, 0.98) 2px ",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                           }}
                        >
                           Rental Agent Management
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                           to={`${this.props.match.url}/reportgeneration`}
                           activeStyle={{
                              border: "solid hsla(12, 95%, 47%, 0.98) 2px ",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                           }}
                        >
                           Generate Distance Reports
                        </NavLink>
                     </li>
                  </ul>
               </nav>
            </section>
            <section></section>
         </header>
      );
   }

   render() {
      return <>{this.getHeader()}</>;
   }
}

export default ConfigSubheader;
