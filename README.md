### Reminders When Making the Next Project

1. <span style="font-family: 'Verdana';">After you eject, don't forget to copy the .babelrc file into the root of the new project!
2. <span style="font-family: 'Verdana';">Don't forget to go to [Google Credentials page](https://console.cloud.google.com/apis/credentials?project=chairlocations) and lock down two API keys:

-  <span style="font-family: 'Verdana';">API Keys >Browser key (auto created by Firebase) --> apply API restrictions
-  <span style="font-family: 'Verdana';">OAuth 2.0 Client Key --> apply authorized JavaScript Origins

3. <span style="font-family: 'Verdana';">Don't forget to [enable Google Authentication in Firebase console](https://console.firebase.google.com/u/0/project/chairlocations/authentication/providers) > Authentication > Sign-in method

4. Don't forget to set a [budget for the new project](https://console.cloud.google.com/billing/010DEE-F97F9C-CA8E1F/budgets). Budgets don't cap usage, only alert you to possible overruns.

5. To cap usage, visit this [page](https://console.cloud.google.com/apis/api/cloudfunctions.googleapis.com/quotas?folder=&organizationId=&project=chairlocations&supportedpurview=project&duration=P30D).

6. <span style="font-family: 'Verdana';">If you get the following error when trying to subscribe to a collection, test the rules in the database rules playground:</span> <span style="color:red;font-weight:bold">**Uncaught Error in onSnapshot: FirebaseError: Missing or insufficient permissions.**

---

### Data Cleaning

<span style="font-family: 'Verdana';">The first step in processing the chair location information is to clean the data. That means eliminating columns (also known as, table headers or parameters or fields). There are also undesired rows (also known as objects or documents) that must be eliminated in the cleansing process. Eliminating undesired columns makes the data "skinny," and eliminating undesired rows makes the data "shorter."

<span style="font-family: 'Verdana';">Examples of undesired columns are columns that contain no data, or columns that contain the same value for each row, among other reasons. Data is cleansed of undesired columns before cleansing of undesired rows takes place.

<span style="font-family: 'Verdana';">Examples of undesired rows are rows that contain error values in the columns that were kept (e.g., [latitude, longitude] values of [-360, -360]). Cleansing data of undesired rows is known as making the data "shorter." Getting to short-and-skinny is required before uploading chair location data to Firebase.

<span style="font-family: 'Verdana';">All cleaning efforts are done on the client end, with the server performing only data validation and storing into Firebase collections.

---

### FatChairObject

<span style="font-family: 'Verdana';">Each row in the original comma separated values (csv) file becomes a "fat chair object" (fatChairOBj). If a csv file contains 200 rows of data, then 200 fatChairObjs will be created. The fatChairObj's properties or fields are derived from the values in the original csv file. In the case we look at below, the csv file had ~65 columns or table headers/properties/fields and 221 rows. Each of the columns becomes a property or field _name_ in the object. The object, because it contains ~65 fields, the values for which many are undefined or meaningless for our purposes in the original csv file, is known as being "fat." The goal of cleansing is to make this fatChair object "skinny," meaning that irrelevant properties or fields are eliminated before we upload the object or "document" to the Firebase cloud.

| `console.dir(fatChairObj)`           | `console.dir(extendedFat)`                   |
| ------------------------------------ | -------------------------------------------- |
| ![](/markdownImages/fatChairObj.png) | ![](/markdownImages/extendedFatChairObj.png) |

---

### ExtendedFatChairObject

<span style="font-family: 'Verdana';">The extendedFat's properties consist of all the properties of the fatChairObj + calculated values for the additional headers. The additional header properties or fields, at this time, consist of the file name from which this object or document originates, the approximate time of the upload to Firebase, and a unique identifier of this object or document -- noted in the yellow box below.

---

### extendedExtendedFatChairObject

<span style="font-family: 'Verdana';">The extendedExtendedFat's (eEFO) properties consist of all the properties of the fatChairObj + calculated values for the additionalHeaders + the user-entered values for where the chair is deployed (STATE, BEACH, RENTALAGENT):

```
         this.extendedFatArray.forEach((x) => {
            let eEFO = { ...x, ...objectFromPopoverContents };
            console.dir(eEFO);
            this.extendedExtendedFatArray.push(eEFO);
         });
         console.log(`extendedExtendedFatArray below:`);
         console.dir(this.extendedExtendedFatArray);
```

| `console.dir(eEFO)`           | `console.dir(this.extendedExtendedFatArray)` |
| ----------------------------- | -------------------------------------------- |
| ![](/markdownImages/eEFO.png) | ![](/markdownImages/eEFOArray.png)           |

---

### Extended Fat Chair Object Array

<span style="font-family: 'Verdana';">Therefore, the extendedExtendedFatArray[] is an array of the extendedExtendedFatChairObjects, each element corresponding to one row of the original input csv file:

---

### Skinny Object & Tall and Skinny Array

<span style="font-family: 'Verdana';">Each extendedExtended fat chair object is "skinnified." The "skinny" object contains the reduced set of properties need for our purposes. The reduced set is selectable by the user, as long as pre-determined, mandatory properties are maintained. The tallAndSkinnyArray[] is the collection of all the skinny objects. At this point of the processing, each element in the array represents one row from the original file, with all the irrelevant properties or fields eliminated.

```
    this.extendedExtendedFatArray.forEach((row) => {
        let skinnyObj: any = {};
        Object.keys(skinnyObjTemplate).forEach((property) => {
            skinnyObj[property] = row[property];
        });
        console.log(`skinnyObj below:`);
        console.dir(skinnyObj);
        this.tallAndSkinnyArray.push(skinnyObj);
    });
```

| `console.dir(skinnyObj)`              | `console.dir(this.tallAndSkinnyArray)`      |
| ------------------------------------- | ------------------------------------------- |
| ![](/markdownImages/skinnyObject.png) | ![](/markdownImages/tallAndSkinnyArray.png) |

<span style="font-family: 'Verdana';">The data has been made skinny, but it is still tall. In other words, there are rows that must be purged, thus making the array "shorter." The resulting array will be considered transformed from tallAndSkinny[] to shortAndSkinny[] after row reduction is achieved. From looking at the original file, it's plain to see that GPS readings that contain lat/long values of (-360, -360) are either meaningless or in error. Those rows are eliminated before being uploaded to Firebase. Other rows that are removed are rows where ASSETLABEL, UPDATETIME, LATITUDE or LONGITUDE are undefined.

---

### Short and Skinny Array

<span style="font-family: 'Verdana';">The shortAndSkinnyArray[] is the tallAndSkinny[] minus a few rows that are cleansed, such as documents that have LATITUTE = "-360". This reduces the number of documents loaded into Firebase. shortAndSkinny[] is uploaded to Firebase. In the example we've been working with, the number of rows (called "documents" in Firebase parlance) has been reduced from 221 to 181.

`console.dir(this.shortAndSkinnyArray);`

![](/markdownImages/shortAndSkinnyArray.png)

---

### Rough Calculations on Size and Cost of ChairLoc Database

**<ins>Exemplar ChairLoc Document:</ins>**

![](/markdownImages/exampleDocument.png)

### Assumptions

1. Length of document ID (each document's ID is a SHA1 hash truncated to 10 characters)
2. Keeping 14 document fields
3. Average length of field name is 8 characters
4. Average length of value of each field is 20 characters
5. Number of documents per chair per year is 1000
6. Number of chairs being tracked is 100
7. [Firebase Cost Structure](https://firebase.google.com/docs/firestore/pricing)

| Cost           | # documents     | Caveats         |
| -------------- | --------------- | --------------- |
| 6 cents        | 100,000 reads   |                 |
| 18 cents       | 100,000 writes  |                 |
| 2 cents        | 100,000 deletes |                 |
| 18 cents       | GB per month    | first 1GB free  |
| network egress |                 | first 10GB free |

Cloud Firestore operations, storage, and network bandwidth are all considered billable usage. The cost esimate below does not factor in network bandwidth.

Given those assumptions, the number of bytes uploaded and stored per year of operation to the chairLoc database can be calculated as:

```
numBytes = (10 + (14 * (8+20))) * 1000 * 100 = 40,200,000 = 43.2MB/year

Storage Costs: .0402GB * 18 cents/GB/month * 12months ~ 10 cents/yr

Writing Costs: 40.2MB = 40200000/100000 * 18 cents ~ $72.36 once

Reading Costs: 40.2MB = 40200000/100000 * 6 cents * 5 reads ~ $120.60
```

Costs appear to be dominated by reads/writes, so estimate $72 + $120 = **\$193** per year, since storage and network egress costs are negligible.

This estimate may be high. See [this example](https://firebase.google.com/docs/firestore/billing-example) for better estimate, which includes free monthly quotas factored in.

---

### Snapshot of Usage of ChairLoc Project on 4/15/2020

[ChairLoc Usage as Shown on GCP](https://console.cloud.google.com/appengine/quotadetails?project=chairlocations&folder&organizationId), with explanation of pricing explained in [this video](https://www.youtube.com/watch?v=6NegFl9p_sE&list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ&index=3_). Three rows of importance for estimating "operations" usage are _Cloud Firestore Read Operations_, _Cloud Firestore Entity Writes_, and _Cloud Firestore Entity Deletes_. To estimate storage, look at the row _Cloud Firestore Stored Data_.

![](/markdownImages/oneDayUsage.png)

![](/markdownImages/anotherDayUsage.png)

[ChairLoc usage shown on Firebase Console](https://console.firebase.google.com/project/chairlocations/usage).

![](/markdownImages/chairLocsUsage.png)

![](/markdownImages/chairLocsUsage_20200506.png)

---

For the following Compound Query (which is used to create a listener for a specific chair uploaded today to Firebase):

```
    const beginningOfDay = new Date(
            new Date().toISOString().substr(0, 10)
        ).toISOString();
    this.assetLabelSpecific = firebase
        .firestore()
        .collection("chairLocs")
        .where("ASSETLABEL", "==", this.props.query.ASSETLABEL)
        .where("UPLOADFBTIME", ">", beginningOfDay);
    this.unsubscribe = this.assetLabelSpecific.onSnapshot(
        this.onCollectionUpdate
    );
```

Firebase needed to create the following "composite index." When the listener above failed the first time I ran it, the developer-friendly error pointed me to a URL where I instructed Firebase to create this "composite index," which is not automatically created by Firebase, unlike a single-field index, which is automatically created by Firebase on every field in a document. (An index is a sorted list of -- usually one field -- fields that makes querying fast.):

![](/markdownImages/indexForQuery.png)

BTWs: If you use composite indexes, [this tutorial](https://www.youtube.com/watch?v=Ofux_4c94FI&list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ&index=2) should be consulted for best practices and limitations.

---

### Example Rules written for Data Validation:

I'm fairly certain these rules only apply to operations coming in from the client via the firebase software development kit, not for operations originating from functions code (server). I've tried violating the data validation rules, such as setting the ID.size() <=9 and sending in my ID of length 10, and nary a peep was uttered by the Firebase rule engine, and the new data was written to the chairLoc connection. I'll update this assertion, when I've verified it.

![](/markdownImages/dataValidationRules.png)

---

### Role-based Security for ChairLocs

**Big Caveat right up front:** _Firebase rules_ only apply to operations originating from the firebase SDK, not operations originating from functions (API handlers on the server.)! And by operations, I mean reads (listeners) and writes. You have to implement access control logic code yourself as part of the handlers if you want restrictions on functions.

Looking at the _Firebase security rules_ in the section above reveals one big problem:

```
    allow read: if request.auth.uid != null;  // anybody who has authenticated can read
    allow write: if request.auth.uid != null; // anybody who has authenticated can write
```

The idea that anyone who authenticates can read or write to chairLoc collections/documents is too liberal a policy. I want a security policy that restricts reading and writing to a very small group, a group whose access permissions I'll set when adding a new user. A video, [Controlling Data Access Using Firebase Auth Custom Claims (Firecasts)](https://www.youtube.com/watch?v=3hj_r_N0qMs), explains how to do just that. It is possible to assign a "custom claim" or "access privileges" for the user through his Firebase token. This is implemented through a _firebase.admin_ call that can only be invoked from a Firebase function, not the browser. Once access privileges have been established for each user, Firebase rules can easily access those privileges, via the _request.auth.token_ object, to perform data access controls. Now, the rules above can be rewritten to make a much more secure environment for the chairLocations project.

![](/markdownImages/roleBasedRules.png)

The api calls (which must be called from a Firebase function) that makes it possible to set custom claims is:

```
user = await admin.auth().getUserByEmail(email);  // gets the firebase token from an email address
admin.auth().setCustomUserClaims(user.uid, {canAccess: { chairLocs: true, maintenance: true },});

```

I implemented the firebase admin calls above and returned the Firebase user object (token) after customClaims have been set.

```
      retMsg = `Successfully set accesses for ${email}, ${JSON.stringify(user)}.`;

{message:"Successfully set accesses for junque135@gmail.com,
{uid: "8VtvISiDxXXXXXXXXXXakprx7At2",
email: "junque135@gmail.com",
emailVerified:true,
displayName: "TT MM",
photoURL: "https://lh3.googleusercontent.com/a-/AOh14Gjb061cYR_NfyGaMk9IRwCH6CZGRODxdiOl963Blw=s96-c",
disabled: false,
metadata: {lastSignInTime: "Mon, 20 Apr 2020 14:26:31 GMT", creationTime: "Mon, 06 Apr 2020 13:54:27 GMT"},
customClaims: {canAccess: {chairLocs: true, maintenance: false}},
tokensValidAfterTime: "Mon, 06 Apr 2020 13:54:27 GMT",
providerData:[{uid: "107324-------------16", displayName: "TT MM", email: "junque135@gmail.com", photoURL: "https://lh3.googleusercontent.com/a-/AOh14Gjb061cYR_NfyGaMk9IRwCH6CZGRODxdiOl963Blw=s96-c", providerId: "google.com"}."}

```

The user has to have logged in before a Firebase user object exists, therefore granting customClaims must be performed upon login, not when the user has been added.

![](/markdownImages/validUserDocument.png)

**<ins>Role-to-Privilege for Server-side Access Table</ins>**

| Role        | ChairLocs Read | ChairLocs Write | Maintenance Documents |
| ----------- | -------------- | --------------- | --------------------- |
| admin       | true           | true            | true                  |
| uploader    | true           | true            | true                  |
| lurker      | true           | false           | false                 |
| maintenance | false          | false           | true                  |

**<ins>Role-to-Privilege for Client-side Capabilities Table</ins>**

| Role        | App Configuration Privs | Upload Documents | Access Map Analytics | Perform Maintenance |
| ----------- | ----------------------- | ---------------- | -------------------- | ------------------- |
| admin       | true                    | true             | true                 | true                |
| uploader    | false                   | true             | true                 | true                |
| lurker      | false                   | false            | true                 | false               |
| maintenance | false                   | false            | false                | true                |

---

#### Two Good Playgrounds

[Typescript Playground](https://www.typescriptlang.org/play)

[moment.js Playground](http://jsfiddle.net/brandonscript/rLjQx/)

---

```
export enum Roles {   // Roles govern what can be done/seen client-side
   admin = "admin",
   uploader = "uploader",
   lurker = "lurker",
   maintenance = "maintenance",
}

export interface AccessObj {   // Accesses govern what can be done/seen server-side
   chairLocsRead?: boolean;
   chairLocsWrite?: boolean;
   maintenance?: boolean;
}

export interface UserObj {
   username: string;
   role: Roles;
   canAccess: AccessObj;
}

```

---

#### TODO:

1. Develop map analytics!

   [Cluster click](https://stackoverflow.com/questions/5710568/markerclusterer-on-click-zoom)

2. Maintenance
3. Consider moving to useContext API to eliminate all the authentication props drilling
4. consider implementing an ErrorBoundary on CleanAndUpload

#### <ins>TODO Physical World</ins>

1. Change oil in John Deere
2. Split wood

---

Identifying the two "indivisible" clusters near Ft. Lauderdale:

| Locations                            | On the Map                                     |
| ------------------------------------ | ---------------------------------------------- |
| ![](/markdownImages/indivisible.png) | ![](/markdownImages/identifyingTheCluster.png) |

---

#### cluster center: (27.71781, -82.73887) 3

### searching for: 27.71781

ID: "5c9836b38d",
LATITUDE: "27.71781",
LONGITUDE: "-82.73888",

ID: "02c40afeac",
LATITUDE: "27.71781",
LONGITUDE: "-82.73887",

ID: "4c83c71ffe",
LATITUDE: "27.71781",
LONGITUDE: "-82.73888",

### searching for: -82.73887

ID: "02c40afeac",
LATITUDE: "27.71781",
LONGITUDE: "-82.73887",

ID: "2e9a1cd3ac",
LATITUDE: "27.7178",
LONGITUDE: "-82.73887",

ID: "3ac0791814",
LATITUDE: "27.71783",
LONGITUDE: "-82.73887",

So, it's hard to identify which 3 markers make up the targeted cluster, especially when limited to searching for the locations using the _center of the cluster_ and not using the _locations of individual markers_.

---

### <ins>Dependency Graph for Mapping Branch</ins>

| index.tsx                                     | MainPage.tsx                                    |
| --------------------------------------------- | ----------------------------------------------- |
| ![](/markdownImages/dI/depIndex.tsx.png)      | ![](/markdownImages/dI/depMainPage.png)         |
| MappingBody.tsx                               | ChairQueryComponent.tsx                         |
| ![](/markdownImages/dI/depMB.png)             | ![](/markdownImages/dI/depChairQC.png)          |
| ChairQuerySide.tsx                            | ChairResultsSide.tsx                            |
| ![](/markdownImages/dI/depChairQuerySide.png) | ![](/markdownImages/dI/depChairResultsSide.png) |

---

### <ins>Dependency Graph for Uploading Branch</ins>

| index.tsx                                 | MainPage.tsx                                |
| ----------------------------------------- | ------------------------------------------- |
| ![](/markdownImages/dI/depIndex.tsx.png)  | ![](/markdownImages/dI/depMainPage.png)     |
| UploadBody.tsx                            | CleanAndUploadFiles.tsx                     |
| ![](/markdownImages/dI/depUploadBody.png) | ![](/markdownImages/dI/depCandUp.png)       |
| showChairData.tsx                         | mapContainer.tsx                            |
| ![](/markdownImages/dI/depShowCData.png)  | ![](/markdownImages/dI/depMapContainer.png) |

---

### <ins>Dependency Graph for index.js (on firebase functions server)</ins>

| ![](/markdownImages/dI/depIndex.js.png) |

---

temp.push({

ASSETLABEL: "CHAIR-064",

BEACH: "WEST PALM BEACH",

key: "f8ff9b66a6",

CELLACCURACY: "0",

DEVICEID: "11705",

FNAME: "CHAIR064_2020-05-05.csv",

GPS_MPH: "",

ID: "f8ff9b66a6",

IMEI: "013108002623037",

LATITUDE: "360",

LONGITUDE: "360",

RENTALAGENT: "SAND HELPER",

STATE: "Florida",

UPDATETIME: "2020-05-02T02:53:01Z",

UPLOADFBTIME: "2020-05-14T19:09:12.791Z",

uid: "f8ff9b66a6",

\_visible: "true",

});

---

CHAIR064_2020-05-05.csv

CHAIR066_2020-05-05.csv: For [CHAIR-066], uploading to Firebase 174 records, each containing 14 parameters.

CHAIR068_2020-05-05.csv: For [CHAIR-068], uploading to Firebase 141 records, each containing 14 parameters.

CHAIR070_2020-05-05.csv: For [CHAIR-070], uploading to Firebase 95 records, each containing 14 parameters.

CHAIR072_2020-05-05_1.csv: For [CHAIR-072], uploading to Firebase 314 records, each containing 14 parameters.

CHAIR078_2020-05-05.csv: For [CHAIR-078], uploading to Firebase 289 records, each containing 14 parameters.

CHAIR088_2020-05-05.csv: For [CHAIR-088], uploading to Firebase 179 records, each containing 14 parameters.

---

Annoying font change with "Logged In"

![](/markdownImages/loginStyling/1.png)

![](/markdownImages/loginStyling/2.png)

![](/markdownImages/loginStyling/3.png)
