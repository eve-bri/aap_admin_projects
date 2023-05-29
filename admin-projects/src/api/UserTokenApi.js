//import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {db} from  '../database/firebase.js';
const tableName = 'UserToken'
const refCollection = collection(db, tableName);

export const getUsertToken = async (ipAddress) => {

    const q = query(refCollection, where("IpAddress", "==", ipAddress));

    const querySnapshot = await getDocs(q);
    token = extractToken(querySnapshot)
    return token;
}

export const deleteUserToken = async (id) =>{
  try{
    await deleteDoc(doc(db, tableName, id));
    return true;
  }catch(error){
    console.log('Error: \n'+error)
    return false;
  }
}

export const saveUserToken = async (userToken) => {
  try {
    var docRef = await addDoc(refCollection, {
      Active: true,
      CompanyId: userToken.CompanyId,
      IpAddress: userToken.IpAddress,
      UserId: userToken.UserId
    });
    docSnap = doc(db, tableName, docRef.id);
    return extractData(await getDoc(docSnap));
  } catch (error) {
    console.log(error) 
    return null;
  }
}

export const updateActiveToken = async (userToken) => {
  try {
    const tokenRef = doc(db, tableName, userToken.Id);
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

function extractToken(docs) {
    var token = null;
    docs.forEach((doc) => {
      token = extractData(doc);
    });
    return token;
}

function extractData(doc){
  var token = {
    Id: doc.id,
    Active: doc.data().Active,
    CompanyId: doc.data().CompanyId,
    IpAddress: doc.data().IpAddress,
    UserId: doc.data().UserId,
  }
  return token;
}