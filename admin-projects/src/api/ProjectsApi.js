import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import {db} from  '../database/firebase.js';
const tableName = 'Project'
const refCollection = collection(db, tableName);