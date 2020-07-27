// animation tutorial: https://www.youtube.com/watch?reload=9&v=EO6OkltgudE
// animation and React: https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/

import React, { Component } from "react";
import "../../../styles/index.css";
import { canvasStyling } from "../../../styles/reactStyling";

class CanvasAnimationComponent extends Component<{}, {}> {
   canvasRef: any;
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
   x: number = Math.ceil(Math.random() * (window.innerWidth - 25) + 25);
   y: number = Math.ceil(Math.random() * (window.innerHeight - 25) + 25);
   radius: number = Math.ceil(Math.random() * (25 - 3) + 3); //random radius between 3 and 25
   deltaX: number = Math.round(Math.random() * (8 - 1) + 1);
   deltaY: number = Math.round(Math.random() * (8 - 1) + 1);
   haventCreatedCanvasYet: boolean = true;

   animate() {
      requestAnimationFrame(this.animate);
      this.c!.clearRect(0, 0, this.cW, this.cH);
      // this.x = Math.random() * this.cW;
      // this.y = Math.random() * this.cH;
      // this.radius = Math.random() * 25;
      this.c!.beginPath();
      this.c!.strokeStyle = "rgba(255, 0, 0, .78)";
      this.c!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.c!.stroke();
      this.x = this.x + this.deltaX;
      this.y = this.y + this.deltaY;
      if (this.x + this.radius >= this.cW || this.x - this.radius <= 0) {
         this.deltaX = -this.deltaX;
      }
      if (this.y + this.radius >= this.cH || this.y - this.radius <= 0) {
         this.deltaY = -this.deltaY;
      }
   }

   getCanvasContent() {
      let c = this.c;
      this.canvasElement = this.canvasRef.current;
      this.cW = window.innerWidth - 25;
      this.cH = window.innerHeight - 75;
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      this.deltaX = Math.round(plusOrMinus * this.deltaX);
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      this.deltaY = Math.round(plusOrMinus * this.deltaY);
      this.x = this.x > this.cW ? Math.round(this.cW / 1.5) : this.x;
      this.y = this.y > this.cH ? Math.round(this.cH / 2) : this.y;

      console.log(`r: ${this.radius}`);
      console.log(`dX: ${this.deltaX}`);
      console.log(`dY: ${this.deltaY}`);
      console.log(`x: ${this.x}; this.cW: ${this.cW}`);
      console.log(`y: ${this.y}; this.cH: ${this.cH}`);
      if (this.canvasElement && this.haventCreatedCanvasYet) {
         this.haventCreatedCanvasYet = false;
         this.canvasElement.setAttribute("height", this.cH.toString());
         this.canvasElement.setAttribute("width", this.cW.toString());
         c = this.canvasElement!.getContext("2d")!;
         let x: number = 0;
         let y: number = 0;
         let radius: number = 0;
         for (let i = 0; i < 99; i++) {
            x = Math.random() * this.cW;
            y = Math.random() * this.cH;
            radius = Math.random() * 25;
            c.beginPath();
            c.strokeStyle = "rgba(255, 0, 0, .78)";
            c.arc(x, y, radius, 0, Math.PI * 2, false);
            c.stroke();
         }
         this.c = c;
         if (this.c) {
            this.animate();
         }
      }

      return (
         <>
            <canvas style={canvasStyling} ref={this.canvasRef} />
         </>
      );
   }
   render() {
      return <>{this.getCanvasContent()}</>;
   }
}

export default CanvasAnimationComponent;
