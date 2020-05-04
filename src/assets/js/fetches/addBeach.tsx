/* eslint-disable no-unused-vars */
// Client-side code follows:

interface BeachObj {
   beach: string;
   rentalagent: string;
}

const addBeach = (
   auth2: any,
   id_token: any,
   theBeach: string,
   rentalAgent: string
) => {
   let myHeaders = new Headers();
   let beachObj: BeachObj = { beach: theBeach, rentalagent: rentalAgent };

   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   myHeaders.append("Cache-control", "no-cache, must-revalidate");
   const myInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(beachObj),
   };
   return new Promise((resolve) => {
      fetch(`/beaches`, myInit).then((res) => {
         switch (res.status) {
            case 400:
               res.json().then((data: any) => {
                  resolve(data);
               });
               break;
            default:
               res.json().then((data: any) => {
                  resolve(data);
               });
         }
      });
   });
};

export default addBeach;
