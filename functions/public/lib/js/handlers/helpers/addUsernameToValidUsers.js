// server-side code
// add username to validUserCollection and compose welcome email
// message for email triggering extension that will automatically
// send an email when a document is written to the 'mail' collection
// ----------------------------------------------------------------
const { composeWelcomeEmailMsg } = require("./composeWelcomeEmailMsg");
exports.addUsernameToValidUsers = async (
   res,
   admin,
   functions,
   uName,
   canaccess
) => {
   const uO = { role: "user", canAccess: canaccess };
   console.log(`uO [${JSON.stringify(uO)}]`);
   const aUser = await admin
      .firestore()
      .collection("validUserCollection")
      .doc(uName)
      .get();
   // if (!aUser.exists) {
   try {
      await admin
         .firestore()
         .collection("validUserCollection")
         .doc(uName)
         .set(uO);
   } catch (err) {
      const msg = `Error: ${uName} couldn't be added to validUserCollection`;
      console.log(msg);
      return {
         errCode: 2,
         message: msg,
      };
   }
   try {
      const retVal = await composeWelcomeEmailMsg(admin, uName);
      switch (retVal.errCode) {
         case 4:
            return retVal;
            break;
         default:
            return retVal;
      }
   } catch (err) {
      const msg = `Error: Trouble notifiying ${uName}`;
      console.log(msg);
      return {
         errCode: 3,
         message: msg,
      };
   }
   // } else {
   //    const msg = `${uName} already exists`;
   //    console.log(msg);
   //    return {
   //       errCode: 1,
   //       message: msg,
   //    };
   // }
};
