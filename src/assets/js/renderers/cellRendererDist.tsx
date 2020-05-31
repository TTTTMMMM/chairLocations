/* eslint-disable no-unused-vars */
const cellsRendererDist = (
   _row: any,
   _columnfield: any,
   value: any,
   _defaulthtml: any,
   _columnproperties: any,
   _rowdata: any
) => {
   const drivingBound = 10560; // 2 miles
   const rentalBound = { lower: 199, upper: drivingBound };
   const relocatingBound = { lower: 1, upper: rentalBound.lower };
   if (value > drivingBound) {
      return `<span style="color: black; font-weight: 600;">${value}
      </span>`;
   } else if (value > rentalBound.lower && value <= rentalBound.upper) {
      return `<span style="color: green; font-weight: 600;">${value}
      </span>`;
   } else if (value > relocatingBound.lower && value <= relocatingBound.upper) {
      return `<span style="color: black; font-weight: 600;">${value}
      </span>`;
   } else if (value >= 0 && value < relocatingBound.lower) {
      return `<span style="color: red; font-weight: 600;">${value}
         </span>`;
   } else {
      return `<span style="color: blue; font-weight: 600; visibility: hidden;">0
      </span>`;
   }
};

export default cellsRendererDist;
