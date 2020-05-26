// Client-side code follows:
import {
   CallingFrom,
   GeoPoint,
   DateGeoObj,
   DistanceObj,
   CumDistDaily,
} from "../../misc/chairLocTypes";
import { IWLocObj } from "../../configs/mapConfigs/mapTypes";
import { calculateDistance, sumDistance } from "../../misc/calculateDistance";

const calcDist = (
   geoPointsArray: Array<IWLocObj>,
   callingFrom: CallingFrom,
   myPanel: any
) => {
   if (callingFrom === CallingFrom.chairResultsSide) {
      let prevGeoPoint: GeoPoint = {
         lat: geoPointsArray[0].location.lat,
         lng: geoPointsArray[0].location.lng,
      };
      let geo1: DateGeoObj = {
         geoDate: geoPointsArray[0].updatetime.slice(0, 10),
         geo: prevGeoPoint,
      };
      let cumulativeDistanceObj: DistanceObj = {
         inMeters: 0,
         inFeet: 0,
         inMiles: 0,
      };
      let cumDistDaily: CumDistDaily = {
         dailyDate: geoPointsArray[0].updatetime.slice(0, 10),
         distObj: cumulativeDistanceObj,
      };
      // ---- loop through each document in resultset from firebase
      geoPointsArray.forEach((x) => {
         let endGeoPoint: GeoPoint = {
            lat: x.location.lat,
            lng: x.location.lng,
         };
         let geo2: DateGeoObj = {
            geoDate: x.updatetime.slice(0, 10),
            geo: endGeoPoint,
         };
         let pointToPointDist: DistanceObj = calculateDistance(
            geo1.geo,
            geo2.geo
         );
         cumulativeDistanceObj = sumDistance(
            cumulativeDistanceObj,
            pointToPointDist
         );
         cumDistDaily.distObj = Object.assign({}, cumulativeDistanceObj);
         if (cumDistDaily.dailyDate === geo2.geoDate) {
            prevGeoPoint = {
               lat: endGeoPoint.lat,
               lng: endGeoPoint.lng,
            };
            geo1 = {
               geoDate: geo2.geoDate,
               geo: prevGeoPoint,
            };
         } else {
            myPanel.current!.append(
               `<p style="color:#994883 ; font-size:12px;">${cumDistDaily.dailyDate}: ${cumDistDaily.distObj.inFeet} ft. | ${cumDistDaily.distObj.inMiles} miles</p>`
            );
            prevGeoPoint = {
               lat: endGeoPoint.lat,
               lng: endGeoPoint.lng,
            };
            geo1 = {
               geoDate: geo2.geoDate,
               geo: prevGeoPoint,
            };
            cumulativeDistanceObj = {
               inMeters: 0,
               inFeet: 0,
               inMiles: 0,
            };
            cumDistDaily = {
               dailyDate: geo2.geoDate,
               distObj: cumulativeDistanceObj,
            };
         }
      });
      myPanel.current!.append(
         `<p style="color:#994883 ; font-size:12px;">${cumDistDaily.dailyDate}: ${cumDistDaily.distObj.inFeet} ft. | ${cumDistDaily.distObj.inMiles} miles</p>`
      );
   }
};

export default calcDist;
