//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import {db, uploadField} from  '../database/firebase';
import { IUser } from "../model/User";

const tableName = 'User'
const refCollection = collection(db, tableName);

export const verifyUserNameAvailability = async (userName:string) => {
    const q = query(refCollection, where("Login", "==", userName));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
        return true;
    }
    return false;
}

export const verifyLoginUser = async (userName:string, password:string)=> {
    const q = query(refCollection, where("Login", "==", userName));
    const querySnapshot = await getDocs(q);
    var user:IUser|null = null;
    if(!querySnapshot.empty){
        var users = extractUsers(querySnapshot);
        user = users[0]
    }
    if(user !== null){
        if(user.Password !== password){
            user = null;
        }
    }
    return user;
}

export const registerUser = async (userData:any) => {
    var result = await uploadField(userData.file.base64, 'images', userData.file.name, {contentType: 'image/'+userData.file.extension,});
    return result;
}

export const getUser = async (Id:string) => {
    const docRef = doc(db, tableName, Id);
    const docSnap = await getDoc(docRef);
    return extractUser(docSnap);
}

function extractUsers(docs:any) {
    var users:Array<IUser> = [];
    docs.forEach((doc:any) => {
        users.push(extractUser(doc))
    });
    return users;
}
function extractUser(doc:any) {
    var user:IUser={
        Id: doc.id,
        Login: doc.data().Login,
        CompanyId: doc.data().CompanyId,
        Name: doc.data().Name,
        Password: doc.data().Password,
        PhotoUrl: doc.data().PhotoUrl,
    };
    return user;
}
