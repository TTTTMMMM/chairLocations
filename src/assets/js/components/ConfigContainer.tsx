import React, { Component } from "react";
import AddDropUser from "./AddDropUser";
import { flexColContainer } from "../../styles/reactStyling";
import { flexRowSplit } from "../../styles/reactStyling";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";

class ConfigContainer extends Component<{ auth2: any; idToken: any }, {}> {
   private myPanel = React.createRef<JqxPanel>();
   render() {
      return (
         <>
            <div style={flexColContainer} className={"configContainerDiv"}>
               <AddDropUser
                  auth2={this.props.auth2}
                  idToken={this.props.idToken}
                  myPanel={this.myPanel}
               ></AddDropUser>
               <div style={flexRowSplit}></div>
               <AddDropUser
                  auth2={this.props.auth2}
                  idToken={this.props.idToken}
                  myPanel={this.myPanel}
               ></AddDropUser>
               <div style={flexRowSplit}></div>
               <AddDropUser
                  auth2={this.props.auth2}
                  idToken={this.props.idToken}
                  myPanel={this.myPanel}
               ></AddDropUser>
               <div style={flexRowSplit}></div>
               <JqxPanel
                  ref={this.myPanel}
                  width={325}
                  height={150}
                  theme={"fresh"}
               />
            </div>
         </>
      );
   }
}

export default ConfigContainer;
