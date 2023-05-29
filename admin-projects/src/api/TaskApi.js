import { collection, query, where, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import {db} from  '../database/firebase.js';

const tableName = 'Task'
const refCollection = collection(db, tableName);

export const getTask = async (projectId) => {
    const q = query(refCollection, where('ProjectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    var tasks = extractTasks(querySnapshot);
    return tasks;
}

function extractTasks(docs) {
    var tasks = [];
    docs.forEach((doc) => {
        if(!doc.data().Archived){
            tasks.push(extractTask(doc))
        }
    });
    return tasks;
}

function extractTask(doc){
    return {
        Id: doc.id,
        Archived: doc.data().Archived,
        ProjectId: doc.data().ProjectId,
        CreationDate: doc.data().CreationDate,
        FinishDate: doc.data().FinishDate,
        Name: doc.data().Name,
    };
}