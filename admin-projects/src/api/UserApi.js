//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import {db} from  '../database/firebase.js';
const tableName = 'User'
const refCollection = collection(db, tableName);

export const verifyLoginUser = async (userName, password, companyId)=> {
    const q = query(refCollection, where("Login", "==", userName));
    const querySnapshot = await getDocs(q);
    var user = null;
    if(!querySnapshot.empty){
        var users = extractUsers(querySnapshot);
        user = users[0]
    }
    if(user !== null){
        if(user.CompanyId !== companyId || user.Password !== password){
            user = null;
        }
    }
    return user;
}

export const getUser = async (Id) => {
    const docRef = doc(db, tableName, Id);
    const docSnap = await getDoc(docRef);
    return extractUser(docSnap);
}

function extractUsers(docs) {
    var users = [];
    docs.forEach((doc) => {
        users.push(extractUser(doc))
    });
    return users;
}
function extractUser(doc) {
    return {
            Id: doc.id,
            Login: doc.data().Login,
            CompanyId: doc.data().CompanyId,
            Name: doc.data().Name,
            Password: doc.data().Password,
            PhotoUrl: doc.data().PhotoUrl,
        };
}
