import * as React from "react";
var escapeHTML = require("escape-html");
import JqxInput, {
   IInputProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxNotification from "jqwidgets-scripts/jqwidgets-react-tsx/jqxnotification";

import { rolesArray } from "../misc/chairLocTypes";
import { Roles } from "../misc/chairLocTypes";

// import removeUserHandler from "./componentHandlers/removeUserHandler";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";
import addUser from "../fetches/addUser";
import removeUser from "../fetches/removeUser";

interface MyState extends IInputProps {
   // isAnAdmin: boolean;
   sourceRoles: Array<string>;
}

class AddDropUser extends React.PureComponent<
   {
      isAdmin: boolean;
      auth2: any;
      idToken: any;
   },
   MyState
> {
   private myNotification = React.createRef<JqxNotification>();
   private usernameInput = React.createRef<JqxInput>();
   private userRoleInput = React.createRef<JqxInput>();

   constructor(props: { isAdmin: boolean; auth2: any; idToken: any }) {
      super(props);
      this.state = {
         // isAnAdmin: false,
         sourceRoles: [...rolesArray],
      };

      this.addUserButtonClicked = this.addUserButtonClicked.bind(this);
      this.removeUserButtonClicked = this.removeUserButtonClicked.bind(this);
   }

   render() {
      return this.props.isAdmin ? (
         <div>
            <div>
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                  }}
               >
                  <JqxInput
                     ref={this.usernameInput}
                     minLength={1}
                     maxLength={50}
                     theme={"fresh"}
                     placeHolder={"user name"}
                  />
                  <JqxInput
                     ref={this.userRoleInput}
                     minLength={1}
                     maxLength={15}
                     theme={"fresh"}
                     source={this.state.sourceRoles}
                     placeHolder={"user role"}
                  />
               </div>
               <div>
                  <JqxButton
                     width={48}
                     imgPosition={"center"}
                     textPosition={"center"}
                     textImageRelation={"imageAboveText"}
                     imgSrc={"./images/addUser.png"}
                     onClick={this.addUserButtonClicked}
                  >
                     Add
                  </JqxButton>
                  <JqxButton
                     width={48}
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
            <div>
               <JqxNotification
                  ref={this.myNotification}
                  showCloseButton={false}
                  width={"100%"}
                  height={35}
                  autoClose={true}
                  appendContainer={"#container"}
                  opacity={1}
                  theme={"fresh"}
                  autoOpen={true}
                  autoCloseDelay={90000}
               >
                  <div id="content">Manage Users</div>
               </JqxNotification>
               <div
                  id="container"
                  style={{
                     width: "244px",
                     height: "37px",
                     marginTop: "2px",
                     opacity: 1.0,
                     backgroundColor: "#F2F2F2",
                     border: "1px solid #AAAAAA",
                     overflow: "auto",
                  }}
               />
            </div>
         </div>
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
         this.myNotification.current!.closeLast();
         document.getElementById("content")!.innerHTML =
            "Must select one of the roles in the autocomplete but not 'admin'.";
         this.myNotification.current!.open();
      } else if (indexOfRole === 0) {
         this.myNotification.current!.closeLast();
         document.getElementById("content")!.innerHTML =
            "Cannot set user role to 'admin.'";
         this.myNotification.current!.open();
      } else {
         addUser(this.props.auth2, this.props.idToken, userName, indexOfRole)
            .then((retVal: any) => {
               this.myNotification.current!.closeLast();
               const msg = retVal.message;
               document.getElementById("content")!.innerHTML = msg;
               this.myNotification.current!.open();
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
            this.myNotification.current!.closeLast();
            const msg = retVal.message;
            document.getElementById("content")!.innerHTML = msg;
            this.myNotification.current!.open();
         })
         .catch((err: any) => {
            console.error(`C0009: ${err}`);
         });
   }
}

export default AddDropUser;
