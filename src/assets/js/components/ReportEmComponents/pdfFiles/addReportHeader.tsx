import "./fonts/JosefinSans-Light-normal"; // 300 weight
import "./fonts/JosefinSans-Regular-normal"; // 400 weight
import "./fonts/JosefinSans-Medium-normal.js"; // 500 weight

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

   //    Report Title
   pdf.setFont("JosefinSans-Regular");
   pdf.setTextColor(0, 0, 0);
   pdf.setFontSize(43);
   pdf.text(`Distance Report ${month} ${year}`, 120, 55);

   const width33 = widthOfRect * 0.33;
   const height80 = heightOfRect * 0.8;
   const startingXPoint = 40 - widthOfRect;
   const startingYPoint = 75;
   const chairWidth = 68;
   const chairStartingXPoint = 15;
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

   //    write "date" column headers
   let i = 1;
   while (i < 32) {
      pdf.setDrawColor(0, 0, 0);
      pdf.setFillColor(250, 245, 198);
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
