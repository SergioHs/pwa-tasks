import { getTasks, addTask } from './db'
import  { addTaskToFirebase } from './firebase'

export async function syncTasks() {
  const tasks = await getTasks();
  const unsynced = tasks.filter(t => !t.synced);
  let syncedCount = 0;

  for (const t of unsynced) {
    try {
      await addTaskToFirebase(t);
      t.synced = true;
      await addTask(t); // Atualiza no IndexedDB
      syncedCount++;
    } catch (e) {
      // Se falhar, mantém como não sincronizada
    }
  }

  if(syncedCount > 0 && typeof window !== 'undefined' && 'Notification' in window){
    if(Notification.permission === 'granted'){
      new Notification('Sincronização de tarefas', {
        body: `${syncedCount} tarefa(s) sincronizada(s) com sucesso!`,
        icon: '/vite.svg'
      });
    }
  }
}