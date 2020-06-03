/* eslint-disable no-unused-vars */
const cellsRendererMiles = (
   _row: any,
   _columnfield: any,
   value: any,
   _defaulthtml: any,
   _columnproperties: any,
   _rowdata: any
) => {
   const drivingBound = 2.5; // 2.5 miles -- above this amount, it was probably driven somewhere
   const rentalBound = { lower: 0.038, upper: drivingBound }; // approximate 200' to 2 miles sounds like rental distance
   const relocatingBound = { lower: 0.001, upper: rentalBound.lower }; // distances outside legit rental distances are ports
   if (value > drivingBound) {
      if (value > 9.99) {
         return `<span style="color: black; font-weight: 600;">${value.toFixed(
            0
         )} </span>`;
      }
      if (value > rentalBound.upper) {
         return `<span style="color: black; font-weight: 600;">${value.toFixed(
            1
         )} </span>`;
      }
      return `<span style="color: black; font-weight: 600;">${value} </span>`;
   } else if (value > rentalBound.lower && value <= rentalBound.upper) {
      return `<span style="color: green; font-weight: 600;">${value}
      </span>`;
   } else if (value > relocatingBound.lower && value <= relocatingBound.upper) {
      return `<span style="color: black; font-weight: 600;">${value}
      </span>`;
   } else if (value >= 0 && value < relocatingBound.lower) {
      //just in case there is some fractional number above 0
      return `<span style="color: red; font-weight: 600;">${value}
         </span>`;
   } else {
      return `<span style="color: blue; font-weight: 600; visibility: hidden;">0
      </span>`;
   }
};

export default cellsRendererMiles;
