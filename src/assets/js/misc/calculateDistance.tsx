// formula for calculating Great Circle distance comes from:
// https://www.movable-type.co.uk/scripts/latlong.html

import { GeoPoint, DistanceObj } from "../misc/chairLocTypes";

export const calculateDistance = (
   loc1: GeoPoint,
   loc2: GeoPoint
): DistanceObj => {
   let lat1 = loc1.lat;
   let lon1 = loc1.lng;
   let lat2 = loc2.lat;
   let lon2 = loc2.lng;

   const R = 6371e3; // metres
   const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
   const φ2 = (lat2 * Math.PI) / 180;
   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

   const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   const d = R * c; // in metres
   const dInMiles = d * 0.000621371;
   const dInFeet = d * 3.28083888;

   let distObj: DistanceObj = {
      inMeters: d,
      inFeet: dInFeet,
      inMiles: dInMiles,
   };

   return distObj;
};

export const sumDistance = (
   dist1: DistanceObj,
   dist2: DistanceObj
): DistanceObj => {
   let meterDistance = Number((dist1.inMeters + dist2.inMeters).toFixed(0));
   let footDistance = Number((dist1.inFeet + dist2.inFeet).toFixed(0));
   let mileDistance = Number((dist1.inMiles + dist2.inMiles).toFixed(2));

   let distObj: DistanceObj = {
      inMeters: meterDistance,
      inFeet: footDistance,
      inMiles: mileDistance,
   };

   return distObj;
};
