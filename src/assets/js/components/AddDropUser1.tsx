import React from "react";
var escapeHTML = require("escape-html");
import JqxInput, {
   IInputProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import { rolesArray } from "../../js/misc/chairLocTypes";
import { Roles } from "../../js/misc/chairLocTypes";
import addUser from "../../js/fetches/addUser";
import removeUser from "../../js/fetches/removeUser";
import { flexRowTop } from "../../styles/reactStyling";
import { flexRowBottom } from "../../styles/reactStyling";
import { flexRowButtons } from "../../styles/reactStyling";
import { flexCol } from "../../styles/reactStyling";
// import { buttonStyle } from "../../styles/reactStyling";
import { flexUnk } from "../../styles/reactStyling";
import { fieldsetStyle } from "../../styles/reactStyling";
// import { textInputStyleTop } from "../../styles/reactStyling";
// import { textInputStyleBottom } from "../../styles/reactStyling";
import { labelStyleTop } from "../../styles/reactStyling";
import { labelStyleBottom } from "../../styles/reactStyling";

interface MyState extends IInputProps {
   // isAnAdmin: boolean;
   sourceRoles: Array<string>;
}
class AddDropUser1 extends React.PureComponent<
   {
      isAdmin: boolean;
      auth2: any;
      idToken: any;
   },
   MyState
> {
   //   private myNotification = React.createRef<JqxNotification>();
   private usernameInput = React.createRef<JqxInput>();
   private userRoleInput = React.createRef<JqxInput>();

   constructor(props: { isAdmin: boolean; auth2: any; idToken: any }) {
      super(props);
      this.state = {
         sourceRoles: [...rolesArray],
      };

      this.addUserButtonClicked = this.addUserButtonClicked.bind(this);
      this.removeUserButtonClicked = this.removeUserButtonClicked.bind(this);
   }

   render() {
      return this.props.isAdmin ? (
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
                        source={this.state.sourceRoles}
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
                     onClick={this.removeUserButtonClicked}
                  >
                     Remove
                  </JqxButton>
               </div>
            </div>
         </fieldset>
      ) : (
         <div style={{ display: "none" }}></div>
      );
   }

   private addUserButtonClicked() {
      const userName = escapeHTML(
         this.usernameInput.current!.val().trim().substring(0, 49)
      );
      const userRole = escapeHTML(
         this.userRoleInput.current!.val().trim().substring(0, 14)
      );
      const indexOfRole = Object.keys(Roles).indexOf(userRole);
      if (indexOfRole < 0) {
         console.log(
            "Must select one of the roles in the autocomplete but not 'admin'."
         );
      } else if (indexOfRole === 0) {
         console.log("Cannot set user role to 'admin.'");
      } else {
         addUser(this.props.auth2, this.props.idToken, userName, indexOfRole)
            .then((retVal: any) => {
               const msg = retVal.message;
               console.log(`${msg}`);
            })
            .catch((err: any) => {
               console.error(`C0008: ${err}`);
            });
      }
   }

   private removeUserButtonClicked() {
      const userName = escapeHTML(
         this.usernameInput.current!.val().substring(0, 49)
      );
      removeUser(this.props.auth2, this.props.idToken, userName)
         .then((retVal: any) => {
            const msg = retVal.message;
            console.log(`${msg}`);
         })
         .catch((err: any) => {
            console.error(`C0009: ${err}`);
         });
   }
}

export default AddDropUser1;
