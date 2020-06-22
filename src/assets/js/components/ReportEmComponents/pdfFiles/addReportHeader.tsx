import "./fonts/JosefinSans-Light-normal"; // 300 weight
import "./fonts/JosefinSans-Regular-normal"; // 400 weight
import "./fonts/JosefinSans-Medium-normal.js"; // 500 weight
import moment from "moment";
import { numDaysInMonth } from "../../../misc/months";

import imgData from "./sh_icon";

export const addReportHeader = (
   pdf: any,
   period: string,
   widthOfRect: number,
   heightOfRect: number
): any => {
   // console.dir(reportData);
   pdf.addImage(imgData, "png", 15, 15, 75, 47); // sandhelper icon in upper left corner
   let month = period.substring(4, period.length);
   let year = period.substring(0, 4);
   let numDays: number = numDaysInMonth.get(month);

   //    Report Title
   pdf.setFont("JosefinSans-Regular");
   pdf.setTextColor(0, 0, 0);
   pdf.setFontSize(43);
   pdf.text(`Distance Report ${month} ${year}`, 120, 55);

   const width33 = widthOfRect * 0.33;
   const height80 = heightOfRect * 0.8;
   const startingXPoint = numDays === 31 ? 40 - widthOfRect : 49 - widthOfRect;
   const chairStartingXPoint = numDays === 31 ? 15 : 24;
   const startingYPoint = 81;
   const chairWidth = 68;
   const heightOfDay = heightOfRect - 3;
   const heightDay90 = heightOfDay * 0.85;
   const startingYDayPoint = startingYPoint - heightOfDay;

   pdf.setFont("JosefinSans-Light");
   pdf.setFontSize(12);

   // write "chair" column header
   pdf.setDrawColor(0, 0, 0);
   pdf.setFillColor(250, 245, 198);
   pdf.rect(
      chairStartingXPoint,
      startingYPoint,
      chairWidth,
      heightOfRect,
      "FD"
   );
   pdf.text(`CHAIR`, chairStartingXPoint + 15, startingYPoint + height80);

   //    write "day" and "date" column headers
   let i = 1;
   while (i < numDays + 1) {
      var theDate = moment(`${year}-${month}-${i}`).toString();
      let theDay = theDate.substring(0, 1);
      pdf.setFontSize(10);
      pdf.setDrawColor(0, 0, 0);
      pdf.setFillColor(250, 245, 198);

      pdf.rect(
         startingXPoint + chairWidth - 1 + (i - 1) * widthOfRect,
         startingYDayPoint,
         widthOfRect,
         heightOfDay,
         "FD"
      );
      pdf.text(
         `${theDay}`,
         startingXPoint + chairWidth + width33 + (i - 1) * widthOfRect,
         startingYDayPoint + heightDay90
      );

      pdf.setFillColor(250, 245, 198);
      pdf.setFontSize(12);
      pdf.rect(
         startingXPoint + chairWidth - 1 + (i - 1) * widthOfRect,
         startingYPoint,
         widthOfRect,
         heightOfRect,
         "FD"
      );
      pdf.text(
         `${i}`,
         startingXPoint + chairWidth + width33 + (i - 1) * widthOfRect,
         startingYPoint + height80
      );
      i++;
   }

   return pdf;
};
