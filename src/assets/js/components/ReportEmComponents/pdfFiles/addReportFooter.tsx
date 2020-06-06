import "./fonts/JosefinSans-Light-normal"; // 300 weight
import "./fonts/JosefinSans-Regular-normal"; // 400 weight
import "./fonts/JosefinSans-Medium-normal.js"; // 500 weight

export const addReportFooter = (
   pdf: any,
   pageNum: number,
   widthOfRect: number,
   heightOfRect: number
): any => {
   // output page number in bottom right corner
   pdf.setFont("JosefinSans-Regular");
   pdf.setFontSize(10);
   pdf.setTextColor(0, 0, 0);
   pdf.text(`(${pageNum})`, 810, 570);

   const legendXStart = 90;
   const legendYStart = 520;
   const boxXStart = legendXStart - 50;
   const boxYStart = legendYStart;
   const width20 = widthOfRect * 0.2;
   const width40 = widthOfRect * 0.4;
   const height70 = heightOfRect * 0.7;

   // output "Legend" in bottom left corner
   // pdf.setFont("JosefinSans-Regular");
   // pdf.setFontSize(10);
   // pdf.setTextColor(0, 0, 0);
   // pdf.text(`Legend`, legendXStart, legendYStart);

   // output revenue (green) box
   pdf.setDrawColor(0, 0, 0);
   pdf.setFillColor(0, 128, 0);
   pdf.rect(boxXStart, boxYStart, widthOfRect, heightOfRect, "FD");
   pdf.setFontSize(9);
   pdf.text(`500`, boxXStart + width20, boxYStart + height70);
   pdf.setFontSize(9);
   pdf.text(
      `Possible revenue movement (200' -- 2.5 miles)`,
      boxXStart + 1.2 * widthOfRect,
      boxYStart + height70
   );

   // output non-revenue (white) box
   let startY = boxYStart + 1 * heightOfRect;
   pdf.setDrawColor(0, 0, 0);
   pdf.setFillColor(255, 255, 255);
   pdf.rect(boxXStart, startY, widthOfRect, heightOfRect, "FD");
   pdf.setFontSize(9);
   pdf.text(`100`, boxXStart + width20, startY + height70);
   pdf.setFontSize(9);
   pdf.text(
      `Unlikely revenue movement`,
      boxXStart + 1.2 * widthOfRect,
      startY + height70
   );

   // output "0" box
   startY = boxYStart + 2 * heightOfRect;
   pdf.setDrawColor(0, 0, 0);
   pdf.setFillColor(255, 255, 255);
   pdf.rect(boxXStart, startY, widthOfRect, heightOfRect, "FD");
   pdf.setFontSize(9);
   pdf.setTextColor(255, 0, 0);
   pdf.text(`0`, boxXStart + width40, startY + height70);
   pdf.setTextColor(0, 0, 0);
   pdf.setFontSize(9);
   pdf.text(
      `GPS indicated no movement`,
      boxXStart + 1.2 * widthOfRect,
      startY + height70
   );

   // output non-reporting box
   startY = boxYStart + 3 * heightOfRect;
   pdf.setDrawColor(0, 0, 0);
   pdf.setFillColor(235, 235, 235);
   pdf.rect(boxXStart, startY, widthOfRect, heightOfRect, "FD");
   pdf.setFontSize(9);
   pdf.setTextColor(0, 0, 0);
   pdf.text(`No GPS report`, boxXStart + 1.2 * widthOfRect, startY + height70);

   return pdf;
};
