// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// add task to tasks collection
// ----------------------------------------------------------------
exports.addTask = async (req, res, admin) => {
   if (
      res.locals.loggedInUser.role === "admin" ||
      res.locals.loggedInUser.role === "uploader"
   ) {
      const theTask = req.body;
      // validate the input!
      if (theTask) {
         // -- task
         let taskEsc = escapeHTML(
            theTask.task.trim().substring(0, 79).toUpperCase()
         );
         const validTaskRegex = /^[A-Z0-9'&#;,.\- \(\)]{15,79}$/gi;
         let valid_Task = taskEsc.match(validTaskRegex);
         // -- taskID and/or docID
         let taskID = escapeHTML(
            theTask.taskID.trim().substring(0, 6).toUpperCase()
         );
         const validtaskIDRegex = /^[T]{0,1}[A-F0-9]{5}$/;
         let valid_taskID = taskID.match(validtaskIDRegex);
         // -- dateDone
         let dateDoneEsc = escapeHTML(
            theTask.dateDone.trim().substring(0, 10).toUpperCase()
         );
         const validDateRegex = /^20[2-9]{1}[0-9]{1}-[0-1]{1}[0-2]{1}-[0-3]{1}[0-9]{1}$/gi;
         let valid_dateDone = dateDoneEsc.match(validDateRegex);
         let val_dateDone = "";
         if (valid_dateDone !== null) {
            val_dateDone = valid_dateDone[0];
         }
         // -- docID
         let docID = escapeHTML(
            theTask.docID.trim().substring(0, 6).toUpperCase()
         );
         const validDocIDRegex = /^[T]{0,1}[A-F0-9]{5,6}$/;
         let valid_docID = docID.match(validDocIDRegex);
         // -- asset
         let asset = escapeHTML(
            theTask.asset.trim().substring(0, 11).toUpperCase()
         );
         const validChairRegex = /^[A-Z0-9_\-]{7,11}$/;
         let valid_Asset = new Array();
         if (asset.length > 0) {
            valid_Asset = asset.match(validChairRegex);
         } else {
            console.log(`asset's length was 0 for taskID ${valid_taskID[0]}`);
            valid_Asset.push("");
         }
         if (
            valid_Task !== null &&
            valid_taskID !== null &&
            valid_docID !== null &&
            valid_Asset !== null
         ) {
            let docIDPart = valid_docID[0];
            let taskIDPart = valid_taskID[0];
            let taskPart = valid_Task[0];
            let assetPart = valid_Asset[0];
            let dateDonePart = val_dateDone;
            let docName = docIDPart;

            let taskObj = {};
            taskObj.docID = docIDPart;
            taskObj.taskID = taskIDPart;
            taskObj.task = taskPart;
            taskObj.asset = assetPart;
            taskObj.dateDone = dateDonePart;
            try {
               await admin
                  .firestore()
                  .collection("tasks")
                  .doc(docName)
                  .set(taskObj);
               try {
                  await firebaseApp.auth().signOut();
                  let msg = `Added ${docName} for taskID ${taskIDPart}`;
                  console.log(msg);
                  console.log(`Logged out`);
                  res.append("Cache-Control", "no-cache, must-revalidate");
                  return res.status(200).json({
                     message: `${msg}`,
                  });
               } catch (err) {
                  const firstLine =
                     "0195: Couldn't log user out: " +
                     err.message.split("\n")[0];
                  const errCode = err.code;
                  res.status(500).render("500", { firstLine, errCode });
                  console.log(`${firstLine} ${err}`);
               }
            } catch (err) {
               const msg = `0821 Error: ${docName} couldn't be added to tasks collection`;
               console.log(msg);
               res.status(500).json({
                  message: `${msg} \n${err}`,
               });
            }
         } else {
            firstLine = `0814: Invalid task [${theTask.task}] [${taskEsc.match(
               validTaskRegex
            )}] or taskID [${theTask.taskID}] [${taskID.match(
               validtaskIDRegex
            )}] or docID[${theTask.docID}] [${docID.match(
               validDocIDRegex
            )}] or asset[${theTask.asset}] [${asset.match(validChairRegex)}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `${firstLine}`,
            });
         }
      } else {
         return res.status(400).json({ message: `0813: Invalid task object` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
