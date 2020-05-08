import React from "react";
import {
   BrowserRouter as Router,
   Route,
   Switch,
   Redirect,
} from "react-router-dom";

import MainPage from "./pages/MainPage";
import Upload from "./pages/UploadPage";
import MappingPage from "./pages/MappingPage";
import Maintenance from "./pages/MaintenancePage";
import ConfigPage from "./pages/ConfigPage";
import FourOFourPage from "./pages/FourOFourPage";
import FourOOnePage from "./pages/FourOOnePage";

function RoutingComponent() {
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={MainPage}></Route>
            <Route exact path="/upload" component={Upload}></Route>
            <Route path="/mapping" component={MappingPage}></Route>
            <Route exact path="/maintenance" component={Maintenance}></Route>
            <Route exact path="/configuration" component={ConfigPage}></Route>
            <Route exact path="/401" component={FourOOnePage}></Route>
            <Route exact path="/404" component={FourOFourPage}></Route>
            <Redirect to="/404" />
         </Switch>
      </Router>
   );
}

export default RoutingComponent;
