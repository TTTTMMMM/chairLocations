import React, { Component } from "react";
import "../../styles/404.css";

class FourOFourPage extends Component {
   render() {
      return (
         <div>
            <body>
               <section>
                  <div className="title">404 Error Page</div>
                  <div className="circles">
                     <p>
                        404
                        <br />
                        <small>PAGE NOT FOUND (seaside)</small>
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
