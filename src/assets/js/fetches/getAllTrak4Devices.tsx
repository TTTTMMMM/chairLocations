/* eslint-disable no-unused-vars */
// Client-side code follows:
import { trak4APIKey } from "../configs/trak4APIConfig";
import { trak4URL } from "../configs/trak4APIConfig";

interface PostAllDevicesObj {
   commandstring: string;
   token: string;
}

const getAllTrak4Devices = (): any => {
   let myHeaders = new Headers();

   let postAllDevicesObj: PostAllDevicesObj = {
      commandstring: "get_devices",
      token: trak4APIKey,
   };
   myHeaders.append("Content-Type", "text/plain");
   myHeaders.append("Accept", "*/*");
   myHeaders.append("Connection", "keep-alive");

   const myInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(postAllDevicesObj),
   };
   return new Promise((resolve) => {
      fetch(trak4URL, myInit)
         .then((res) => {
            switch (res.status) {
               default:
                  res.json().then((data: any) => {
                     resolve(data);
                  });
            }
         })
         .catch((err) => alert(err));
   });
};

export default getAllTrak4Devices;
