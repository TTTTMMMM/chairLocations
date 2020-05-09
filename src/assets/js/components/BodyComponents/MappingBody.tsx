import React, { Component } from "react";
import { Route } from "react-router-dom";
import "../../../styles/index.css";
import { UserObj } from "../../misc/chairLocTypes";
import BodyMappingSubheader from "../BodyMappingSubheader";
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

   getMappingBodyContent() {
      console.log(`getMappingBodyContent(), match:`);
      console.dir(this.props.match);
      return (
         <>
            <BodyMappingSubheader></BodyMappingSubheader>
            <Route path={`/mapping/bychair`} component={ChairQueryComponent} />
            <Route
               path={`/mapping/byrentalagent`}
               component={RentalAgentQueryComponent}
            />
         </>
      );
   }
   render() {
      return <>{this.getMappingBodyContent()}</>;
   }
}

export default MappingBody;
