// Client-side code follows:

import React, { Component } from "react";
import LoginLogout from "./LoginLogout";

import JqxNotification from "jqwidgets-scripts/jqwidgets-react-tsx/jqxnotification";

class HeaderComponent extends Component<
   {
      isSignedIn: boolean;
      logout: any;
      photoURL: any;
      auth2: any;
      googleToken: any;
      userObject: any;
   },
   {}
> {
   private myNotification = React.createRef<JqxNotification>();

   constructor(props: {
      isSignedIn: boolean;
      logout: any;
      photoURL: any;
      auth2: any;
      googleToken: any;
      userObject: any;
   }) {
      super(props);
      this.state = {};
   }

   componentDidMount() {}

   render() {
      return (
         <header>
            <section></section>
            <section>
               <fieldset>
                  <legend>Notifications</legend>
                  <div
                     id="addStockMsgContainer"
                     style={{
                        width: "200px",
                        height: "49px",
                        marginTop: "3px",
                        opacity: 1.0,
                        backgroundColor: "#F2F2F2",
                        border: "1px solid #AAAAAA",
                        borderRadius: "5px",
                        boxShadow: "0.3em 0.3em 1em #000",
                        overflow: "auto",
                     }}
                  />
                  <JqxNotification
                     ref={this.myNotification}
                     width={200}
                     position={"top-right"}
                     opacity={0.9}
                     autoOpen={true}
                     autoClose={true}
                     animationOpenDelay={800}
                     autoCloseDelay={20000}
                     appendContainer={"#addStockMsgContainer"}
                     template={"info"}
                  >
                     <div id="keyup">Please, sign in with Google.</div>
                  </JqxNotification>
               </fieldset>
            </section>
            <LoginLogout
               isSignedIn={this.props.isSignedIn}
               logout={this.props.logout}
               photoURL={this.props.photoURL}
               auth2={this.props.auth2}
               idToken={this.props.googleToken}
               userObject={this.props.userObject}
            ></LoginLogout>
         </header>
      );
   }
}

export default HeaderComponent;
