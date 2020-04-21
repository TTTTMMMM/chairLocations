/* eslint-disable no-unused-vars */
// Client-side code follows:
import * as clt from "../misc/chairLocTypes";

const addUser = (
   auth2: any,
   id_token: any,
   theUser: string,
   indexOfRole: number
) => {
   let userObj: clt.UserObj;
   switch (indexOfRole) {
      case 0:
         return new Promise((resolve) => {
            resolve({ message: "Cannot set user role to 'admin.'" });
         });
         break;
      case 1:
         userObj = {
            username: theUser,
            role: clt.Roles.uploader,
            canAccess: clt.accessPrivsObj.uploader,
         };
         break;
      case 2:
         userObj = {
            username: theUser,
            role: clt.Roles.lurker,
            canAccess: clt.accessPrivsObj.lurker,
         };
         break;
      case 3:
         userObj = {
            username: theUser,
            role: clt.Roles.maintenance,
            canAccess: clt.accessPrivsObj.maintenance,
         };
         break;
      default:
   }
   let myHeaders = new Headers();
   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   myHeaders.append("Cache-control", "no-cache, must-revalidate");
   const myInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(userObj!),
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

export default addUser;
