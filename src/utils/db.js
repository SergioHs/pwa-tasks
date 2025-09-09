import { openDB } from "idb";

const DB_NAME = 'tasksDB';
const STORE_NAME = 'tasks';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if(!db.objectStoreNames.contains(STORE_NAME)){
                db.createObjectStore(STORE_NAME, { keyPath: 'id'});
            }
        }
    })
}

export async function addTask(task) {
    const db = await initDB();
    await db.put(STORE_NAME, task);
}

export async function getTasks() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}