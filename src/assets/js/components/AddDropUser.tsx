import React from "react";
var escapeHTML = require("escape-html");
import JqxInput, {
   IInputProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";

import { AuthContext } from "../contexts/AuthContext";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import { rolesArray } from "../misc/chairLocTypes";
import { Roles } from "../misc/chairLocTypes";
import addUser from "../fetches/addUser";
import removeUser from "../fetches/removeUser";
import { flexRowTop } from "../../styles/reactStyling";
import { flexRowBottom } from "../../styles/reactStyling";
import { flexRowButtons } from "../../styles/reactStyling";
import { flexCol } from "../../styles/reactStyling";
import { flexUnk } from "../../styles/reactStyling";
import { fieldsetStyle } from "../../styles/reactStyling";
import { labelStyleTop } from "../../styles/reactStyling";
import { labelStyleBottom } from "../../styles/reactStyling";

interface MyState extends IInputProps {
   // isAnAdmin: boolean;
   sourceRoles: Array<string>;
}
class AddDropUser extends React.PureComponent<{ myPanel: any }, MyState> {
   private usernameInput = React.createRef<JqxInput>();
   private userRoleInput = React.createRef<JqxInput>();
   static contextType = AuthContext;

   constructor(props: { myPanel: any }) {
      super(props);
      this.state = {
         sourceRoles: [...rolesArray],
      };

      this.addUserButtonClicked = this.addUserButtonClicked.bind(this);
      this.removeUserButtonClicked = this.removeUserButtonClicked.bind(this);
   }

   render() {
      return (
         <fieldset style={fieldsetStyle}>
            <legend>Manage Users</legend>
            <div style={flexUnk} className={"flexUnk"}>
               <div style={flexCol} className={"flexCol"}>
                  <div style={flexRowTop} className={"flexRowTop"}>
                     <label style={labelStyleTop}>Username:</label>
                     <JqxInput
                        ref={this.usernameInput}
                        minLength={1}
                        maxLength={50}
                        theme={"fresh"}
                        placeHolder={"user name"}
                     />
                  </div>
                  <div style={flexRowBottom} className={"flexRowBottom"}>
                     <label style={labelStyleBottom}>Role:</label>
                     <JqxInput
                        ref={this.userRoleInput}
                        minLength={1}
                        maxLength={50}
                        theme={"fresh"}
                        placeHolder={"user role"}
                        source={this.state.sourceRoles.slice(
                           1,
                           this.state.sourceRoles.length - 1
                        )}
                     />
                  </div>
               </div>
               <div style={flexRowButtons} className={"flexRowButtons"}>
                  <JqxButton
                     width={58}
                     imgPosition={"center"}
                     textPosition={"center"}
                     textImageRelation={"imageAboveText"}
                     imgSrc={"./images/addUser.png"}
                     theme={"fresh"}
                     onClick={this.addUserButtonClicked}
                  >
                     Add
                  </JqxButton>
                  <JqxButton
                     width={58}
                     imgPosition={"center"}
                     textPosition={"center"}
                     textImageRelation={"imageAboveText"}
                     imgSrc={"./images/removeUser.png"}
                     theme={"fresh"}
                     onClick={this.removeUserButtonClicked}
                  >
                     Remove
                  </JqxButton>
               </div>
            </div>
         </fieldset>
      );
   }

   private addUserButtonClicked() {
      const { auth2, googleToken } = this.context;

      const userName = escapeHTML(
         this.usernameInput.current!.val().trim().substring(0, 49)
      );
      const userRole = escapeHTML(
         this.userRoleInput.current!.val().trim().substring(0, 14)
      );
      const indexOfRole = Object.keys(Roles).indexOf(userRole);
      if (indexOfRole < 0) {
         this.props.myPanel.current!.append(
            `<p style="font-style: normal; color:red; font-size:12px;">Must select one of the roles in the autocomplete but not 'admin'.</p>`
         );
      } else if (indexOfRole === 0) {
         this.props.myPanel.current!.append(
            `<p style="font-style: normal; color:red; font-size:12px;">Cannot set user role to 'admin.'</p>`
         );
      } else {
         addUser(auth2, googleToken, userName, indexOfRole)
            .then((retVal: any) => {
               const msg = retVal.message;
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:blue; font-size:12px;">${msg}</p>`
               );
            })
            .catch((err: any) => {
               this.props.myPanel.current!.append(
                  `<p style="font-style: normal; color:red; font-size:12px;">C0018: ${err}</p>`
               );
            });
      }
   }

   private removeUserButtonClicked() {
      const { auth2, googleToken } = this.context;
      const userName = escapeHTML(
         this.usernameInput.current!.val().substring(0, 49)
      );
      removeUser(auth2, googleToken, userName)
         .then((retVal: any) => {
            const msg = retVal.message;
            this.props.myPanel.current!.append(
               `<p style="font-style: normal; color:green; font-size:12px;">${msg}</p>`
            );
         })
         .catch((err: any) => {
            this.props.myPanel.current!.append(
               `<p style="font-style: normal; color:red; font-size:12px;">C0019: ${err}</p>`
            );
         });
   }
}

export default AddDropUser;
