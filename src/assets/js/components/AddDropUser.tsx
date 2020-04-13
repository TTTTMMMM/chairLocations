import * as React from "react";
var escapeHTML = require("escape-html");
import JqxInput, {
   IInputProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import JqxNotification from "jqwidgets-scripts/jqwidgets-react-tsx/jqxnotification";

// import removeUserHandler from "./componentHandlers/removeUserHandler";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.office.css";
import addUser from "../fetches/addUser";
import removeUser from "../fetches/removeUser";

interface MyState extends IInputProps {
   isAnAdmin: boolean;
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
   private myUserInput = React.createRef<JqxInput>();

   constructor(props: { isAdmin: boolean; auth2: any; idToken: any }) {
      super(props);
      this.state = {
         isAnAdmin: false,
      };

      this.addUserButtonClicked = this.addUserButtonClicked.bind(this);
      this.removeUserButtonClicked = this.removeUserButtonClicked.bind(this);
   }

   render() {
      return this.props.isAdmin ? (
         <div>
            <div>
               <JqxInput
                  ref={this.myUserInput}
                  minLength={1}
                  maxLength={50}
                  theme={"office"}
                  placeHolder={"user name"}
               />
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
                  height={40}
                  autoClose={true}
                  appendContainer={"#container"}
                  opacity={1}
                  theme={"office"}
                  autoOpen={true}
                  autoCloseDelay={90000}
               >
                  <div id="content">Manage Users</div>
               </JqxNotification>
               <div
                  id="container"
                  style={{
                     width: "244px",
                     height: "40px",
                     marginTop: "3px",
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
         this.myUserInput.current!.val().trim().substring(0, 49)
      );
      addUser(this.props.auth2, this.props.idToken, userName)
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

   private removeUserButtonClicked() {
      const userName = escapeHTML(
         this.myUserInput.current!.val().substring(0, 49)
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
