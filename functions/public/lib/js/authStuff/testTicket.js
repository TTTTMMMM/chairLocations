// Reference:
// https://developers.google.com/identity/sign-in/web/backend-auth
// Server-side code follows

const approvedAudience = require("../configs/audience");
var util = require("util");
const firebase = require("firebase");

const { signInToFirebase } = require("./signInToFirebase");

exports.testTicket = async (ticket, requestToken) => {
   const payload = ticket.getPayload();
   const userid = payload["sub"];
   const issuer = payload["iss"];
   const email = payload["email"];
   const audience = payload["aud"];
   const expiration = payload["exp"];
   let retRes = { errCode: 0, collectionName: "", emailAddress: "", role: "" };

   console.log(`${email}`);
   if (audience.localeCompare(approvedAudience) !== 0) {
      retRes.errCode = 1;
      return retRes;
   }
   if (
      !(
         issuer.localeCompare("https://accounts.google.com") === 0 ||
         issuer.localeCompare("accounts.google.com") === 0
      )
   ) {
      retRes.errCode = 2;
      return retRes;
   }
   if (expiration > Date.now()) {
      retRes.errCode = 3;
      return retRes;
   }
   const authUser = await firebaseApp
      .firestore()
      .collection("validUserCollection")
      .doc(`${email.split("@")[0]}`)
      .get();
   if (authUser.exists) {
      try {
         fbCred = firebase.auth.GoogleAuthProvider.credential(requestToken);
      } catch (error) {
         console.log("0066: Problem with firebase credential");
         retRes.errCode = 6;
         return retRes;
      }
      try {
         const w1w1 = await firebase.auth().signInWithCredential(fbCred);
         retRes.errCode = 7;
         retRes.collectionName = `${email.split("@")[0]}`;
         retRes.emailAddress = email;
         retRes.role = authUser.data().role;
         return retRes;
      } catch (err) {
         retRes.errCode = 5;
         return retRes;
      }
   } else {
      // not on the user whitelist of this web app
      firebaseApp.auth().signOut();
      console.log("Logged out.");
      retRes.errCode = 4;
      return retRes;
   }
};