export const drivingBound = 13200; // 2.5 miles
export const rentalBound = { lower: 199, upper: drivingBound };
export const relocatingBound = { lower: 1, upper: rentalBound.lower };

export const drivingBoundMiles = 2.5; // 2.5 miles -- above this amount, it was probably driven somewhere
export const rentalBoundMiles = { lower: 0.038, upper: drivingBoundMiles };
export const relocatingBoundMiles = {
   lower: 0.001,
   upper: rentalBoundMiles.lower,
};
