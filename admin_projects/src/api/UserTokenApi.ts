//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {db} from  '../database/firebase';
import { IUserToken } from "../model/UserToken";

const tableName = 'UserToken'
const refCollection = collection(db, tableName);

export const getUsertToken = async (ipAddress:string) => {
  const q = query(refCollection, where("IpAddress", "==", ipAddress));
  const querySnapshot = await getDocs(q);
  var token = extractToken(querySnapshot)
  return token;
}

export const deleteUserToken = async (id:string) =>{
  try{
    await deleteDoc(doc(db, tableName, id));
    return true;
  }catch(error){
    console.log('Error: \n'+error)
    return false;
  }
}

export const saveUserToken = async (userToken: IUserToken) => {
  let result: IUserToken = {
    Id:"0",
    Active: false,
    CompanyId: "0",
    IpAddress:"0",
    UserId: "0"
  }
  try {
    var docRef = await addDoc(refCollection, {
      Active: true,
      CompanyId: userToken.CompanyId,
      IpAddress: userToken.IpAddress,
      UserId: userToken.UserId
    });
    var docSnap = doc(db, tableName, docRef.id);
    return extractData(await getDoc(docSnap));
  } catch (error) {
    console.log(error) 
    return result;
  }
}

export const updateActiveToken = async (userToken: IUserToken) => {
  try {
    const tokenRef = doc(db, tableName, userToken.Id!);
    updateDoc(tokenRef, { 
      'Active' : userToken.Active,
      'CompanyId': userToken.CompanyId,
      'UserId': userToken.UserId });
    return true;
  } catch (error) {
    console.log('Error ocurred: \n' + error)
    return false;
  }
}

function extractToken(docs:any) {
    var tokens:Array<IUserToken> = [];
    docs.forEach((doc:any) => {
      tokens.push(extractData(doc));
    });
    if(tokens.length != 0){
      return tokens[0];
    }
    return null;
}

function extractData(doc:any){
  var token:IUserToken = {
    Id: doc.id,
    Active: doc.data().Active,
    CompanyId: doc.data().CompanyId,
    IpAddress: doc.data().IpAddress,
    UserId: doc.data().UserId,
  }
  return token;
}