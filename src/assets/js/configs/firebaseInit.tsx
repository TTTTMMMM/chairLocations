import firebase from "firebase/app";
// client-side code

var firebaseConfig = {
   apiKey: "AIzaSyBRmMap_YVdQg7UIwV-wCAbhHssSgWQkYc",
   authDomain: "chairlocations.firebaseapp.com",
   databaseURL: "https://chairlocations.firebaseio.com",
   projectId: "chairlocations",
   storageBucket: "chairlocations.appspot.com",
   messagingSenderId: "702445664854",
   appId: "1:702445664854:web:35aa6d941ee1156a4199f7",
   measurementId: "G-SREQNQY5RR",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
