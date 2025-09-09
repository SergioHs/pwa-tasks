import { getTasks, addTask } from './db'
import  { addTaskToFirebase } from './firebase'

export async function syncTasks() {
  const tasks = await getTasks();
  const unsynced = tasks.filter(t => !t.synced);
  for (const t of unsynced) {
    try {
      await addTaskToFirebase(t);
      t.synced = true;
      await addTask(t); // Atualiza no IndexedDB
    } catch (e) {
      // Se falhar, mantém como não sincronizada
    }
  }
}
