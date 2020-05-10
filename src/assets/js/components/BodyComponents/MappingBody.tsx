import React, { Component } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import MappingSubheader from "../MappingSubheader";
import ChairQueryComponent from "../ChairQueryComponent";
import RentalAgentQueryComponent from "../RentalAgentQueryComponent";
class MappingBody extends Component<
   {
      match: any;
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
   },
   {}
> {
   constructor(props: {
      match: any;
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
   }) {
      super(props);
      this.getMappingBodyContent = this.getMappingBodyContent.bind(this);
   }

   componentDidMount() {}

   getMappingBodyContent() {
      return (
         <>
            <Router>
               <MappingSubheader match={this.props.match}></MappingSubheader>
               <Switch>
                  <Route
                     path={`${this.props.match.path}/bychair`}
                     component={ChairQueryComponent}
                  />
                  <Route
                     path={`${this.props.match.path}/byrentalagent`}
                     component={RentalAgentQueryComponent}
                  />
               </Switch>
            </Router>
         </>
      );
   }
   render() {
      return <>{this.getMappingBodyContent()}</>;
   }
}

export default MappingBody;
