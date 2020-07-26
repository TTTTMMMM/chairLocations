// animation tutorial: https://www.youtube.com/watch?reload=9&v=EO6OkltgudE
// animation and React: https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/

import React, { Component } from "react";
import "../../../styles/index.css";
import { canvasStyling } from "../../../styles/reactStyling";

class CanvasAnimationComponent extends Component<{}, {}> {
   constructor(props: {}) {
      super(props);
      this.state = {};
   }
   canvasRef: any = React.createRef();
   canvasElement: HTMLCanvasElement | undefined;
   c: CanvasRenderingContext2D | undefined;
   cW: number = 0; // canvasWidth
   cH: number = 0; // canvasHeight
   x: number = 0;
   y: number = 0;
   radius: number = 10;
   numUpdates: number = 0;
   haventCreatedCanvasYet: boolean = true;

   animate() {
      requestAnimationFrame(this.animate);
      this.c!.clearRect(0, 0, this.cW, this.cH);
      this.x = Math.random() * this.cW;
      this.y = Math.random() * this.cH;
      this.radius = Math.random() * 25;
      this.c!.beginPath();
      this.c!.strokeStyle = "rgba(255, 0, 0, .78)";
      this.c!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.c!.stroke();
      this.x++;
      this.numUpdates++;
      console.log(this.numUpdates);
   }

   getCanvasContent() {
      let c = this.c;
      this.canvasElement = this.canvasRef.current;
      this.cW = window.innerWidth - 25;
      this.cH = window.innerHeight - 75;
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
            <canvas
               // key={this.numUpdates} // this forces a re-render of the table!
               style={canvasStyling}
               ref={this.canvasRef}
            />
         </>
      );
   }
   render() {
      return <>{this.getCanvasContent()}</>;
   }
}

export default CanvasAnimationComponent;
