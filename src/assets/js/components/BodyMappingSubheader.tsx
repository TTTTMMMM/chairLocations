// Client-side code follows:

import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class BodyMappingSubheader extends Component<{}, {}> {
   constructor(props: {}) {
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
                           to={`/mapping/bychair`}
                           activeStyle={{
                              border: "solid rgb(250, 245, 198) 2px ",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                           }}
                        >
                           By Chair
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                           to={`/mapping/byrentalagent`}
                           activeStyle={{
                              border: "solid rgb(250, 245, 198) 2px ",
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

export default BodyMappingSubheader;
