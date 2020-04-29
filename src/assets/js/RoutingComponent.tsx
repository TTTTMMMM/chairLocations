import React from "react";
import {
   BrowserRouter as Router,
   Route,
   Switch,
   Redirect,
} from "react-router-dom";

import MainPage from "./App";
import Upload from "./App";
import MappingAnalytics from "./components/MappingAnalytics";
import Maintenance from "./components/Maintenance";
import FourOFour from "./components/FourOFour";

function RoutingComponent() {
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={MainPage}></Route>
            <Route exact path="/upload" component={Upload}></Route>
            <Route
               exact
               path="/mappinganalytics"
               component={MappingAnalytics}
            ></Route>
            <Route exact path="/maintenance" component={Maintenance}></Route>
            <Route exact path="/404" component={FourOFour}></Route>
            <Redirect to="/404" />
         </Switch>
      </Router>
   );
}

export default RoutingComponent;
