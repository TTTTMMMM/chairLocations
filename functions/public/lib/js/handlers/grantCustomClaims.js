// Server-side code follows:
// this video says it all: Controlling Data Access Using Firebase Auth Custom Claims (Firecasts) https://www.youtube.com/watch?v=3hj_r_N0qMs
// Bottom line: you can set a user to be a superuser via the code below. You have to call the admin.auth().setCustomUserClaims() function from a firebase function, not from the client. So, I made this function, called it from Postman (after grabbing my googlecredential), and successfully deemed junque135 as a superuser. Then I removed access to this app by "turning off" the route so no one else could use it. If I need to make someone else a superuser, I'll need to "turn on" the route and call it from Postman once more, with the would-be superuser's email address. You can use the saved Postman function call, saved under grantCustomClaims. You just need to get a current google credential (via Google Chrome dev console > network > sniff any call to the chairLoc api and copy and paste the googlecred into the Headers section of grantCustomClaims fetch.) After setting this custom claim on the user, I can restrict data access from within Firebase rules, since the custom claim is available there. Look at the Firebase rules for the chairLoc project to see how it's implemented. And it works!

// eslint-disable-next-line consistent-return
exports.grantCustomClaims = async (req, res, functions, admin) => {
   const theBody = req.body;
   let retMsg = "Return message not set in addCustomClaims handler";

   let email = theBody.email;
   let user = undefined;
   try {
      user = await admin.auth().getUserByEmail(email);
   } catch (err) {
      const msg = `0302 Errored out while trying to get admin.auth().getUserByEmail(email)`;
      console.log(msg);
      res.status(500).json({
         message: `${msg}`,
      });
   }
   if (user.customClaims && user.customClaims.superuser === true) {
      const msg = `0301 ${email} is already a superuser.`;
      console.log(msg);
      res.status(200).json({
         message: `${msg}`,
      });
   }
   try {
      admin.auth().setCustomUserClaims(user.uid, { superuser: true });
      retMsg = `Successfully set [${email}], [${user.uid}], to a superuser.`;
   } catch (err) {
      const msg = `0300 Errored out trying admin.auth().setCustomUserClaims(user.uid, {superuser: true})`;
      console.log(msg);
      res.status(500).json({
         message: `${msg} \n${err}`,
      });
   }
   try {
      await firebaseApp.auth().signOut();
      console.log(`${retMsg}`);
      console.log(`Logged out`);
      res.append("Cache-Control", "no-cache, must-revalidate");
      return res.status(200).json({
         message: `${retMsg}`,
      });
   } catch (err) {
      const firstLine =
         "0195: Couldn't log user out: " + err.message.split("\n")[0];
      const errCode = err.code;
      res.status(500).render("500", { firstLine, errCode });
      console.log(`${firstLine} ${err}`);
   }
};
