import * as React from "react";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import additionalHeaders from "../configs/additionalTableHeaders";
import { statesArray } from "../configs/additionalTableHeaders";
import { beachesArray } from "../configs/additionalTableHeaders";
import { rentalAgentArray } from "../configs/additionalTableHeaders";
import { AdditionalProps } from "../misc/chairLocTypes";

import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import "jqwidgets-scripts/jqwidgets/styles/jqx.base.css";
import "jqwidgets-scripts/jqwidgets/styles/jqx.fresh.css";

class PopoverContents extends React.PureComponent<
   { myPanel: any; additionalPropsPopover: any },
   {
      sourceState: Array<string>;
      sourceBeach: Array<string>;
      sourceRentalAgent: Array<string>;
   }
> {
   private stateInput = React.createRef<JqxInput>();
   private beachInput = React.createRef<JqxInput>();
   private rentalAgentInput = React.createRef<JqxInput>();
   private enterButton = React.createRef<JqxButton>();

   constructor(props: { myPanel: any; additionalPropsPopover: any }) {
      super(props);
      this.enterButtonClicked = this.enterButtonClicked.bind(this);
      this.state = {
         sourceState: [...statesArray],
         sourceBeach: [...beachesArray],
         sourceRentalAgent: [...rentalAgentArray],
      };
   }

   render() {
      return (
         <div className="popovercontents">
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
                  width={170}
                  height={20}
                  placeHolder={"Enter a State"}
                  source={this.state.sourceState}
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
                  width={170}
                  height={20}
                  placeHolder={"Enter a Beach"}
                  source={this.state.sourceBeach}
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
                  width={170}
                  height={20}
                  placeHolder={"Enter a Rental Agent"}
                  source={this.state.sourceRentalAgent}
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
                  paddingTop: "9px",
               }}
            >
               Add Deployed Location Information
            </JqxButton>
         </div>
      );
   }

   private enterButtonClicked() {
      let deployedState = document.querySelector(
         ".popovercontents > div:nth-of-type(1) > input"
      ) as HTMLInputElement;
      let dsv = deployedState.value;

      let deployedBeach = document.querySelector(
         ".popovercontents > div:nth-of-type(2) > input"
      ) as HTMLInputElement;
      let dbv = deployedBeach.value;

      let rentalAgent = document.querySelector(
         ".popovercontents > div:nth-of-type(3) > input"
      ) as HTMLInputElement;
      let rav = rentalAgent.value;

      let additionalPropVals: AdditionalProps = {};
      additionalPropVals.state = dsv;
      additionalPropVals.beach = dbv;
      additionalPropVals.rentalAgent = rav;
      this.props.myPanel.current!.append(
         `<p style="color:black;font-size:11px;"> ${additionalPropVals.state} ${additionalPropVals.beach} ${additionalPropVals.rentalAgent}</p>`
      );
      this.props.additionalPropsPopover.current!.close();
   }
}

export default PopoverContents;
