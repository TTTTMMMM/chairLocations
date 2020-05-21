/* eslint-disable no-unused-vars */
// Client-side code follows:
const getLoggedInUser = (auth2: any, id_token: any): any => {
   let myHeaders = new Headers();
   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Cache-control", "no-cache, must-revalidate");
   const myInit = {
      method: "GET",
      headers: myHeaders,
   };
   return new Promise((resolve) => {
      fetch(`/users`, myInit).then((res) => {
         switch (res.status) {
            case 500:
               auth2.signOut().then(() => {
                  res.text().then((thePage) => {
                     document.open();
                     document.write(thePage);
                     document.close();
                  });
               });
               break;
            case 404:
               auth2.signOut().then(() => {
                  res.text().then((thePage) => {
                     document.open();
                     document.write(thePage);
                     document.close();
                  });
               });
               break;
            case 401:
               auth2.signOut().then(() => {
                  res.text().then((thePage) => {
                     document.open();
                     document.write(thePage);
                     document.close();
                  });
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

export default getLoggedInUser;
