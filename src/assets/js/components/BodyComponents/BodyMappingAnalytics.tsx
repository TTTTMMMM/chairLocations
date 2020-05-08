import React, { Component } from "react";
import { Route } from "react-router-dom";
// import {Redirect} from "react-router-dom";
import MainPage from "../../pages/MainPage";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import BodyMappingSubheader from "../../components/BodyMappingSubheader";
import ChairQueryComponent from "../ChairQueryComponent";
import RentalAgentQueryComponent from "../RentalAgentQueryComponent";
class BodyMappingAnalytics extends Component<
   {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
      match: any;
   },
   {}
> {
   constructor(props: {
      auth2: any;
      loggedInWithGoogle: boolean;
      googleToken: any;
      emailAddress: any;
      userObject: UserObj;
      match: any;
   }) {
      super(props);
      this.getBodyMappingAnalyticsBodyContent = this.getBodyMappingAnalyticsBodyContent.bind(
         this
      );
   }

   getBodyMappingAnalyticsBodyContent() {
      if (this.props.loggedInWithGoogle) {
         return (
            <>
               <BodyMappingSubheader
                  match={this.props.match}
               ></BodyMappingSubheader>
               <Route path="/mapping/bychair" component={ChairQueryComponent} />
               <Route
                  path="/mapping/byrentalagent"
                  component={RentalAgentQueryComponent}
               />
            </>
         );
      } else {
         return <Route path="/" component={MainPage} />;
         // return <Redirect to="/" />;
      }
   }
   render() {
      return <>{this.getBodyMappingAnalyticsBodyContent()}</>;
   }
}

export default BodyMappingAnalytics;
