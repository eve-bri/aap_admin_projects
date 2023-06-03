import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import {db} from  '../database/firebase';
import { ITask } from "../model/Task";

const tableName = 'Task'
const refCollection = collection(db, tableName);

export const getTasks = async (projectId: string) => {
    const q = query(refCollection, where('ProjectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    var tasks:Array<ITask> = extractTasks(querySnapshot);
    return tasks;
}

function extractTasks(docs: any) {
    var tasks:Array<ITask> = [];
    docs.forEach((doc:any) => {
        if(!doc.data().Archived){
            tasks.push(extractTask(doc))
        }
    });
    return tasks;
}

function extractTask(doc:any){
    const task:ITask = {
        Id: doc.id,
        Archived: doc.data().Archived,
        ProjectId: doc.data().ProjectId,
        CreationDate: doc.data().CreationDate,
        FinishDate: doc.data().FinishDate,
        Name: doc.data().Name,
    }
    return task;
}