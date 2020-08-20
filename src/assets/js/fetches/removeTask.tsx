/* eslint-disable no-unused-vars */
// Client-side code follows:

interface TObj {
   docID: string;
}

const removeTask = (id_token: any, id: string) => {
   let myHeaders = new Headers();
   let tObj: TObj = { docID: id };

   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   const myInit = {
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify(tObj),
   };
   return new Promise((resolve) => {
      fetch(`/tasks`, myInit).then((res) => {
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

export default removeTask;
