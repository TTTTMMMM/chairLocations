// Client-side code follows:

import React, { Component } from "react";
import LoginLogout from "./LoginLogout";
import { NavLink } from "react-router-dom";
import { Roles } from "../misc/chairLocTypes";
import { AuthContext } from "../contexts/AuthContext";

class HeaderComponent extends Component<
   {
      logout: any;
   },
   {}
> {
   constructor(props: { logout: any }) {
      super(props);
      this.state = {};
      this.getHeader = this.getHeader.bind(this);
   }
   static contextType = AuthContext;

   getHeader() {
      const { userObjFmServer } = this.context;
      switch (userObjFmServer.role) {
         case Roles.notloggedin:
            return (
               <header>
                  <section></section>
                  <section></section>
                  <LoginLogout logout={this.props.logout}></LoginLogout>
               </header>
            );
            break;
         case Roles.maintenance:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <NavLink
                                 to="/maintenance"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Maintenance
                              </NavLink>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout logout={this.props.logout}></LoginLogout>
               </header>
            );
            break;
         case Roles.lurker:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <NavLink
                                 to="/mapping"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Map'em
                              </NavLink>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout logout={this.props.logout}></LoginLogout>
               </header>
            );
            break;
         case Roles.uploader:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <NavLink
                                 to="/upload"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Upload
                              </NavLink>
                           </li>
                           <li>
                              <NavLink
                                 to="/mapping"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Map'em
                              </NavLink>
                           </li>
                           <li>
                              <NavLink
                                 to="/reporting"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Report'em
                              </NavLink>
                           </li>
                           <li>
                              <NavLink
                                 to="/maintenance"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Maintenance
                              </NavLink>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout logout={this.props.logout}></LoginLogout>
               </header>
            );
            break;
         case Roles.admin:
            return (
               <header>
                  <section></section>
                  <section>
                     <nav>
                        <ul>
                           <li>
                              <NavLink
                                 to="/upload"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Upload
                              </NavLink>
                           </li>
                           <li>
                              <NavLink
                                 to="/mapping"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Map'em
                              </NavLink>
                           </li>
                           <li>
                              <NavLink
                                 to="/reporting"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Report'em
                              </NavLink>
                           </li>
                           <li>
                              <NavLink
                                 to="/maintenance"
                                 activeStyle={{
                                    border: "solid rgb(250, 245, 198) 2px ",
                                    paddingTop: "3px",
                                    paddingLeft: "3px",
                                 }}
                              >
                                 Maintenance
                              </NavLink>
                           </li>
                        </ul>
                     </nav>
                  </section>
                  <LoginLogout logout={this.props.logout}></LoginLogout>
               </header>
            );
            break;
         default:
            return (
               <header>
                  <section></section>
                  <section></section>
                  <LoginLogout logout={this.props.logout}></LoginLogout>
               </header>
            );
      }
   }

   render() {
      return <>{this.getHeader()}</>;
   }
}

export default HeaderComponent;
