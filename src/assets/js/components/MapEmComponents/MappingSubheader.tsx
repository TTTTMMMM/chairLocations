// Client-side code follows:

import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class MappingSubheader extends Component<{ match: any }, {}> {
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
                           to={`${this.props.match.url}/bychair`}
                           activeStyle={{
                              border: "solid hsla(12, 95%, 47%, 0.98) 2px ",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                           }}
                        >
                           By Chair
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                           to={`${this.props.match.url}/byrentalagent`}
                           activeStyle={{
                              border: "solid hsla(12, 95%, 47%, 0.98) 2px ",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                           }}
                        >
                           By Rental Agent
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

export default MappingSubheader;
