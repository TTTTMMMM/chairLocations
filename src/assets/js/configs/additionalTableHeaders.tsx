const additionalHeaders = [
   "ID", //hash of 'AssetLabel' and'UploadTime' (not UploadFBTime)
   "FName", //filename
   "UploadFBTime", // time when file is uploaded to firebase
   "State", // state where chair is deployed
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

export default additionalHeaders;
