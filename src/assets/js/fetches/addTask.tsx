/* eslint-disable no-unused-vars */
// Client-side code follows:

interface TaskObj {
   task: string;
   taskID: string;
   dateDone: string;
}

const addTask = (
   id_token: any,
   theTask: string,
   taskID: string,
   dateDone: string
) => {
   let myHeaders = new Headers();
   let taskObj: TaskObj = { task: theTask, taskID: taskID, dateDone: dateDone };

   myHeaders.append("googlecredential", id_token);
   myHeaders.append("Access-Control-Allow-Origin", "*");
   myHeaders.append("Content-Type", "application/json");
   myHeaders.append("Cache-control", "no-cache, must-revalidate");
   const myInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(taskObj),
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

export default addTask;
