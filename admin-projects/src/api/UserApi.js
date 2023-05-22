//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, and } from "firebase/firestore";
import {db} from  '../database/firebase.js';
const tableName = 'User'
const refCollection = collection(db, tableName);

export const verifyLoginUser = async (userName, password, companyId)=> {
    const q = query(refCollection, where("Login", "==", userName));
    const querySnapshot = await getDocs(q);
    var user = extractUser(querySnapshot);
    if(user !== null){
        if(user.CompanyId !== companyId || user.Password !== password){
            user = null;
        }
    }
    return user;
}

function extractUser(docs) {
    var user = null;
    docs.forEach((doc) => {
        user = {
            Id: doc.id,
            Login: doc.data().Login,
            CompanyId: doc.data().CompanyId,
            Name: doc.data().Name,
            Password: doc.data().Password,
            PhotoUrl: doc.data().PhotoUrl,
        }
    });
    return user;
}
