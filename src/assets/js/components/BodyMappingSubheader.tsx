// Client-side code follows:

import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";
import ChairQueryComponent from "./ChairQueryComponent";
import RentalAgentQueryComponent from "./RentalAgentQueryComponent";

class BodyMappingSubheader extends Component<{ match: any }, {}> {
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
                           to={`${this.props.match.url}/1`}
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
                           to="${this.props.match.url}/2"
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
            <Route
               path={`${this.props.match.path}/1`}
               component={ChairQueryComponent}
            />
            <Route
               path={`${this.props.match.path}/2`}
               component={RentalAgentQueryComponent}
            />
         </header>
      );
   }

   render() {
      console.log(
         `in BodyMappingSubheader, this.props.match.path/url [${this.props.match.path}] [${this.props.match.url}]`
      );
      return <>{this.getHeader()}</>;
   }
}

export default BodyMappingSubheader;
