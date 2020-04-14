1. After you eject, don't forget to copy the .babelrc file into the root of the new project!
2. Don't forget to go to [Google Credentials page](https://console.cloud.google.com/apis/credentials?project=chairlocations) and lock down two API keys:

-  API Keys >Browser key (auto created by Firebase) --> apply API restrictions
-  OAuth 2.0 Client Key --> apply authorized JavaScript Origins

3. Don't forget to [enable Google Authentication in Firebase console](https://console.firebase.google.com/u/0/project/chairlocations/authentication/providers) > Authentication > Sign-in method

4. If you get the following error when trying to subscribe to a collection, test the rules in the database rules playground: **Uncaught Error in onSnapshot: FirebaseError: Missing or insufficient permissions.**

5. [Read this to learn how to style the file input HTML element](https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/)

---

The first step in processing the chair location information is to clean the data. That means eliminating columns (aka, parameters) and rows that aren't desired. Eliminating undesired columns makes the data "skinny," and eliminating undesired rows makes the data "shorter."

Examples of undesired columns are columns that contain no data, or columns that contain the same value for each row, among other examples. Data is ridded of undesired columns before cleansing of undesired rows takes place.

Examples of undesired rows are rows that contain what look like error values in the columns that were kept: (latitude, longitude) values of (-360, -360). Getting to short-and-skinny is required before uploading chair location data to Firebase.

All cleaning efforts are done on the client end, with the server performing only data validation and storing into Firebase collections.

---

The fatChairObj's properties are the cell values from the original file.

console.dir(fatChairObj):

**Object**

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

**Object**

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

The extendedExtendedFat's properties are spread of the fatChairObj + calculated values for the additionalHeaders + the entered values of where the chair is deployed (STATE, BEACH, RENTALAGENT):

REPORTID: "0"

DEVICEID: "31905"

PRODUCTID: "45"

DEVICETYPEID: "14"

ORGID: "1"

IMEI: "1.5058E+13"

...[snip]...

FName: "CHAIR088_2020-03-14_mod.csv"

UploadFBTime: "4/13/2020, 10:35:56 AM"

ID: "9f49abe5a320cedfbbdfc653999cc772b343b744878286b9ca580cfe62480e16"

STATE: "Florida"

BEACH: "Miami Beach"

RENTALAGENT: "SANDHELPER"

**proto**: Object

---

Therefore, the extendedExtendedFatArray[] is an array of the above, each element corresponding to one row of the original input csv file:

console.dir(this.extendedExtendedFatArray);

Array(221)

**[0 … 99]**

**0:**

{REPORTID: "0",

DEVICEID: "31905",

PRODUCTID: "45",

DEVICETYPEID: "14", ORGID: "1", …}

**1:**

{REPORTID: "0",

DEVICEID: "31905",

PRODUCTID: "45",

DEVICETYPEID: "14",

ORGID: "1", …}

2: {REPORTID: "0",

DEVICEID: "31905",

PRODUCTID: "45",

DEVICETYPEID: "14",

ORGID: "1", …}

...[snip]...

**218:**

{REPORTID: "0",

DEVICEID: "31905",

PRODUCTID: "45",

DEVICETYPEID: "14",

ORGID: "1", …}

**219:**

{REPORTID: "0",

DEVICEID: "31905",

PRODUCTID: "45",

DEVICETYPEID: "14",

ORGID: "1", …}

**220:**

{REPORTID: "0",

DEVICEID: "31905",

PRODUCTID: "45",

DEVICETYPEID: "14",

ORGID: "1", …}

**length: 221**

**proto**: Array(0)

**0:**

REPORTID: "0"

DEVICEID: "31905"

PRODUCTID: "45"

DEVICETYPEID: "14"

ORGID: "1"

IMEI: "1.51E+13"

RECEIVEDDATE: "2020-03-11T23:27:42Z"

UPDATETIME: "2020-03-11T23:35:20Z"

MESSAGECODE: "1"

MESSAGEINDEX: "1"

ASSETLABEL: "CHAIR-088"

ISTEST: "FALSE"

...[snip]...

FNAME: "CHAIR088_2020-03-14.csv"

UPLOADFBTIME: "4/13/2020, 12:50:02 PM"

ID: "9f49abe5a320cedfbbdfc653999cc772b343b744878286b9ca580cfe62480e16"

STATE: "Florida"

BEACH: "Miami Beach"

RENTALAGENT: "SANDHELPER"

**proto**: Object

---

The tallAndSkinnyArray[] is the kept Chair Headers (or parameters) applied to the extendedExtendedFatArray[]; i.e., it "skinnifies" the fat array in that it reduces the number of columns kept for eventual uploading to Firebase. i.e., (notice that nothing has been [snipped]):

console.dir(this.tallAndSkinnyArray);

[0 … 99]

**0:**

ASSETLABEL: "CHAIR-088"

BEACH: "Miami Beach"

CELLACCURACY: "908"

DEVICEID: "31905"

DEVICETYPEID: "14"

FNAME: "CHAIR088_2020-03-14.csv"

GPS_MPH: "-2147483648"

ID: "779ccf2e9cae710e8be2985b0a789f71ab44e60ba3663255b9081fc734c6fdf5"

IMEI: "1.51E+13"

LATITUDE: "25.9469009"

LONGITUDE: "-80.142639"

RENTALAGENT: "SANDHELPER"

STATE: "Florida"

UPDATETIME: "2020-03-11T23:35:20Z"

UPLOADFBTIME: "4/13/2020, 3:22:20 PM"

WX_DEWPOINT: "-2048"

WX_WINDSPEED_MPH: ""

**proto**: Object

**1:**

ASSETLABEL: "CHAIR-088"

BEACH: "Miami Beach"

CELLACCURACY: "0"

DEVICEID: "31905"

FNAME: "CHAIR088_2020-03-14.csv"

GPS_MPH: "-2147483648"

ID: "c9aba8c5bd09c33e52899af6b077e2a64a7397a2c3df781d6084a3f22d20a630"

IMEI: "1.51E+13"

LATITUDE: "-360"

LONGITUDE: "-360"

RENTALAGENT: "SANDHELPER"

STATE: "Florida"

UPDATETIME: "2020-03-10T23:35:31Z"

UPLOADFBTIME: "4/13/2020, 7:07:17 PM"

WX_DEWPOINT: "-2048"

WX_WINDSPEED_MPH: ""

**proto**: Object

etc.

Those are all the columns I'm keeping from the original data. The data has been made skinny, but it is still tall. In other words, there are rows that must be purged, i.e., made "short" - the resulting data will be considered transformed from tallAndSkinny[] to shortAndSkinny[] after row reduction is achieved!

---
