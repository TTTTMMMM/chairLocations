/* eslint-disable no-unused-vars */
// Client-side code follows:

const removeUser = (auth2: any, id_token: any, theUser: string) => {
   const theUserObj = { username: `${theUser}` };
   let myHeaders = new Headers();
   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   myHeaders.append("Cache-control", "no-cache, must-revalidate");
   const myInit = {
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify(theUserObj),
   };
   return new Promise((resolve) => {
      fetch(`/users`, myInit).then((res) => {
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

export default removeUser;
