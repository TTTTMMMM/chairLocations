### Reminders When Making the Next Project

1. <span style="font-family: 'Verdana';">After you eject, don't forget to copy the .babelrc file into the root of the new project!
2. <span style="font-family: 'Verdana';">Don't forget to go to [Google Credentials page](https://console.cloud.google.com/apis/credentials?project=chairlocations) and lock down two API keys:

-  <span style="font-family: 'Verdana';">API Keys >Browser key (auto created by Firebase) --> apply API restrictions
-  <span style="font-family: 'Verdana';">OAuth 2.0 Client Key --> apply authorized JavaScript Origins

3. <span style="font-family: 'Verdana';">Don't forget to [enable Google Authentication in Firebase console](https://console.firebase.google.com/u/0/project/chairlocations/authentication/providers) > Authentication > Sign-in method

4. <span style="font-family: 'Verdana';">If you get the following error when trying to subscribe to a collection, test the rules in the database rules playground:</span> <span style="color:red;font-weight:bold">**Uncaught Error in onSnapshot: FirebaseError: Missing or insufficient permissions.**

---

### Data Cleaning

<span style="font-family: 'Verdana';">The first step in processing the chair location information is to clean the data. That means eliminating columns (aka, parameters) and rows that aren't desired. Eliminating undesired columns makes the data "skinny," and eliminating undesired rows makes the data "shorter."

<span style="font-family: 'Verdana';">Examples of undesired columns are columns that contain no data, or columns that contain the same value for each row, among other reasons. Data is cleansed of undesired columns before cleansing of undesired rows takes place.

<span style="font-family: 'Verdana';">Examples of undesired rows are rows that contain error values in the columns that were kept (e.g., [latitude, longitude] values of [-360, -360]). Cleansing data of undesired rows is known as making the data "shorter." Getting to short-and-skinny is required before uploading chair location data to Firebase.

<span style="font-family: 'Verdana';">All cleaning efforts are done on the client end, with the server performing only data validation and storing into Firebase collections.

---

### FatChairObject

<span style="font-family: 'Verdana';">The fatChairObj's properties are the cell values from the original file. In this case, the csv file had ~65 table headers. Each of the table headers becomes a property or field in the object. The object, because it contains ~65 fields, many of which are undefined or meaningless in the original csv file, is known as being "fat."

`console.dir(fatChairObj):`

![](/markdownImages/fatChairObj.png)

---

### ExtendedFatChairObject

<span style="font-family: 'Verdana';">The extendedFat's properties are spread of the fatChairObj + calculated values for the additionalHeaders.

`console.dir(extendedFat)`

![](/markdownImages/extendedFatChairObj.png)

---

### extendedExtendedFatChairObject

<span style="font-family: 'Verdana';">The extendedExtendedFat's (eEFO) properties are spread of the fatChairObj + calculated values for the additionalHeaders + the entered values of where the chair is deployed (STATE, BEACH, RENTALAGENT):

```
         this.extendedFatArray.forEach((x) => {
            let eEFO = { ...x, ...objectFromPopoverContents };
            console.dir(eEFO);
            this.extendedExtendedFatArray.push(eEFO);
         });
         console.log(`extendedExtendedFatArray below:`);
         console.dir(this.extendedExtendedFatArray);
```

![](/markdownImages/eEFO.png)

---

### Extended Fat Chair Object Array

<span style="font-family: 'Verdana';">Therefore, the extendedExtendedFatArray[] is an array of the above, each element corresponding to one row of the original input csv file:

`console.dir(this.extendedExtendedFatArray);`

![](/markdownImages/eEFOArray.png)

---

### Skinny Object & Tall and Skinny Array

<span style="font-family: 'Verdana';">The tallAndSkinnyArray[] is the kept Chair Headers (or parameters or fields) applied to the extendedExtendedFatArray[]; i.e., it "skinnifies" the fat array in that it reduces the number of fields kept for eventual uploading to Firebase. (Notice that no headers have been snipped in each object below, in contrast to the snipping I had to do to every (fat) object logged above.):

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

![](/markdownImages/skinnyObject.png)

```
         console.log(`extendedExtendedFatArray below:`);
         console.dir(this.extendedExtendedFatArray);
```

![](/markdownImages/tallAndSkinnyArray.png)

<span style="font-family: 'Verdana';">Those are all the columns I'm keeping from the original data. The data has been made skinny, but it is still tall. In other words, there are rows that must be purged, i.e., made "short" - the resulting data will be considered transformed from tallAndSkinny[] to shortAndSkinny[] after row reduction is achieved!

---

### Short and Skinny Array

<span style="font-family: 'Verdana';">The shortAndSkinnyArray[] is the tallAndSkinny[] minus a few rows that are cleansed, such as documents that have LATITUTE = "-360". This reduces the number of documents loaded into Firebase. shortAndSkinny[] is uploaded to Firebase.

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

Costs appear to be dominated by reads/writes, so estimate $72 + $120 = **\$193** per year, since storage costs are negligible.

This estimate may be high. See [this example](https://firebase.google.com/docs/firestore/billing-example) for better estimate, which includes free monthly quotas factored in.

---

### Screenshot of Usage on 4/15/2020

[ChairLoc Usage as Shown on GCP](https://console.cloud.google.com/appengine/quotadetails?project=chairlocations&folder&organizationId)

![](/markdownImages/oneDayUsage.png)

[ChairLoc usage shown on Firebase Console](https://console.firebase.google.com/project/chairlocations/usage).

![](/markdownImages/chairLocsUsage.png)

---

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

---

#### TODO:

1. Learn how to use Firebase Rules to perform data validation.

2. [If you're using the Web, Android, or iOS SDK, use Firebase Authentication and Cloud Firestore Security Rules to secure your data in Cloud Firestore.](https://firebase.google.com/docs/firestore/quickstart#auth-required)

#### <ins>TODO Physical World</ins>

1. Repair rototiller
2. Add Neutra7 to neutralizer tank
3. Rototill fence garden & lay weedblock
4. chip and shred branches
5. mow lawn
