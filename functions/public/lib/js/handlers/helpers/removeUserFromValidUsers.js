// server-side code
// remove user from validUserCollection and delete user's collection
exports.removeUserFromValidUsers = async (res, admin, uName) => {
   const aUser = await admin
      .firestore()
      .collection("validUserCollection")
      .doc(uName)
      .get();
   if (aUser.exists) {
      const role = aUser.data().role;
      if (role.localeCompare("admin") !== 0) {
         try {
            await admin
               .firestore()
               .collection("validUserCollection")
               .doc(uName)
               .delete();
         } catch (err) {
            return {
               errCode: 3,
               message: `Error removing user ${uName}: ${err.code}`,
            };
         }
         try {
            await admin
               .firestore()
               .collection(`${uName}@gmail.com`)
               .listDocuments()
               .then(documents => {
                  documents.map(doc => {
                     doc.delete();
                  });
               });
         } catch (err) {
            return {
               errCode: 4,
               message: `Error removing stocks from ${uName}@gmail.com: ${err.code}`,
            };
         }
         try {
            await admin
               .firestore()
               .collection(`mail`)
               .doc(`${uName}@gmail.com`)
               .delete();
         } catch (err) {
            return {
               errCode: 5,
               message: `Error removing mail message from mail collection: ${err.code}`,
            };
         }
         return {
            errCode: 6,
            message: `Removed user: ${uName}`,
         };
      } else {
         return {
            errCode: 2,
            message: `Cannot remove user: ${uName}`,
         };
      }
   } else {
      return {
         errCode: 1,
         message: `${uName} did not exist`,
      };
   }
};
