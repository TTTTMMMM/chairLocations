// server-side code
// compose welcome email message for email triggering extension
// that will automatically send an email when a document is
// written to the 'mail' collection
// ----------------------------------------------------------------
exports.composeWelcomeEmailMsg = async (admin, uName) => {
   let emailMessage = new Object();
   let message = new Object();
   emailMessage.to = `${uName}@gmail.com`;
   message.subject = `Account Created on ChairLocations`;
   message.text = `Hi from https://chairlocations.web.app/. Enjoy access to your new account.`;
   message.html = `<h3>Hi from https://chairlocations.web.app/. Enjoy access to your new account.</h3><p/><p/><h1>Your chairLoc development team</h1>`;
   emailMessage.message = message;
   try {
      await admin
         .firestore()
         .collection("mail")
         .doc(emailMessage.to)
         .set(emailMessage);
      return {
         errCode: 5,
         message: `Email notification sent to new user, ${uName}@gmail.com`,
      };
   } catch (err) {
      const msg = `Error: Email notification failed for ${uName}@gmail.com.`;
      console.log(msg);
      return {
         errCode: 4,
         message: msg,
      };
   }
};
