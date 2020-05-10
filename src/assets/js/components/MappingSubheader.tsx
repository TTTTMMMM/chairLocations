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
      let prefix = this.props.match.match.url;
      if (this.props.match.match.url === "/") {
         prefix = "/mapping";
      }
      return (
         <header>
            <section></section>
            <section>
               <nav>
                  <ul>
                     <li>
                        <NavLink
                           to={`${prefix}/bychair`}
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
                           to={`${prefix}/byrentalagent`}
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

export default MappingSubheader;
