import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import {db} from  '../database/firebase.js';
const tableName = 'Project'

const refCollection = collection(db, tableName);

export const getProjects = async (companyId) => {
    const q = query(refCollection, where("CompanyId", "==", companyId));
    const querySnapshot = await getDocs(q);
    return extractProjects(querySnapshot);
}

function extractProjects(docs) {
    var projects = [];
    docs.forEach((doc) => {
        if(!doc.data().Archived){
            projects.push(extractProject(doc))
        }
    });
    return projects;
}

function extractProject(doc){
    return {
        Id: doc.Id,
        Archived: doc.data().Archived,
        CompanyId: doc.data().CompanyId,
        CreationDate: doc.data().CreationDate,
        Description: doc.data().Description,
        Name: doc.data().Name,
    };
}