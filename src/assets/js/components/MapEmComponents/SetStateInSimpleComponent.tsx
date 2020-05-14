import * as React from "react";
// @ts-ignore

import { CallingFrom } from "../../misc/chairLocTypes";
import { RangeObject } from "../../misc/chairLocTypes";

interface MyState {
   asset?: string;
   range?: RangeObject;
}
class SetStateInSimpleComponent extends React.PureComponent<
   {
      loggedInToFirebase: boolean;
      myPanel: any;
      asset: string | undefined;
      range: RangeObject;
      callingFrom: CallingFrom;
   },
   MyState
> {
   constructor(props: {
      loggedInToFirebase: boolean;
      myPanel: any;
      asset: string;
      range: RangeObject;
      callingFrom: CallingFrom;
   }) {
      super(props);

      this.state = {
         range: { startDate: "2099-01-01", endDate: "2099-12-31" },
         asset: "ggggg",
      };

      console.log(
         `in constructor of SetStateInSimpleComponent, this.props and this.state are:`
      );
      console.dir(this.props);
      console.dir(this.state);
   }

   getChairLocContent() {
      console.log(
         `in SetStateInSimpleComponent, getChairLocContent(), state is:`
      );
      console.dir(this.state);
      return <p>Hi</p>;
   }

   render() {
      console.log(`in render()`);
      if (this.props.callingFrom === CallingFrom.cleanAndUploadFiles) {
         console.log(`setting state to this.props.asset[${this.props.asset}]`);
         this.setState({ asset: this.props.asset }, () => {
            console.log(`from callback of setState()`);
         });
      } else if (this.props.callingFrom === CallingFrom.chairResultsSide) {
         console.log(`setting state to this.props.asset[${this.props.asset}]`);
         this.setState(
            { asset: this.props.asset, range: this.props.range },
            () => {
               console.log(`from callback of setState()`);
               console.dir(this.state);
            }
         );
      }
      return <div>{this.getChairLocContent()}</div>;
   }
}

export default SetStateInSimpleComponent;
