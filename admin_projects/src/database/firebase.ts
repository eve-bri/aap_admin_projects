import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadString } from "firebase/storage";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB92tTr3MHccVZmkMbXMRygrBSZ9TaFoFo",
  authDomain: "admin-projects-dc16f.firebaseapp.com",
  projectId: "admin-projects-dc16f",
  storageBucket: "admin-projects-dc16f.appspot.com",
  messagingSenderId: "345362517225",
  appId: "1:345362517225:web:67f090a4e5106486b7f478",
  measurementId: "G-2P3QJJEBHQ"
};
const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)
const storage = getStorage(firebase, "gs://admin-projects-dc16f.appspot.com");

const uploadField = async (data:string, folder:string, nameFile:string, metaData:any = null) => {
  const storageRef = ref(storage, nameFile);
  var url = await uploadString(storageRef, data, 'data_url', metaData).then((snapshot) => {
    console.log(snapshot);
    return '';
  });
  console.log('sale');
  return url;
}

export {
    firebase, db, uploadField
  }