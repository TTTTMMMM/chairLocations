// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");
const {
   addUsernameToValidUsers,
} = require("./helpers/addUsernameToValidUsers");

// -------------------------------------------------------
// simply add username to validUserCollection (with a role = user)
// -------------------------------------------------------
exports.addUser = async (req, res, admin) => {
   if (res.locals.loggedInUser.role === "admin") {
      const theUser = req.body;
      let uName = escapeHTML(
         theUser.username
            .trim()
            .substring(0, 49)
            .toLowerCase()
      );
      const validUsernameRegex = /^[a-z0-9._-]{3,50}$/gi;
      let valid_uName = uName.match(validUsernameRegex);
      if (valid_uName != null) {
         const retVal = await addUsernameToValidUsers(res, admin, uName);
         switch (retVal.errCode) {
            case 1:
               console.log(`${retVal.message}`);
               res.status(200).json({
                  message: `${retVal.message}`,
               });
               break;
            case 2:
               console.log(`${retVal.message}`);
               res.status(500).json({
                  message: `${retVal.message}`,
               });
               break;
            case 3:
               console.log(`${retVal.message}`);
               res.status(500).json({
                  message: `${retVal.message}`,
               });
               break;
            case 4:
               console.log(`${retVal.message}`);
               res.status(500).json({
                  message: `${retVal.message}`,
               });
               break;
            default:
               console.log(`${retVal.message}`);
               return res.status(200).json({
                  message: `${retVal.message}`,
               });
         }
      } else {
         return res.status(400).json({
            message: `Invalid username ${theUser.username}`,
         });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress}`,
      });
   }
};
