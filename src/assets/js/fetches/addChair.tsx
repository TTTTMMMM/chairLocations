/* eslint-disable no-unused-vars */
// Client-side code follows:

interface ChairObj {
   chair: string;
   rentalagent: string;
   created: string;
}

const addChair = (
   id_token: any,
   theChair: string,
   rentalAgent: string,
   today: string
) => {
   let myHeaders = new Headers();
   let chairObj: ChairObj = {
      chair: theChair,
      rentalagent: rentalAgent,
      created: today,
   };

   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   myHeaders.append("Cache-control", "no-cache, must-revalidate");
   const myInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(chairObj),
   };
   return new Promise((resolve) => {
      fetch(`/chairs`, myInit).then((res) => {
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

export default addChair;
