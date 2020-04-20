// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");
const {
   addUsernameToValidUsers,
} = require("./helpers/addUsernameToValidUsers");

// ----------------------------------------------------------------
// add username, role, and access privileges to validUserCollection
// ----------------------------------------------------------------
exports.addUser = async (req, res, admin, functions) => {
   if (res.locals.loggedInUser.role === "admin") {
      const theUser = req.body;
      let uName = escapeHTML(
         theUser.username.trim().substring(0, 49).toLowerCase()
      );
      const validUsernameRegex = /^[a-z0-9._-]{3,50}$/gi;
      let valid_uName = uName.match(validUsernameRegex);
      let canAccessObj = theUser.canAccess;
      if (typeof canAccessObj === "undefined") {
         valid_uName = null;
      }
      let theRole = theUser.role;
      if (theRole.toLowerCase().localeCompare("admin") === 0) {
         theRole = "maintenance";
         canAccessObj = { canAccess: { maintenance: true } };
      }
      if (valid_uName != null) {
         const retVal = await addUsernameToValidUsers(
            res,
            admin,
            functions,
            uName,
            canAccessObj,
            theRole
         );
         switch (retVal.errCode) {
            case 1:
               console.log(`${retVal.message}`);
               res.status(200).json({
                  message: `${retVal.message}`,
               });
               break;
            case 2:
               console.log(`${retVal.message}`);
               firstLine = `0893: ${retVal.message}`;
               errCode = 2;
               res.status(400).render("400", { firstLine, errCode });
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
         firstLine = `0894: Invalid username ${theUser.username} or access properties [${canAccessObj}]`;
         errCode = 0894;
         return res.status(400).render("400", { firstLine, errCode });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
