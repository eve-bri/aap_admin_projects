//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from  '../database/firebase.js';
const tableName = 'Company'

export const getCompanies = async () => {
    const querySnapshot = await getDocs(collection(db, tableName));
    return extractCompanies(querySnapshot)
}

function extractCompanies(docs) {
    var companies = [];
    docs.forEach((doc) => {
        company = {
            Id: doc.id,
            LogoUrl: doc.data().LogoUrl,
            Name: doc.data().Name,
            Pin: doc.data().Pin,
        }
      companies.push(company)
    });
    return companies;
}