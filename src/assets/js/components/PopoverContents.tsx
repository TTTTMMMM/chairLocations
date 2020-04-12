import * as React from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import additionalHeaders from "../configs/additionalTableHeaders";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class PopoverContents extends React.PureComponent<{ myPanel: any }, {}> {
   private stateInput = React.createRef<JqxInput>();
   private beachInput = React.createRef<JqxInput>();
   private rentalAgentInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();

   constructor(props: { myPanel: any }) {
      super(props);
      this.enterButtonClicked = this.enterButtonClicked.bind(this);
   }

   render() {
      return (
         <div>
            <div
               style={{
                  display: "flex",
                  marginBottom: "6px",
               }}
            >
               <label
                  style={{
                     width: "120 px",
                     textAlign: "right",
                     marginTop: "3px",
                     marginRight: "4px",
                  }}
               >
                  {additionalHeaders[3]}
               </label>
               <JqxInput
                  ref={this.stateInput}
                  width={180}
                  height={20}
                  placeHolder={"Enter a State"}
                  theme={"fresh"}
               />
            </div>
            <div
               style={{
                  display: "flex",
                  marginBottom: "6px",
               }}
            >
               <label
                  style={{
                     width: "120 px",
                     textAlign: "right",
                     marginTop: "3px",
                     marginRight: "4px",
                  }}
               >
                  {additionalHeaders[4]}
               </label>
               <JqxInput
                  ref={this.beachInput}
                  width={180}
                  height={20}
                  placeHolder={"Enter a Beach"}
                  theme={"fresh"}
               />
            </div>
            <div
               style={{
                  display: "flex",
                  marginBottom: "6px",
               }}
            >
               <label
                  style={{
                     width: "120 px",
                     textAlign: "right",
                     marginTop: "3px",
                     marginRight: "4px",
                  }}
               >
                  {additionalHeaders[5]}
               </label>
               <JqxInput
                  ref={this.rentalAgentInput}
                  width={180}
                  height={20}
                  placeHolder={"Enter a Rental Agent"}
                  theme={"fresh"}
               />
            </div>
            <JqxButton
               ref={this.enterButton}
               onClick={this.enterButtonClicked}
               width={250}
               height={25}
               theme={"fresh"}
               textPosition={"center"}
               style={{
                  marginLeft: "10px",
                  paddingTop: "8px",
               }}
            >
               Add Deployed Location Information
            </JqxButton>
         </div>
      );
   }

   private enterButtonClicked() {
      this.props.myPanel.current!.append(
         `<p style="color:black;font-size:10px;">Add Deployed Button Clicked</p>`
      );
   }
}

export default PopoverContents;
