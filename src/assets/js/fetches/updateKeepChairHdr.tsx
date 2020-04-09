/* eslint-disable no-unused-vars */
// Client-side code follows:

const updateKeepChairHdr = (
   auth2: any,
   id_token: any,
   theKey: any,
   keepit: any,
   myPanel: any
) => {
   let keepObject = { chairhdr: theKey, keep: keepit };
   let jsko = JSON.stringify(keepObject);
   let myHeaders = new Headers();
   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   const myInit = {
      method: "PUT",
      headers: myHeaders,
      body: jsko,
   };
   return new Promise((resolve) => {
      fetch(`/chairheaders/keep/${theKey}`, myInit).then((res) => {
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
               auth2.signOut().then(() => {
                  res.text().then((thePage) => {
                     document.open();
                     document.write(thePage);
                     document.close();
                  });
               });
               break;
            default:
               res.json().then((x) => {
                  myPanel.current!.append(`${x.message}<br/>`);
               });
               resolve(true);
         }
      });
   });
};

export default updateKeepChairHdr;
