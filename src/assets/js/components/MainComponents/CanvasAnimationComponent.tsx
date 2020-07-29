// animation tutorial: https://www.youtube.com/watch?reload=9&v=EO6OkltgudE
// animation and React: https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/
// adobe color pallette: https://color.adobe.com/explore

import React, { Component } from "react";
import "../../../styles/index.css";
import { canvasStyling } from "../../../styles/reactStyling";
import { ICircle } from "../../misc/chairLocTypes";

class Circle implements ICircle {
   x: number;
   y: number;
   dX: number;
   dY: number;
   radius: number;
   colorBank: number;
   colorIndex: number;

   constructor(
      xIn: number,
      yIn: number,
      rIn: number,
      dXIn: number,
      dYIn: number,
      cBIn: number,
      cIIn: number
   ) {
      this.x = xIn;
      this.y = yIn;
      this.radius = rIn;
      this.dX = dXIn;
      this.dY = dYIn;
      this.colorBank = cBIn;
      this.colorIndex = cIIn;
   }

   draw(c: any, cA: Array<string>): void {
      c!.beginPath();
      c!.strokeStyle = cA[this.colorIndex];
      c!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c!.fillStyle = cA[this.colorIndex];
      c!.fill();
      c!.stroke();
   }

   update(cW: number, cH: number, c: any, cA: Array<string>): void {
      this.x = this.x + this.dX;
      this.y = this.y + this.dY;
      if (this.x + this.radius >= cW || this.x - this.radius <= 0) {
         this.dX = -this.dX;
      }
      if (this.y + this.radius >= cH || this.y - this.radius <= 0) {
         this.dY = -this.dY;
      }
      this.draw(c, cA);
   }
}
class CanvasAnimationComponent extends Component<{}, {}> {
   canvasRef: any;
   circleArray: Array<Circle> = [];
   numColorBanks: number = 6;
   colorBank: number = 0;
   colorArray: Array<string> = [
      "#0E6542",
      "#68E9B5",
      "#20E595",
      "#2D654E",
      "#19B274",

      "#9DF2C5",
      "#FFFDD2",
      "#67AAAD",
      "#009599",
      "#00678B",

      "#1F6426",
      "#87FF87",
      "#0EAD00",
      "#598B47",
      "#C4E336",

      "#788F87",
      "#032513",
      "#335846",
      "#DBDAD5",
      "#0D0D0A",

      "#7FBF3F",
      "#5D8C2E",
      "#C1F257",
      "#D6F272",
      "#EFF299",

      "#A88F82",
      "#FFFAF7",
      "#F5E1D5",
      "#71A8A7",
      "#D5F5F5",
   ];

   constructor(props: {}) {
      super(props);
      this.canvasRef = React.createRef();
      this.animate = this.animate.bind(this);
      this.state = {};
   }
   canvasElement: HTMLCanvasElement | undefined;
   c: CanvasRenderingContext2D | undefined;
   cW: number = 0; // canvasWidth
   cH: number = 0; // canvasHeight
   haventCreatedCanvasYet: boolean = true;

   animate() {
      requestAnimationFrame(this.animate);
      this.c!.clearRect(0, 0, this.cW, this.cH);
      this.circleArray.forEach((circle) => {
         circle.update(this.cW, this.cH, this.c, this.colorArray);
      });
      this.c!.beginPath();
      this.c!.lineWidth = 2;
      this.c!.moveTo(this.circleArray[0].x, this.circleArray[0].y);
      this.c!.lineTo(this.circleArray[1].x, this.circleArray[1].y);
      this.c!.stroke();
      this.c!.font = "15px Josefin Sans";
      this.c!.fillStyle = "#000000";
      this.c!.fillText(`${this.colorBank}`, 8, 18);
      this.c!.font = "7px Josefin Sans";
      this.c!.fillStyle = "#000000";
      this.c!.fillText(
         `${this.circleArray[0].x}${this.circleArray[0].y} ${this.circleArray[2].x}${this.circleArray[2].y}`,
         8,
         25
      );
      this.c!.font = "8px Josefin Sans";
      this.c!.fillStyle = "#000000";
      this.c!.fillText(
         `${this.circleArray[1].x}${this.circleArray[1].y}`,
         8,
         33
      );
   }

   getCanvasContent() {
      this.canvasElement = this.canvasRef.current;
      if (this.canvasElement && this.haventCreatedCanvasYet) {
         this.haventCreatedCanvasYet = false;
         this.cW = window.innerWidth - 25;
         this.cH = window.innerHeight - 75;
         this.canvasElement.setAttribute("height", this.cH.toString());
         this.canvasElement.setAttribute("width", this.cW.toString());
         this.c = this.canvasElement!.getContext("2d")!;
         let x: number = 0;
         let y: number = 0;
         let dX: number = 0;
         let dY: number = 0;
         let radius: number = 0;
         let colorIndex: number = 0;
         this.colorBank = Math.floor(Math.random() * this.numColorBanks);
         for (let i = 0; i < 209; i++) {
            radius = Math.ceil(Math.random() * (8 - 1) + 1); // random # between 2 and 9
            x = Math.ceil(
               Math.random() * (window.innerWidth - radius * 3) + radius
            );
            y = Math.ceil(
               Math.random() * (window.innerHeight - radius * 3) + radius
            );
            x = x >= this.cW - radius ? Math.round(this.cW / 1.5) : x;
            y = y >= this.cH - radius ? Math.round(this.cH / 2) : y;
            dX = Math.round(Math.random() * (3 - 1) + 1);
            dY = Math.round(Math.random() * (3 - 1) + 1);
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            dX = Math.round(plusOrMinus * dX);
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            dY = Math.round(plusOrMinus * dY);
            colorIndex = 5 * this.colorBank + Math.floor(Math.random() * 5);
            this.circleArray.push(
               new Circle(x, y, radius, dX, dY, this.colorBank, colorIndex)
            );
         }
         this.animate();
      }

      return <canvas style={canvasStyling} ref={this.canvasRef} />;
   }

   render() {
      return <>{this.getCanvasContent()}</>;
   }
}

export default CanvasAnimationComponent;
