import React, { Component } from "react";
import AddDropUser1 from "./AddDropUser1";
import { flexColContainer } from "../../styles/reactStyling";
import { flexRowSplit } from "../../styles/reactStyling";

class ConfigContainer extends Component<{}, {}> {
   render() {
      return (
         <>
            <div style={flexColContainer} className={"configContainerDiv"}>
               <AddDropUser1
                  isAdmin={true}
                  auth2={"not 2, one"}
                  idToken={"idtoken here"}
               ></AddDropUser1>
               <div style={flexRowSplit}></div>
               <AddDropUser1
                  isAdmin={true}
                  auth2={"not 2, one"}
                  idToken={"idtoken here"}
               ></AddDropUser1>
               <div style={flexRowSplit}></div>
               <AddDropUser1
                  isAdmin={true}
                  auth2={"not 2, one"}
                  idToken={"idtoken here"}
               ></AddDropUser1>
            </div>
         </>
      );
   }
}

export default ConfigContainer;
