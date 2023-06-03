import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import {db} from  '../database/firebase';
import { IProject } from "../model/Project";
import { ITask } from "../model/Task";
import { getUser } from "./UserApi";
import { getTasks } from "./TaskApi";

const tableName = 'Project'
const refCollection = collection(db, tableName);

export const getProjects = async (companyId:string) => {
    const q = query(refCollection, where("CompanyId", "==", companyId));
    const querySnapshot = await getDocs(q);
    var projects:Array<IProject> = extractProjects(querySnapshot);
    for(let i = 0; i < projects.length; i++){
        projects[i].User = await getUser(projects[i].UserId);
    }
    return projects;
}

export const getProject = async (Id:string) => {
    const docRef = doc(db, tableName, Id);
    const docSnap = await getDoc(docRef);
    var project = extractProject(docSnap);
    project.User = await getUser(project.UserId);
    project.Tasks = await getTasks(project.Id!);
    return project;
}

export const saveProject = async (project:IProject) => {
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

export const deleteProject1 = async (id:string) => {
    try {
        const tasks:Array<ITask> = await getTasks(id);
        if(tasks.length === 0){
            //Crear logica para eliminar
            await deleteDoc(doc(db, tableName, id));
            return true;
        }else{
           return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

function extractProjects(docs:any) {
    var projects:Array<IProject> = [];
    docs.forEach((doc:any) => {
        if(!doc.data().Archived){
            projects.push(extractProject(doc))
        }
    });
    return projects;
}

function extractProject(doc:any){
    const project:IProject = {
        Id: doc.id,
        Archived: doc.data().Archived,
        CompanyId: doc.data().CompanyId,
        CreationDate: doc.data().CreationDate,
        Description: doc.data().Description,
        Name: doc.data().Name,
        UserId: doc.data().UserId,
        key:''
    };
    return project;
}