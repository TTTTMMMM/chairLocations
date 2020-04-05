// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");
const { addChairToChairs } = require("./helpers/addChairToChairs");

// eslint-disable-next-line consistent-return
exports.addChair = async (req, res, admin) => {
   let theReqKeys = Object.keys(req);
   // console.log("------ JSON.stringify(req.body) -----");
   // console.log(JSON.stringify(req.body));
   // console.log("............ util.inspect(form) ..........");
   // console.log(util.inspect(form));
   console.log("===============");
   console.log("______________");
   console.log(req.headers);
   console.log("..............");
   // ------------------------------------------------------
   // const theChair = req.body;
   // console.log(theChair);
   // let uChair = escapeHTML(theChair.trim().substring(0, 100000).toLowerCase());
   // const validChairRegex = /^[ a-z0-9._-]$/gi;
   // let valid_uChair = uChair.match(validChairRegex);
   // if (valid_uChair !== null) {
   //    const retVal = await addChairToChairs(res, admin, uChair);
   //    switch (retVal.errCode) {
   //       case 1:
   //          console.log(`${retVal.message}`);
   //          res.status(200).json({
   //             message: `${retVal.message}`,
   //          });
   //          break;
   //       case 2:
   //          console.log(`${retVal.message}`);
   //          res.status(500).json({
   //             message: `${retVal.message}`,
   //          });
   //          break;
   //       case 3:
   //          console.log(`${retVal.message}`);
   //          res.status(500).json({
   //             message: `${retVal.message}`,
   //          });
   //          break;
   //       case 4:
   //          console.log(`${retVal.message}`);
   //          res.status(500).json({
   //             message: `${retVal.message}`,
   //          });
   //          break;
   //       default:
   //          console.log(`${retVal.message}`);
   //          return res.status(200).json({
   //             message: `${retVal.message}`,
   //          });
   //    }
   // } else {
   //    return res.status(400).json({
   //       message: `Invalid chair ${uChair}`,
   //    });
   // }
};
