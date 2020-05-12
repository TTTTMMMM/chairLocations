// Server-side code follows:

const { OAuth2Client } = require("google-auth-library");
const clientID = require("../configs/clientID");
const aud = require("../configs/audience");
const { testTicket } = require("./testTicket");

exports.verifyGoogleToken = (req, res, admin, next) => {
   const client = new OAuth2Client(clientID);
   const requestToken = req.headers.googlecredential;
   const errCode = `https://oauth2.googleapis.com/tokeninfo?id_token=${requestToken}`;
   let firstLine = "";
   client
      .verifyIdToken({
         idToken: requestToken,
         audience: aud,
      })
      // eslint-disable-next-line promise/always-return
      .then((ticket) => {
         // eslint-disable-next-line promise/no-nesting
         testTicket(ticket, requestToken, admin)
            .then((result) => {
               switch (result.errCode) {
                  case 1:
                     firstLine = "0098: Token Audience Error";
                     res.status(500).render("500", { firstLine, errCode });
                     console.log(`<${firstLine}><${errCode}>`);
                     break;
                  case 2:
                     firstLine = "0097: Token Issuer Error";
                     res.status(500).render("500", { firstLine, errCode });
                     console.log(`<${firstLine}><${errCode}>`);
                     break;
                  case 3:
                     firstLine = "0096: Token Expiration Error";
                     res.status(500).render("500", { firstLine, errCode });
                     console.log(`<${firstLine}><${errCode}>`);
                     break;
                  case 4:
                     firstLine = "0095: Non-authorized user error";
                     res.status(401).render("401", { firstLine, errCode });
                     console.log(`<${firstLine}><${errCode}>`);
                     break;
                  case 5:
                     firstLine = "0094: Error logging into firebase";
                     res.status(500).render("500", { firstLine, errCode });
                     console.log(`<${firstLine}><${errCode}>`);
                     break;
                  case 6:
                     firstLine = "0093: Invalid firebase credential error";
                     res.status(500).render("500", { firstLine, errCode });
                     console.log(`<${firstLine}><${errCode}>`);
                     break;
                  case 7:
                     firstLine =
                        "0092: Problem trying to set customClaims on Firebase token";
                     res.status(500).render("500", { firstLine, errCode });
                     console.log(`<${firstLine}><${errCode}>`);
                     break;
                  default:
                     res.locals.loggedInUser = {
                        name: result.collectionName,
                        emailAddress: result.emailAddress,
                        role: result.role,
                        canAccess: result.accObj,
                        date: new Date(),
                     };
                     // eslint-disable-next-line callback-return
                     next();
               }
               return null;
            })
            .catch((error) => console.log(`testTicket error<${error}>`));
      })
      .catch(() => {
         firstLine = "0099: Could not verify authenticity of ID Token.";
         res.status(500).render("500", { firstLine, errCode });
         console.log(`<${firstLine}><${errCode}>`);
      });
};
