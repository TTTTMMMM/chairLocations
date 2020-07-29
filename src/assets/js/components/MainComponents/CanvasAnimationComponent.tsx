// animation tutorial: https://www.youtube.com/watch?reload=9&v=EO6OkltgudE
// animation and React: https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/

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
   colorIndex: number;

   constructor(
      xIn: number,
      yIn: number,
      rIn: number,
      dXIn: number,
      dYIn: number,
      cIIn: number
   ) {
      this.x = xIn;
      this.y = yIn;
      this.radius = rIn;
      this.dX = dXIn;
      this.dY = dYIn;
      this.colorIndex = cIIn;
   }

   draw(c: any, cA: Array<string>): void {
      c!.beginPath();
      c!.strokeStyle = "rgba(0, 0, 255, .38)";
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
   colorArray: Array<string> = [
      // "#0E6542",
      // "#68E9B5",
      // "#20E595",
      // "#2D654E",
      // "#19B274",
      "#9DF2C5",
      "#FFFDD2",
      "#67AAAD",
      "#009599",
      "#00678B",
   ];

   constructor(props: {}) {
      super(props);
      this.canvasRef = React.createRef();
      this.animate = this.animate.bind(this);
      this.mousemove = this.mousemove.bind(this);
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
   }

   componentDidMount() {
      // window.addEventListener("mousemove", this.mousemove);
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
         for (let i = 0; i < 179; i++) {
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
            colorIndex = Math.floor(Math.random() * this.colorArray.length);
            this.circleArray.push(new Circle(x, y, radius, dX, dY, colorIndex));
         }
         this.animate();
      }

      return <canvas style={canvasStyling} ref={this.canvasRef} />;
   }

   render() {
      return <>{this.getCanvasContent()}</>;
   }

   private mousemove(e: any) {
      console.log(`x:${e.clientX}  y:${e.clientY}`);
   }
}

export default CanvasAnimationComponent;
