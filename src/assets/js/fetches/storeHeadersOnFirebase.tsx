/* eslint-disable no-unused-vars */
// Client-side code follows:
import { mandatoryHeaders } from "../configs/additionalTableHeaders";

const storeHeadersOnFirebase = (
   auth2: any,
   id_token: any,
   chairHeader: string,
   myPanel: any
) => {
   let myHeaders = new Headers();
   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   let mandatoryHeadersUpper = [];
   mandatoryHeadersUpper = mandatoryHeaders.map(function (x) {
      return x.toUpperCase();
   });
   let mandatory =
      mandatoryHeadersUpper.indexOf(chairHeader) >= 0 ? true : false;
   let keepit = mandatory ? true : false;
   const myInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
         chairHeader: chairHeader,
         keep: keepit,
         mandatory: mandatory,
      }),
   };
   return new Promise((resolve) => {
      fetch(`/chairheaders`, myInit).then((res) => {
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
                  myPanel.current!.append(
                     `<p style="color:black;font-size:10px;">${data.message}</p>`
                  );
                  resolve(data);
               });
         }
      });
   });
};

export default storeHeadersOnFirebase;
