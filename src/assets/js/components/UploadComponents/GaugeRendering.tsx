import * as React from "react";
import JqxBarGauge, {
   IBarGaugeProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbargauge";
class GaugeRendering extends React.PureComponent<
   { maxValue: number; values: Array<number> },
   IBarGaugeProps
> {
   private myBarGauge = React.createRef<JqxBarGauge>();
   constructor(props: { maxValue: number; values: Array<number> }) {
      super(props);
      this.state = {
         tooltip: {
            // @ts-ignore
            formatFunction: (value: number): string => {
               return `hi`;
            },
            visible: true,
         },
      };
   }
   public render() {
      console.log(
         `GaugeRendering>render>this.props.maxValue:${this.props.maxValue}`
      );
      console.log(
         `GaugeRendering>render>this.props.values[0]:${this.props.values[0]}`
      );
      return (
         <JqxBarGauge
            // @ts-ignore
            ref={this.myBarGauge}
            width={200}
            height={200}
            max={this.props.maxValue}
            colorScheme={"scheme02"}
            values={this.props.values}
            tooltip={this.state.tooltip}
         />
      );
   }
}
export default GaugeRendering;
