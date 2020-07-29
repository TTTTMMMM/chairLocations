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

   constructor(
      xIn: number,
      yIn: number,
      rIn: number,
      dXIn: number,
      dYIn: number
   ) {
      this.x = xIn;
      this.y = yIn;
      this.radius = rIn;
      this.dX = dXIn;
      this.dY = dYIn;
   }

   draw(c: any): void {
      c!.beginPath();
      c!.strokeStyle = "rgba(0, 0, 255, .38)";
      c!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c!.stroke();
   }

   update(cW: number, cH: number, c: any): void {
      this.x = this.x + this.dX;
      this.y = this.y + this.dY;
      if (this.x + this.radius >= cW || this.x - this.radius <= 0) {
         this.dX = -this.dX;
      }
      if (this.y + this.radius >= cH || this.y - this.radius <= 0) {
         this.dY = -this.dY;
      }
      this.draw(c);
   }
}
class CanvasAnimationComponent extends Component<{}, {}> {
   canvasRef: any;
   circleArray: Array<Circle> = [];

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
         circle.update(this.cW, this.cH, this.c);
      });
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
         for (let i = 0; i < 99; i++) {
            x = Math.ceil(Math.random() * (window.innerWidth - 25) + 25);
            y = Math.ceil(Math.random() * (window.innerHeight - 25) + 25);
            x = x > this.cW ? Math.round(this.cW / 1.5) : x;
            y = y > this.cH ? Math.round(this.cH / 2) : y;
            radius = Math.ceil(Math.random() * (24 - 2) + 2); // random # between 2 and 24
            dX = Math.round(Math.random() * (8 - 1) + 1);
            dY = Math.round(Math.random() * (8 - 1) + 1);
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            dX = Math.round(plusOrMinus * dX);
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            dY = Math.round(plusOrMinus * dY);
            this.circleArray.push(new Circle(x, y, radius, dX, dY));
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
