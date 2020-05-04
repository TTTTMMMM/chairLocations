/* eslint-disable no-unused-vars */
// Client-side code follows:

interface BeachObj {
   beach: string;
}

const removeBeach = (auth2: any, id_token: any, theBeach: string) => {
   let myHeaders = new Headers();
   let beachObj: BeachObj = { beach: theBeach };

   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   const myInit = {
      method: "DELETE",
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

export default removeBeach;
