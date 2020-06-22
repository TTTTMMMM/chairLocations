import "./fonts/JosefinSans-Light-normal"; // 300 weight
import "./fonts/JosefinSans-Regular-normal"; // 400 weight
import "./fonts/JosefinSans-Medium-normal.js"; // 500 weight

import { rentalBoundMiles } from "../../../configs/rentalDistanceConfigs";

import { addReportHeader } from "./addReportHeader";
import { addReportFooter } from "./addReportFooter";
import { numDaysInMonth } from "../../../misc/months";

import jsPDF from "jspdf";

export const createJSPDFinMiles = (
   period: string,
   filename: string,
   reportData: any
): any => {
   let pdf = new jsPDF({ orientation: "l", unit: "pt", lineHeight: 1.2 }); // l = landscape, p would be portrait
   const widthOfRect = 24;
   const heightOfRect = 16;
   pdf = addReportHeader(pdf, period, widthOfRect, heightOfRect);
   let month = period.substring(4, period.length);
   let numDays: number = numDaysInMonth.get(month);

   const width40 = widthOfRect * 0.4;
   // const width30 = widthOfRect * 0.3;
   const width20 = widthOfRect * 0.2;
   const width10 = widthOfRect * 0.1;
   // const width02 = widthOfRect * 0.02;
   const height80 = heightOfRect * 0.8;
   const height66 = heightOfRect * 0.66;
   const startingXPoint = numDays === 31 ? 40 - widthOfRect : 49 - widthOfRect;
   const chairStartingXPoint = numDays === 31 ? 15 : 24;
   const startingYPoint = 81;
   const chairWidth = 68;
   pdf.setFont("JosefinSans-Light");
   pdf.setFontSize(12);

   const beginYData = startingYPoint + heightOfRect;
   const widthOfTable = chairWidth + numDays * widthOfRect;

   // Fill in the table with distances
   let oldRentalAgent: string = "";
   let pageNum = 1;
   let rowNum = 0;
   reportData.forEach((x: any) => {
      const newRentalAgent = x.rentalAgent;
      //   write out the rental agent as a  grouping parameter
      if (newRentalAgent !== oldRentalAgent) {
         oldRentalAgent = newRentalAgent;
         pdf.setTextColor(250, 245, 198);
         pdf.setDrawColor(0, 0, 0);
         pdf.setFillColor(234, 52, 6);
         pdf.setFont("JosefinSans-Regular");
         pdf.setFontSize(11);
         pdf.rect(
            chairStartingXPoint,
            beginYData + rowNum * heightOfRect,
            widthOfTable,
            heightOfRect,
            "FD"
         );
         pdf.text(
            `${newRentalAgent}`,
            chairStartingXPoint + 5,
            beginYData + rowNum * heightOfRect + height80
         );
         rowNum++;
      }
      //   next row: write out the chair (assetlabel)
      const chair = x.assetlabel;
      pdf.setTextColor(250, 245, 198);
      pdf.setDrawColor(0, 0, 0);
      pdf.setFillColor(234, 52, 6);
      pdf.rect(
         chairStartingXPoint,
         beginYData + rowNum * heightOfRect,
         chairWidth,
         heightOfRect,
         "FD"
      );
      pdf.setFontSize(11);
      pdf.setFont("JosefinSans-Regular");
      pdf.text(
         `${chair}`,
         chairStartingXPoint + 5,
         beginYData + rowNum * heightOfRect + height80
      );

      //   write the number of miles in the cell
      let j = 0;
      while (j++ <= numDays - 1) {
         if (
            x[
               "d".concat(
                  j.toLocaleString("en-US", {
                     minimumIntegerDigits: 2,
                  })
               )
            ] == -1
         ) {
            pdf.setTextColor(0, 0, 0);
            pdf.setDrawColor(0, 0, 0);
            pdf.setFillColor(230, 230, 230);
            pdf.setFontSize(7);
            pdf.rect(
               chairStartingXPoint + chairWidth + (j - 1) * widthOfRect,
               beginYData + rowNum * heightOfRect,
               widthOfRect,
               heightOfRect,
               "FD"
            );
         } else {
            pdf.setTextColor(0, 0, 0);
            pdf.setDrawColor(0, 0, 0);
            pdf.setFillColor(255, 255, 255);
            pdf.setFontSize(7);
            pdf.setFont("JosefinSans-Regular");
            pdf.rect(
               chairStartingXPoint + chairWidth + (j - 1) * widthOfRect,
               beginYData + rowNum * heightOfRect,
               widthOfRect,
               heightOfRect,
               "FD"
            );
            let numMiles =
               x[
                  "d".concat(
                     j.toLocaleString("en-US", { minimumIntegerDigits: 2 })
                  )
               ];
            if (numMiles < 10) {
               if (numMiles === 0) {
                  pdf.setFontSize(9);
                  pdf.setTextColor(255, 0, 0); //red
                  pdf.text(
                     `${numMiles}`,
                     startingXPoint +
                        chairWidth +
                        width40 +
                        (j - 1) * widthOfRect,
                     beginYData + rowNum * heightOfRect + height66
                  );
               } else {
                  if (
                     numMiles >= rentalBoundMiles.lower &&
                     numMiles <= rentalBoundMiles.upper
                  ) {
                     pdf.setFontSize(9);
                     pdf.setFont("JosefinSans-Medium");
                     pdf.setFillColor(0, 128, 0); // green
                     pdf.rect(
                        chairStartingXPoint +
                           chairWidth +
                           (j - 1) * widthOfRect,
                        beginYData + rowNum * heightOfRect,
                        widthOfRect,
                        heightOfRect,
                        "FD"
                     );
                  } else {
                     pdf.setFontSize(9);
                     pdf.setFillColor(255, 255, 255); // white
                     pdf.setTextColor(0, 0, 0); //black
                     pdf.setFont("JosefinSans-Regular");
                  }
                  pdf.text(
                     `${numMiles.toFixed(2)}`,
                     startingXPoint +
                        chairWidth +
                        width10 +
                        (j - 1) * widthOfRect,
                     beginYData + rowNum * heightOfRect + height66
                  );
               }
            } else if (numMiles < 100) {
               pdf.setFontSize(9);
               pdf.setFont("JosefinSans-Regular");
               pdf.setFillColor(255, 255, 255); // white
               pdf.setTextColor(0, 0, 0); //black
               pdf.text(
                  `${numMiles.toFixed(1)}`,
                  startingXPoint + chairWidth + width20 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            } else if (numMiles < 1000) {
               pdf.setFillColor(255, 255, 255); // white
               pdf.setFont("JosefinSans-Regular");
               pdf.setFontSize(8);
               pdf.text(
                  `${numMiles.toFixed(0)}`,
                  startingXPoint + chairWidth + width20 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            } else {
               pdf.setFontSize(8);
               pdf.setFont("JosefinSans-Regular");
               pdf.setFillColor(255, 255, 255); //white
               pdf.rect(
                  chairStartingXPoint + chairWidth + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect,
                  widthOfRect,
                  heightOfRect,
                  "FD"
               );
               pdf.text(
                  `${numMiles.toFixed(0)}`,
                  startingXPoint + chairWidth + width10 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            }
         }
      }
      rowNum++;
      if (rowNum >= 25) {
         addReportFooter(
            pdf,
            pageNum,
            widthOfRect,
            heightOfRect,
            "miles",
            1.25,
            15.5
         );
         pageNum++;
         pdf.addPage();
         pdf.setPage(pageNum);
         pdf = addReportHeader(pdf, period, widthOfRect, heightOfRect);
         rowNum = 0;
         oldRentalAgent = "";
      }
   });
   addReportFooter(
      pdf,
      pageNum,
      widthOfRect,
      heightOfRect,
      "miles",
      1.25,
      15.5
   );
   pdf.save(filename);
   return pdf;
};
