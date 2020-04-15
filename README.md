## Reminders When Making the Next Project

1. <span style="font-family: 'Verdana';">After you eject, don't forget to copy the .babelrc file into the root of the new project!
2. <span style="font-family: 'Verdana';">Don't forget to go to [Google Credentials page](https://console.cloud.google.com/apis/credentials?project=chairlocations) and lock down two API keys:

-  <span style="font-family: 'Verdana';">API Keys >Browser key (auto created by Firebase) --> apply API restrictions
-  <span style="font-family: 'Verdana';">OAuth 2.0 Client Key --> apply authorized JavaScript Origins

3. <span style="font-family: 'Verdana';">Don't forget to [enable Google Authentication in Firebase console](https://console.firebase.google.com/u/0/project/chairlocations/authentication/providers) > Authentication > Sign-in method

4. <span style="font-family: 'Verdana';">If you get the following error when trying to subscribe to a collection, test the rules in the database rules playground:</span> <span style="color:red;font-weight:bold">**Uncaught Error in onSnapshot: FirebaseError: Missing or insufficient permissions.**

5. <span style="font-family: 'Verdana';">[Read this to learn how to style the file input HTML element](https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/)

---

## Data Cleaning

<span style="font-family: 'Verdana';">The first step in processing the chair location information is to clean the data. That means eliminating columns (aka, parameters) and rows that aren't desired. Eliminating undesired columns makes the data "skinny," and eliminating undesired rows makes the data "shorter."

<span style="font-family: 'Verdana';">Examples of undesired columns are columns that contain no data, or columns that contain the same value for each row, among other reasons. Data is cleansed of undesired columns before cleansing of undesired rows takes place.

<span style="font-family: 'Verdana';">Examples of undesired rows are rows that contain error values in the columns that were kept (e.g., [latitude, longitude] values of [-360, -360]). Cleansing data of undesired rows is known as making the data "shorter." Getting to short-and-skinny is required before uploading chair location data to Firebase.

<span style="font-family: 'Verdana';">All cleaning efforts are done on the client end, with the server performing only data validation and storing into Firebase collections.

---

### FatChairObject

<span style="font-family: 'Verdana';">The fatChairObj's properties are the cell values from the original file.

`console.dir(fatChairObj):`

**Object**

<span style="font-family: 'Verdana';"><span style="font-family: 'Verdana';">ReportID: "0"

<span style="font-family: 'Verdana';"><span style="font-family: 'Verdana';">DeviceID: "31905"

<span style="font-family: 'Verdana';">ProductID: "45"

<span style="font-family: 'Verdana';">DeviceTypeID: "14"

<span style="font-family: 'Verdana';">OrgID: "1"

<span style="font-family: 'Verdana';"><span style="font-family: 'Verdana';">IMEI: "1.51E+13"

<span style="font-family: 'Verdana';">ReceivedDate: "2020-02-22T14:08:04Z"

<span style="font-family: 'Verdana';">UpdateTime: "2020-02-22T14:04:30Z"

<span style="font-family: 'Verdana';">MessageCode: "6"

<span style="font-family: 'Verdana';">MessageIndex: "2"

<span style="font-family: 'Verdana';">AssetLabel: "CHAIR-088"

<span style="font-family: 'Verdana';">IsTest: "FALSE"

<span style="font-family: 'Verdana';">...snip...

<span style="font-family: 'Verdana';">**proto**: Object

---

### ExtendedFatChairObject

<span style="font-family: 'Verdana';">The extendedFat's properties are spread of the fatChairObj + calculated values for the additionalHeaders.

`console.dir(extendedFat)`

<span style="font-family: 'Verdana';">**Object**

<span style="font-family: 'Verdana';">ReportID: "0"

<span style="font-family: 'Verdana';">DeviceID: "31905"

<span style="font-family: 'Verdana';">ProductID: "45"

<span style="font-family: 'Verdana';">DeviceTypeID: "14"

<span style="font-family: 'Verdana';">OrgID: "1"

<span style="font-family: 'Verdana';">IMEI: "1.51E+13"

<span style="font-family: 'Verdana';">...snip...

<span style="font-family: 'Verdana';">FName: "CHAIR088_2020-03-14.csv"

<span style="font-family: 'Verdana';">UploadFBTime: "4/8/2020, 11:59:46 AM"

<span style="font-family: 'Verdana';">ID: "1f6cdadd498bdac7f2b5aa089c66625a7ef4e768f3b029c1672543067e3f6e93"

<span style="font-family: 'Verdana';">**proto**: Object

---

### extendedExtendedFatChairObject

<span style="font-family: 'Verdana';">The extendedExtendedFat's properties are spread of the fatChairObj + calculated values for the additionalHeaders + the entered values of where the chair is deployed (STATE, BEACH, RENTALAGENT):

<span style="font-family: 'Verdana';">REPORTID: "0"

<span style="font-family: 'Verdana';">DEVICEID: "31905"

<span style="font-family: 'Verdana';">PRODUCTID: "45"

<span style="font-family: 'Verdana';">DEVICETYPEID: "14"

<span style="font-family: 'Verdana';"><span style="font-family: 'Verdana';">ORGID: "1"

<span style="font-family: 'Verdana';">IMEI: "1.5058E+13"

.<span style="font-family: 'Verdana';">..[snip]...

<span style="font-family: 'Verdana';">FName: "CHAIR088_2020-03-14_mod.csv"

<span style="font-family: 'Verdana';">UploadFBTime: "4/13/2020, 10:35:56 AM"

<span style="font-family: 'Verdana';">ID: "9f49abe5a320cedfbbdfc653999cc772b343b744878286b9ca580cfe62480e16"

<span style="font-family: 'Verdana';">STATE: "Florida"

<span style="font-family: 'Verdana';">BEACH: "Miami Beach"

<span style="font-family: 'Verdana';">RENTALAGENT: "SANDHELPER"

<span style="font-family: 'Verdana';">**proto**: Object

---

### Extended Fat Chair Object Array

<span style="font-family: 'Verdana';">Therefore, the extendedExtendedFatArray[] is an array of the above, each element corresponding to one row of the original input csv file:

`console.dir(this.extendedExtendedFatArray);`

<span style="font-family: 'Verdana';">Array(221)

<span style="font-family: 'Verdana';">**[0 … 99]**

<span style="font-family: 'Verdana';">**0:**

<span style="font-family: 'Verdana';">{REPORTID: "0",

<span style="font-family: 'Verdana';">DEVICEID: "31905",

<span style="font-family: 'Verdana';">PRODUCTID: "45",

<span style="font-family: 'Verdana';">DEVICETYPEID: "14",

<span style="font-family: 'Verdana';">ORGID: "1", …}

<span style="font-family: 'Verdana';">**1:**

<span style="font-family: 'Verdana';">{REPORTID: "0",

<span style="font-family: 'Verdana';">DEVICEID: "31905",

<span style="font-family: 'Verdana';">PRODUCTID: "45",

<span style="font-family: 'Verdana';">DEVICETYPEID: "14",

<span style="font-family: 'Verdana';">ORGID: "1", …}

<span style="font-family: 'Verdana';">2: {REPORTID: "0",

<span style="font-family: 'Verdana';">DEVICEID: "31905",

<span style="font-family: 'Verdana';">PRODUCTID: "45",

<span style="font-family: 'Verdana';">DEVICETYPEID: "14",

<span style="font-family: 'Verdana';">ORGID: "1", …}

<span style="font-family: 'Verdana';">...[snip]...

<span style="font-family: 'Verdana';">**218:**

<span style="font-family: 'Verdana';">{REPORTID: "0",

<span style="font-family: 'Verdana';">DEVICEID: "31905",

<span style="font-family: 'Verdana';">PRODUCTID: "45",

<span style="font-family: 'Verdana';">DEVICETYPEID: "14",

<span style="font-family: 'Verdana';">ORGID: "1", …}

<span style="font-family: 'Verdana';">**219:**

<span style="font-family: 'Verdana';">{REPORTID: "0",

<span style="font-family: 'Verdana';">DEVICEID: "31905",

<span style="font-family: 'Verdana';">PRODUCTID: "45",

<span style="font-family: 'Verdana';">DEVICETYPEID: "14",

<span style="font-family: 'Verdana';">ORGID: "1", …}

<span style="font-family: 'Verdana';">**220:**

<span style="font-family: 'Verdana';">{REPORTID: "0",

<span style="font-family: 'Verdana';">DEVICEID: "31905",

<span style="font-family: 'Verdana';">PRODUCTID: "45",

<span style="font-family: 'Verdana';">DEVICETYPEID: "14",

<span style="font-family: 'Verdana';">ORGID: "1", …}

<span style="font-family: 'Verdana';">**length: 221**

<span style="font-family: 'Verdana';">**proto**: Array(0)

<span style="font-family: 'Verdana';">**0:**

<span style="font-family: 'Verdana';">REPORTID: "0"

<span style="font-family: 'Verdana';">DEVICEID: "31905"

<span style="font-family: 'Verdana';">PRODUCTID: "45"

<span style="font-family: 'Verdana';">DEVICETYPEID: "14"

<span style="font-family: 'Verdana';">ORGID: "1"

<span style="font-family: 'Verdana';">IMEI: "1.51E+13"

<span style="font-family: 'Verdana';">RECEIVEDDATE: "2020-03-11T23:27:42Z"

<span style="font-family: 'Verdana';">UPDATETIME: "2020-03-11T23:35:20Z"

<span style="font-family: 'Verdana';">MESSAGECODE: "1"

<span style="font-family: 'Verdana';">MESSAGEINDEX: "1"

<span style="font-family: 'Verdana';">ASSETLABEL: "CHAIR-088"

<span style="font-family: 'Verdana';">ISTEST: "FALSE"

<span style="font-family: 'Verdana';">...[snip]...

<span style="font-family: 'Verdana';">FNAME: "CHAIR088_2020-03-14.csv"

<span style="font-family: 'Verdana';">UPLOADFBTIME: "4/13/2020, 12:50:02 PM"

<span style="font-family: 'Verdana';">ID: "9f49abe5a320cedfbbdfc653999cc772b343b744878286b9ca580cfe62480e16"

<span style="font-family: 'Verdana';">STATE: "Florida"

<span style="font-family: 'Verdana';">BEACH: "Miami Beach"

<span style="font-family: 'Verdana';">RENTALAGENT: "SANDHELPER"

<span style="font-family: 'Verdana';">**proto**: Object

---

### Tall and Skinny Array

<span style="font-family: 'Verdana';">The tallAndSkinnyArray[] is the kept Chair Headers (or parameters) applied to the extendedExtendedFatArray[]; i.e., it "skinnifies" the fat array in that it reduces the number of columns kept for eventual uploading to Firebase. (Notice that no headers have been snipped in each object below, in contrast to the snipping I had to do to every (fat) object logged above.):

`console.dir(this.tallAndSkinnyArray);`

**_[0 … 99]_**

<span style="font-family: 'Verdana';">**0:**

<span style="font-family: 'Verdana';">ASSETLABEL: "CHAIR-088"

<span style="font-family: 'Verdana';">BEACH: "Miami Beach"

<span style="font-family: 'Verdana';">CELLACCURACY: "908"

<span style="font-family: 'Verdana';">DEVICEID: "31905"

<span style="font-family: 'Verdana';">DEVICETYPEID: "14"

<span style="font-family: 'Verdana';">FNAME: "CHAIR088_2020-03-14.csv"

<span style="font-family: 'Verdana';">GPS_MPH: "-2147483648"

<span style="font-family: 'Verdana';">ID: "779ccf2e9cae710e8be2985b0a789f71ab44e60ba3663255b9081fc734c6fdf5"

<span style="font-family: 'Verdana';">IMEI: "1.51E+13"

<span style="font-family: 'Verdana';">LATITUDE: "25.9469009"

<span style="font-family: 'Verdana';">LONGITUDE: "-80.142639"

<span style="font-family: 'Verdana';">RENTALAGENT: "SANDHELPER"

<span style="font-family: 'Verdana';">STATE: "Florida"

<span style="font-family: 'Verdana';">UPDATETIME: "2020-03-11T23:35:20Z"

<span style="font-family: 'Verdana';">UPLOADFBTIME: "4/13/2020, 3:22:20 PM"

<span style="font-family: 'Verdana';">WX_DEWPOINT: "-2048"

<span style="font-family: 'Verdana';">WX_WINDSPEED_MPH: ""

<span style="font-family: 'Verdana';">**proto**: Object

<span style="font-family: 'Verdana';">**1:**

<span style="font-family: 'Verdana';">ASSETLABEL: "CHAIR-088"

<span style="font-family: 'Verdana';">BEACH: "Miami Beach"

<span style="font-family: 'Verdana';">CELLACCURACY: "0"

<span style="font-family: 'Verdana';">DEVICEID: "31905"

<span style="font-family: 'Verdana';">FNAME: "CHAIR088_2020-03-14.csv"

<span style="font-family: 'Verdana';">GPS_MPH: "-2147483648"

<span style="font-family: 'Verdana';">ID: "c9aba8c5bd09c33e52899af6b077e2a64a7397a2c3df781d6084a3f22d20a630"

<span style="font-family: 'Verdana';">IMEI: "1.51E+13"

<span style="font-family: 'Verdana';">LATITUDE: "-360"

<span style="font-family: 'Verdana';">LONGITUDE: "-360"

<span style="font-family: 'Verdana';">RENTALAGENT: "SANDHELPER"

<span style="font-family: 'Verdana';">STATE: "Florida"

<span style="font-family: 'Verdana';">UPDATETIME: "2020-03-10T23:35:31Z"

<span style="font-family: 'Verdana';">UPLOADFBTIME: "4/13/2020, 7:07:17 PM"

<span style="font-family: 'Verdana';">WX_DEWPOINT: "-2048"

<span style="font-family: 'Verdana';">WX_WINDSPEED_MPH: ""

<span style="font-family: 'Verdana';">**proto**: Object

<span style="font-family: 'Verdana';">etc.

<span style="font-family: 'Verdana';">Those are all the columns I'm keeping from the original data. The data has been made skinny, but it is still tall. In other words, there are rows that must be purged, i.e., made "short" - the resulting data will be considered transformed from tallAndSkinny[] to shortAndSkinny[] after row reduction is achieved!

---

### Short and Skinny Array

<span style="font-family: 'Verdana';">The shortAndSkinnyArray[] is the tallAndSkinny[] minus a few rows that are cleansed (e.g., LATITUTE = "-360"). This reduces the number of objects loaded in Firebase. shortAndSkinny[] is uploaded to Firebase.

<span style="font-family: 'Verdana';"><span style="font-family: 'Verdana';">66 properties

**Array(221)** <-- Number of objects in tallAndSkinny[]

**0:**

<span style="font-family: 'Verdana';">ASSETLABEL: "CHAIR-088"

<span style="font-family: 'Verdana';">BEACH: "Miami Beach"

<span style="font-family: 'Verdana';">CELLACCURACY: undefined

<span style="font-family: 'Verdana';">DEVICEID: "31905"

<span style="font-family: 'Verdana';">FNAME: "CHAIR088_2020-03-14_mod.csv"

<span style="font-family: 'Verdana';">GPS_MPH: undefined

<span style="font-family: 'Verdana';">ID: "779ccf2e9cae710e8be2985b0a789f71ab44e60ba3663255b9081fc734c6fdf5"

<span style="font-family: 'Verdana';">IMEI: "1.5058E+13"

<span style="font-family: 'Verdana';">LATITUDE: "25.9469009"

<span style="font-family: 'Verdana';">LONGITUDE: "-80.142639"

<span style="font-family: 'Verdana';">RENTALAGENT: "SANDHELPER"

<span style="font-family: 'Verdana';">STATE: "Florida"

<span style="font-family: 'Verdana';">UPDATETIME: "2020-03-11T23:35:20Z"

<span style="font-family: 'Verdana';">UPLOADFBTIME: "2020-04-15T04:20:23"

<span style="font-family: 'Verdana';">WX_DEWPOINT: undefined

<span style="font-family: 'Verdana';">WX_WINDSPEED_MPH: undefined

<span style="font-family: 'Verdana';">**proto**: Object

<span style="font-family: 'Verdana';">1: {ASSETLABEL: "CHAIR-088", BEACH: "Miami Beach", CELLACCURACY: undefined, DEVICEID: "31905", FNAME: "CHAIR088_2020-03-14_mod.csv", …}

**length: 2**

**proto**: Array(0)

**Array(181)** <-- number of objects in shortAndSkinnyArray[]

**0:**

<span style="font-family: 'Verdana';">ASSETLABEL: "CHAIR-088"

<span style="font-family: 'Verdana';">BEACH: "Miami Beach"

<span style="font-family: 'Verdana';">CELLACCURACY: undefined

<span style="font-family: 'Verdana';">DEVICEID: "31905"

<span style="font-family: 'Verdana';">FNAME: "CHAIR088_2020-03-14_mod.csv"

<span style="font-family: 'Verdana';">GPS_MPH: undefined

<span style="font-family: 'Verdana';">ID:"779ccf2e9cae710e8be2985b0a789f71ab44e60ba3663255b9081fc734c6fdf5"

<span style="font-family: 'Verdana';">IMEI: "1.5058E+13"

<span style="font-family: 'Verdana';">LATITUDE: "25.9469009"

<span style="font-family: 'Verdana';">LONGITUDE: "-80.142639"

<span style="font-family: 'Verdana';">RENTALAGENT: "SANDHELPER"

<span style="font-family: 'Verdana';">STATE: "Florida"

<span style="font-family: 'Verdana';">UPDATETIME: "2020-03-11T23:35:20Z"

<span style="font-family: 'Verdana';">UPLOADFBTIME: "2020-04-15T04:20:23"

<span style="font-family: 'Verdana';">WX_DEWPOINT: undefined

<span style="font-family: 'Verdana';">WX_WINDSPEED_MPH: undefined

<span style="font-family: 'Verdana';">**proto**: Object

<span style="font-family: 'Verdana';">length: 1

<span style="font-family: 'Verdana';">**proto**: Array(0)

---

## Rough Calculations on Size of ChairLoc Database

**Exemplar ChairLoc Record:**

<span style="font-family: 'Verdana';">ASSETLABEL: "CHAIR-088"

<span style="font-family: 'Verdana';">BEACH: "Ocean City, MD"

<span style="font-family: 'Verdana';">CELLACCURACY: "0"

<span style="font-family: 'Verdana';">DEVICEID: "31905"

<span style="font-family: 'Verdana';">FNAME: "CHAIR088_2020-03-14.csv"

<span style="font-family: 'Verdana';">GPS_MPH: "1"

<span style="font-family: 'Verdana';">ID: "96114d41daf8f7865035e8070fd1fb5291a25007e3b3464140077c34c176c91c"

<span style="font-family: 'Verdana';">IMEI: "1.51E+13"

<span style="font-family: 'Verdana';">LATITUDE: "25.79552"

<span style="font-family: 'Verdana';">LONGITUDE: "-80.1258"

<span style="font-family: 'Verdana';">RENTALAGENT: "SANDHELPER"

<span style="font-family: 'Verdana';">STATE: "Maryland"

<span style="font-family: 'Verdana';">UPDATETIME: "2020-02-11T17:21:53Z"

<span style="font-family: 'Verdana';">UPLOADFBTIME: "2020-04-15T14:01:49.064Z"

### Assumptions

1. Keeping 14 parameters
2. Average length of each parameter is 20 characters
3. Number of records per chair per year is 1000
4. Number of chairs being tracked is 100

Given those assumptions, the number of bytes per year of growth to the chairLoc database can be calculated as:

`numBytes = 14 * 20 * 1000 * 1000 = 280000000 = 280MB/year`
