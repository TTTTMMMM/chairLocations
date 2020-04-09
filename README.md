-- After you eject, don't forget to copy the .babelrc file into the root of the new project!
-- Don't forget to go to Google Credentials page and lock down two API keys:
---- API Keys >Browser key (auto created by Firebase) --> apply API restrictions
---- OAuth 2.0 Client Key --> apply authorized JavaScript Origins
https://console.cloud.google.com/apis/credentials?project=chairlocations
-- Don't forget to enable Google Authentication in Firebase console > Authentication > Sign-in method
https://console.firebase.google.com/u/0/project/chairlocations/authentication/providers
-- If you get the following error when trying to subscribe to a collection, test the rules in the database rules playground.
Uncaught Error in onSnapshot: FirebaseError: Missing or insufficient permissions.

// https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties

---

The fatChairObj's properties are the cell values from the original file.
console.dir(fatChairObj):
Object
ReportID: "0"
DeviceID: "31905"
ProductID: "45"
DeviceTypeID: "14"
OrgID: "1"
IMEI: "1.51E+13"
ReceivedDate: "2020-02-22T14:08:04Z"
UpdateTime: "2020-02-22T14:04:30Z"
MessageCode: "6"
MessageIndex: "2"
AssetLabel: "CHAIR-088"
IsTest: "FALSE"
...snip...
**proto**: Object

---

The extendedFat's properties are spread of the fatChairObj + calculated values for the additionalHeaders.
console.dir(extendedFat):
Object
ReportID: "0"
DeviceID: "31905"
ProductID: "45"
DeviceTypeID: "14"
OrgID: "1"
IMEI: "1.51E+13"
...snip...
FName: "CHAIR088_2020-03-14.csv"
UploadFBTime: "4/8/2020, 11:59:46 AM"
ID: "1f6cdadd498bdac7f2b5aa089c66625a7ef4e768f3b029c1672543067e3f6e93"
**proto**: Object

---
