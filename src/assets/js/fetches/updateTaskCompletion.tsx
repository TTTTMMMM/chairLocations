/* eslint-disable no-unused-vars */
// Client-side code follows:

const updateTaskCompletion = (
   id_token: any,
   theKey: any,
   dateDone: any,
   myPanel: any
) => {
   let dateCompleteObject = { docID: theKey, dateAccomplished: dateDone };
   let jsco = JSON.stringify(dateCompleteObject);
   let myHeaders = new Headers();
   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   const myInit = {
      method: "PUT",
      headers: myHeaders,
      body: jsco,
   };
   return new Promise((resolve) => {
      fetch(`/tasks/datecomplete/${theKey}`, myInit).then((res) => {
         switch (res.status) {
            case 500:
               res.json().then((x) => {
                  myPanel.current!.append(
                     `<p style="color:red;font-size:9px;">${x.message}</p>`
                  );
               });
               break;
            case 404:
               res.json().then((x) => {
                  myPanel.current!.append(
                     `<p style="color:red;font-size:9px;">${x.message}</p>`
                  );
               });
               break;
            case 401:
               res.json().then((x) => {
                  myPanel.current!.append(
                     `<p style="color:red;font-size:9px;">${x.message}</p>`
                  );
               });
               break;
            case 400:
               res.json().then((x) => {
                  myPanel.current!.append(
                     `<p style="color:red;font-size:9px;">${x.message}</p>`
                  );
               });
               break;
            default:
               res.json().then((x) => {
                  myPanel.current!.append(
                     `<p style="color:green;font-size:9px;">${x.message}</p>`
                  );
                  myPanel.current!.append(
                     `<p style="color:green;font-size:9px;"> </p>`
                  );
                  myPanel.current!.append(
                     `<p style="color:green;font-size:9px;"> </p>`
                  );
               });
               resolve(true);
         }
      });
   });
};

export default updateTaskCompletion;
