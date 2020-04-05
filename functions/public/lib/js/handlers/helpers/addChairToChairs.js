// server-side code
// eslint-disable-next-line consistent-return
exports.addChairToChairs = async (res, admin, uChair) => {
   const aChair = await admin
      .firestore()
      .collection("chairs")
      .doc("firstChair")
      .get();
   if (!aChair.exists) {
      try {
         await admin
            .firestore()
            .collection("chairs")
            .doc("firstChair")
            .set(uChair);
      } catch (err) {
         const msg = `Error: ${uChair} couldn't be added to chairs`;
         console.log(msg);
         return {
            errCode: 2,
            message: msg,
         };
      }
   } else {
      const msg = `${uChair} already exists`;
      console.log(msg);
      return {
         errCode: 1,
         message: msg,
      };
   }
};
