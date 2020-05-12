// Server-side code follows:

const firebase = require("firebase");

exports.signInToFirebase = (req, res, next) => {
   if (!firebase.auth().currentUser) {
      const fbCred = firebase.auth.GoogleAuthProvider.credential(
         req.headers.googlecredential
      );
      firebase
         .auth()
         .signInWithCredential(fbCred)
         .then(() => {
            // console.log(`Logged into firebase`);
            next();
            return null;
         })
         .catch((err) => {
            const firstLine =
               "0198: Invalid firebase credential error: " +
               err.message.split("\n")[0];
            const errCode = err.code;
            res.status(500).render("500", { firstLine, errCode });
            console.log(`${firstLine} error<${err}>`);
         });
   }
};
