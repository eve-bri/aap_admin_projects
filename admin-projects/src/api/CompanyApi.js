//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from  '../database/firebase.js';
const tableName = 'Company'
const refCollection = collection(db, tableName);

export const getCompanies = async () => {
    const querySnapshot = await getDocs(refCollection);
    return extractCompanies(querySnapshot)
}

export const getCompany = async (Id) => {
    const docRef = doc(db, tableName, Id);
    const docSnap = await getDoc(docRef);
    return extracCompany(docSnap);
}

function extractCompanies(docs) {
    var companies = [];
    docs.forEach((doc) => {
      companies.push(extracCompany(doc))
    });
    return companies;
}

function extracCompany(doc){
    return {
        Id: doc.id,
        LogoUrl: doc.data().LogoUrl,
        Name: doc.data().Name,
        Pin: doc.data().Pin,
    };
}