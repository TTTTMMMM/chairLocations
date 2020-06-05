import "./fonts/JosefinSans-Light-normal"; // 300 weight
import "./fonts/JosefinSans-Regular-normal"; // 400 weight
import "./fonts/JosefinSans-Medium-normal.js"; // 500 weight

import imgData from "./sh_icon";
import jsPDF from "jspdf";

export const createJSPDF = (
   period: string,
   filename: string,
   reportData: any
): any => {
   console.dir(reportData);
   let pdf = new jsPDF({ orientation: "l", unit: "pt", lineHeight: 1.2 }); // l = landscape, p would be portrait
   pdf.addImage(imgData, "png", 15, 15, 75, 47); // sandhelper icon in upper left corner
   let month = period.substring(4, period.length);
   let year = period.substring(0, 4);

   //    Report Title
   pdf.setFont("JosefinSans-Regular");
   pdf.setFontSize(43);
   pdf.text(`Distance Report ${month} ${year}`, 120, 55);

   const widthOfRect = 24;
   const heightOfRect = 16;
   //    const width50 = widthOfRect * 0.5;
   const width33 = widthOfRect * 0.33;
   const width20 = widthOfRect * 0.2;
   //    const height50 = heightOfRect *.5;
   //    const height75 = heightOfRect * 0.75;
   const height80 = heightOfRect * 0.8;
   const height60 = heightOfRect * 0.6;
   const startingXPoint = 40 - widthOfRect;
   const startingYPoint = 75;
   const chairWidth = 68;
   const chairStartingXPoint = 15;
   pdf.setFont("JosefinSans-Light");
   pdf.setFontSize(12);

   // write "chair" column header
   pdf.setDrawColor(0, 0, 0);
   pdf.setFillColor(252, 153, 52);
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
      pdf.setFillColor(252, 153, 52);
      pdf.rect(
         startingXPoint + chairWidth + (i - 1) * widthOfRect,
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
   const beginYData = startingYPoint + heightOfRect;
   const widthOfTable = chairWidth + 31 * widthOfRect;

   // Fill in the table with distances
   let oldRentalAgent: string = "";
   let rowNum = 0;
   reportData.forEach((x: any) => {
      const newRentalAgent = x.rentalAgent;
      //   write out the rental agent as a  grouping parameter
      if (newRentalAgent !== oldRentalAgent) {
         oldRentalAgent = newRentalAgent;
         pdf.setDrawColor(0, 0, 0);
         pdf.setFont("JosefinSans-Regular");
         pdf.setFontSize(11);
         pdf.setFillColor(104, 217, 205);
         pdf.rect(
            chairStartingXPoint,
            beginYData + rowNum * heightOfRect,
            widthOfTable + 1,
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
      pdf.setDrawColor(0, 0, 0);
      pdf.setFillColor(104, 217, 205);
      pdf.rect(
         chairStartingXPoint,
         beginYData + rowNum * heightOfRect,
         chairWidth,
         heightOfRect,
         "FD"
      );
      pdf.setFont("JosefinSans-Light");
      pdf.setFontSize(11);
      pdf.text(
         `${chair}`,
         chairStartingXPoint + 5,
         beginYData + rowNum * heightOfRect + height80
      );
      let j = 0;
      //   write the number of feet in the cellwidth20
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
            pdf.setDrawColor(0, 0, 0);
            pdf.setFillColor(225, 225, 225);
            pdf.setFontSize(7);
            pdf.rect(
               chairStartingXPoint + chairWidth + (j - 1) * widthOfRect,
               beginYData + rowNum * heightOfRect,
               widthOfRect,
               heightOfRect,
               "FD"
            );
            // pdf.text(
            //    `${j}`,
            //    startingXPoint + chairWidth + width20 + (j - 1) * widthOfRect,
            //    beginYData + rowNum * heightOfRect + height60
            // );
         } else {
            pdf.setDrawColor(0, 0, 0);
            pdf.setFillColor(255, 255, 255);
            pdf.setFontSize(7);
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
            pdf.text(
               `${numFeet}`,
               startingXPoint + chairWidth + width20 + (j - 1) * widthOfRect,
               beginYData + rowNum * heightOfRect + height60
            );
         }
      }
      rowNum++;
   });

   pdf.save(filename);
   return pdf;
};
