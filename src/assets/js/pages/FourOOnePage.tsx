import React, { Component } from "react";
import "../../styles/401.css";

class FourOFourPage extends Component {
   render() {
      return (
         <div>
            <body>
               <section>
                  <div className="title">401 Unauthorized</div>
                  <div className="circles">
                     <p>
                        401
                        <br />
                        <small>Go Away</small>
                     </p>
                     <span className="circle big"></span>
                     <span className="circle med"></span>
                     <span className="circle small"></span>
                     <span className="circle smallest"></span>
                  </div>
               </section>
            </body>
         </div>
      );
   }
}

export default FourOFourPage;
