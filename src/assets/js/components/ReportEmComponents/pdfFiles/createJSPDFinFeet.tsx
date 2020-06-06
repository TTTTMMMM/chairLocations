import "./fonts/JosefinSans-Light-normal"; // 300 weight
import "./fonts/JosefinSans-Regular-normal"; // 400 weight
import "./fonts/JosefinSans-Medium-normal.js"; // 500 weight

import { rentalBound } from "../../../configs/rentalDistanceConfigs";

import { addReportHeader } from "./addReportHeader";
import { addReportFooter } from "./addReportFooter";
import jsPDF from "jspdf";

export const createJSPDFinFeet = (
   period: string,
   filename: string,
   reportData: any
): any => {
   // console.dir(reportData);
   let pdf = new jsPDF({ orientation: "l", unit: "pt", lineHeight: 1.2 }); // l = landscape, p would be portrait
   const widthOfRect = 24;
   const heightOfRect = 16;
   pdf = addReportHeader(pdf, period, widthOfRect, heightOfRect);

   const width40 = widthOfRect * 0.4;
   const width30 = widthOfRect * 0.3;
   const width20 = widthOfRect * 0.2;
   const width10 = widthOfRect * 0.1;
   const width02 = widthOfRect * 0.02;
   const height80 = heightOfRect * 0.8;
   const height66 = heightOfRect * 0.66;
   const startingXPoint = 40 - widthOfRect;
   const startingYPoint = 75;
   const chairWidth = 68;
   const chairStartingXPoint = 15;
   pdf.setFont("JosefinSans-Light");
   pdf.setFontSize(12);

   const beginYData = startingYPoint + heightOfRect;
   const widthOfTable = chairWidth + 31 * widthOfRect;

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
      let j = 0;
      //   write the number of feet in the cell
      while (j++ <= 30) {
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
            let numFeet =
               x[
                  "d".concat(
                     j.toLocaleString("en-US", { minimumIntegerDigits: 2 })
                  )
               ];
            if (numFeet < 10) {
               if (numFeet === 0) {
                  pdf.setTextColor(255, 0, 0); //red
               }
               pdf.setFontSize(9);
               pdf.text(
                  `${numFeet}`,
                  startingXPoint + chairWidth + width40 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            } else if (numFeet < 100) {
               pdf.setFontSize(9);
               pdf.text(
                  `${numFeet}`,
                  startingXPoint + chairWidth + width30 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            } else if (numFeet < 1000) {
               if (numFeet >= rentalBound.lower) {
                  pdf.setFont("JosefinSans-Medium");
                  pdf.setFillColor(0, 128, 0); //green
                  pdf.rect(
                     chairStartingXPoint + chairWidth + (j - 1) * widthOfRect,
                     beginYData + rowNum * heightOfRect,
                     widthOfRect,
                     heightOfRect,
                     "FD"
                  );
               }
               pdf.setFontSize(9);
               pdf.text(
                  `${numFeet}`,
                  startingXPoint + chairWidth + width20 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            } else if (numFeet < 10000) {
               pdf.setFont("JosefinSans-Medium");
               pdf.setFillColor(0, 128, 0); //green
               pdf.rect(
                  chairStartingXPoint + chairWidth + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect,
                  widthOfRect,
                  heightOfRect,
                  "FD"
               );
               pdf.setFontSize(8.6);
               pdf.text(
                  `${numFeet}`,
                  startingXPoint + chairWidth + width10 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            } else if (numFeet < 100000) {
               if (numFeet <= rentalBound.upper) {
                  pdf.setFont("JosefinSans-Medium");
                  pdf.setFillColor(0, 128, 0); //green
                  pdf.rect(
                     chairStartingXPoint + chairWidth + (j - 1) * widthOfRect,
                     beginYData + rowNum * heightOfRect,
                     widthOfRect,
                     heightOfRect,
                     "FD"
                  );
               }
               pdf.setFontSize(7.3);
               pdf.text(
                  `${numFeet}`,
                  startingXPoint + chairWidth + width10 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            } else {
               pdf.setFontSize(6);
               pdf.text(
                  `${numFeet}`,
                  startingXPoint + chairWidth + width02 + (j - 1) * widthOfRect,
                  beginYData + rowNum * heightOfRect + height66
               );
            }
         }
      }
      rowNum++;
      if (rowNum >= 25) {
         addReportFooter(pdf, pageNum, widthOfRect, heightOfRect);
         pageNum++;
         pdf.addPage();
         pdf.setPage(pageNum);
         pdf = addReportHeader(pdf, period, widthOfRect, heightOfRect);
         rowNum = 0;
         oldRentalAgent = "";
      }
   });
   addReportFooter(pdf, pageNum, widthOfRect, heightOfRect);
   pdf.save(filename);
   return pdf;
};
