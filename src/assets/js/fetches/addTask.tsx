/* eslint-disable no-unused-vars */
// Client-side code follows:
import { TaskObj } from "../misc/chairLocTypes";

const addTask = (
   id_token: any,
   docID: string,
   taskID: string,
   theTask: string,
   asset: string,
   dateDone: string
) => {
   let myHeaders = new Headers();
   let taskObj: TaskObj = {
      docID: docID,
      taskID: taskID,
      task: theTask,
      asset: asset,
      dateDone: dateDone,
   };

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
