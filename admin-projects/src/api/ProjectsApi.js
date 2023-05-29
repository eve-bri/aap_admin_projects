import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import {db} from  '../database/firebase.js';
import { getUser } from "./UserApi.js";
import { getTask } from "./TaskApi.js";

const tableName = 'Project'
const refCollection = collection(db, tableName);

export const getProjects = async (companyId) => {
    const q = query(refCollection, where("CompanyId", "==", companyId));
    const querySnapshot = await getDocs(q);
    var projects = extractProjects(querySnapshot);
    for(i = 0; i < projects.length; i++){
        projects[i].User = await getUser(projects[i].UserId);
    }
    return projects;
}

export const saveProject = async (project) => {
    try {
        const docRef = await addDoc(refCollection, {
            Archived: project.Archived,
            CompanyId: project.CompanyId,
            CreationDate: project.CreationDate,
            Name: project.Name,
            Description: project.Description,
            UserId: project.UserId
          });
        return docRef.id;
    } catch (error) {
        console.log('Error: \n'+error);
        return null;
    }
}

export const deleteProject = async (id) => {
    try {
        const tasks = await getTask(id);
        console.log(tasks);
        if(tasks.empty){
            return true;
        }else{
           return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
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
        Id: doc.id,
        Archived: doc.data().Archived,
        CompanyId: doc.data().CompanyId,
        CreationDate: doc.data().CreationDate,
        Description: doc.data().Description,
        Name: doc.data().Name,
        UserId: doc.data().UserId,
    };
}