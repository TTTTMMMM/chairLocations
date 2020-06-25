/* eslint-disable no-unused-vars */
// Client-side code follows:

interface ChairObj {
   chair: string;
}

const removeChair = (id_token: any, theChair: string) => {
   let myHeaders = new Headers();
   let chairObj: ChairObj = { chair: theChair };

   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   const myInit = {
      method: "DELETE",
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

export default removeChair;
