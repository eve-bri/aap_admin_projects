//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from  '../database/firebase';
import { ICompany } from "../model/Company";

const tableName = 'Company'
const refCollection = collection(db, tableName);

export const getCompanies = async () => {
    const querySnapshot = await getDocs(refCollection);
    return extractCompanies(querySnapshot)
}

export const getCompany = async (Id:string) => {
    const docRef = doc(db, tableName, Id);
    const docSnap = await getDoc(docRef);
    return extracCompany(docSnap);
}

function extractCompanies(docs:any) {
    var companies:Array<ICompany> = [];
    docs.forEach((doc:any) => {
      companies.push(extracCompany(doc))
    });
    return companies;
}

function extracCompany(doc:any){
    const company:ICompany = {
        Id: doc.id,
        LogoUrl: doc.data().LogoUrl,
        Name: doc.data().Name,
        Pin: doc.data().Pin,
    };
    return company;
}