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
import { months } from "../../misc/months";
import storeReportEntryOnFirebase from "../../fetches/storeReportEntryOnFirebase";

const calcDist = (
   geoPointsArray: Array<IWLocObj>,
   callingFrom: CallingFrom,
   myPanel: any,
   auth2: any,
   googleToken: any
) => {
   let x: IWLocObj = geoPointsArray[geoPointsArray.length - 1]; // pick the last value for the asset and rentalAgent
   const asset = x.assetlabel!;
   const rentalAgent = x.rentalAgent;
   const period = x.updatetime
      .substring(0, 4)
      .concat(months[parseInt(x.updatetime.substring(5, 7)) - 1]);
   if (
      callingFrom === CallingFrom.chairResultsSide ||
      callingFrom === CallingFrom.generateDistanceReport
   ) {
      myPanel.current!.append(
         `<p style="color:#994883 ; font-size:13px;">${asset} -- ${rentalAgent}</p>`
      );
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
         asset: asset,
         rentalAgent: rentalAgent,
         dailyDate: geoPointsArray[0].updatetime.slice(0, 10),
         distObj: cumulativeDistanceObj,
         period: period,
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
            // console.log(`cumDistDaily:`);
            // console.dir(cumDistDaily);
            if (callingFrom === CallingFrom.generateDistanceReport) {
               storeReportEntryOnFirebase(
                  auth2,
                  googleToken,
                  cumDistDaily,
                  myPanel
               );
            } else {
               myPanel.current!.append(
                  `<p style="color:#994883 ; font-size:11.5px;">${cumDistDaily.dailyDate}: ${cumDistDaily.distObj.inFeet} ft. | ${cumDistDaily.distObj.inMiles} miles</p>`
               );
            }
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
               asset: asset,
               rentalAgent: rentalAgent,
               dailyDate: geo2.geoDate,
               distObj: cumulativeDistanceObj,
               period: period,
            };
         }
      });
      if (callingFrom === CallingFrom.generateDistanceReport) {
         storeReportEntryOnFirebase(auth2, googleToken, cumDistDaily, myPanel);
      } else {
         myPanel.current!.append(
            `<p style="color:#994883 ; font-size:11.5px;">${cumDistDaily.dailyDate}: ${cumDistDaily.distObj.inFeet} ft. | ${cumDistDaily.distObj.inMiles} miles</p>`
         );
      }
      // console.log(`cumDistDaily:`);
      // console.dir(cumDistDaily);
   }
};

export default calcDist;
