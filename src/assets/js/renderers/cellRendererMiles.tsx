/* eslint-disable no-unused-vars */
import {
   drivingBoundMiles,
   rentalBoundMiles,
   relocatingBoundMiles,
} from "../configs/rentalDistanceConfigs";

const cellsRendererMiles = (
   _row: any,
   _columnfield: any,
   value: any,
   _defaulthtml: any,
   _columnproperties: any,
   _rowdata: any
) => {
   if (value > drivingBoundMiles) {
      if (value > 9.99) {
         return `<span style="color: black; font-weight: 600;">${value.toFixed(
            0
         )} </span>`;
      }
      if (value > rentalBoundMiles.upper) {
         return `<span style="color: black; font-weight: 600;">${value.toFixed(
            1
         )} </span>`;
      }
      return `<span style="color: black; font-weight: 600;">${value} </span>`;
   } else if (
      value > rentalBoundMiles.lower &&
      value <= rentalBoundMiles.upper
   ) {
      return `<span style="color: green; font-weight: 600;">${value}
      </span>`;
   } else if (
      value > relocatingBoundMiles.lower &&
      value <= relocatingBoundMiles.upper
   ) {
      return `<span style="color: black; font-weight: 600;">${value}
      </span>`;
   } else if (value >= 0 && value < relocatingBoundMiles.lower) {
      //just in case there is some fractional number above 0
      return `<span style="color: red; font-weight: 600;">${value}
         </span>`;
   } else {
      return `<span style="color: blue; font-weight: 600; visibility: hidden;">0
      </span>`;
   }
};

export default cellsRendererMiles;
