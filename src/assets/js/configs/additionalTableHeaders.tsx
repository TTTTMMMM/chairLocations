const additionalHeaders = [
   // WARNING!These values are positionally dependent; only add to the bottom
   "ID", //hash of 'AssetLabel' and'UploadTime' (not UploadFBTime)
   "FName", //filename
   "UploadFBTime", // time when file is uploaded to firebase
   "State", // state where chair is deployed;
   "Beach", // beach where chair is deployed
   "RentalAgent", // rental agent where chair is deployed
];

export const mandatoryHeaders = [
   "AssetLabel",
   "Beach",
   "Fname",
   "ID",
   "Latitude",
   "Longitude",
   "RentalAgent",
   "State",
   "UpdateTime",
   "UploadFBTime",
];

export const statesArray = [
   "Alabama",
   "Alaska",
   "American Samoa",
   "Arizona",
   "Arkansas",
   "California",
   "Colorado",
   "Connecticut",
   "Delaware",
   "District of Columbia",
   "Florida",
   "Georgia",
   "Guam",
   "Hawaii",
   "Idaho",
   "Illinois",
   "Indiana",
   "Iowa",
   "Kansas",
   "Kentucky",
   "Louisiana",
   "Maine",
   "Maryland",
   "Massachusetts",
   "Michigan",
   "Minnesota",
   "Minor Outlying Islands",
   "Mississippi",
   "Missouri",
   "Montana",
   "Nebraska",
   "Nevada",
   "New Hampshire",
   "New Jersey",
   "New Mexico",
   "New York",
   "North Carolina",
   "North Dakota",
   "Northern Mariana Islands",
   "Ohio",
   "Oklahoma",
   "Oregon",
   "Pennsylvania",
   "Puerto Rico",
   "Rhode Island",
   "South Carolina",
   "South Dakota",
   "Tennessee",
   "Texas",
   "U.S. Virgin Islands",
   "Utah",
   "Vermont",
   "Virginia",
   "Washington",
   "West Virginia",
   "Wisconsin",
   "Wyoming",
];

export default additionalHeaders;
