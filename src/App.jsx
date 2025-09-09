import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from "uuid"
import { addTask, getTasks } from './utils/db'
import { useAuth } from './contexts/AuthContext'
import { syncTasks } from './utils/sync'
import './App.css'

function App() {
  const { currentUser, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [hora, setHora] = useState("");
  const [done, setDone] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Erro ao fazer logout " + err);
    }
  }

  useEffect(() => {
    loadTasks();
    if(navigator.onLine){
      syncAndReload();
    }
    window.addEventListener('online', syncAndReload);
    window.addEventListener('offline', loadTasks);
    return () => {
      window.removeEventListener('online', syncAndReload);
      window.removeEventListener('offline', loadTasks);
    }

  }, [])

  async function syncAndReload() {
    await syncTasks();
    await loadTasks();
  }

  async function handleAdd() {

    console.log('handleAdd')
    const task = {
      id: uuidv4(),
      title, 
      hora,
      done,
      lastUpdated: Date.now(),
      synced: false
    }
    await addTask(task);
    setTitle("")
    setHora("")
    setDone(false)
    await loadTasks();
    if(navigator.onLine){
      await syncAndReload();
    }
  }

  async function loadTasks() {
    const allTasks = await getTasks();
    allTasks.sort((a, b) => b.lastUpdated - a.lastUpdated)
    setTasks(allTasks);
  }
  
return (
    <div className="main-container">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Minhas tarefas</h1>
      <input
        className="styled-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da tarefa"
      />
      <input
        className="styled-input"
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />
      <label style={{ marginLeft: 4, marginBottom: 10, display: 'block' }}>
        <input
          type="checkbox"
          checked={done}
          onChange={e => setDone(e.target.checked)}
          style={{ marginRight: 6 }}
        />
        Concluída
      </label>
      <button onClick={handleAdd} className="styled-input" style={{ background: '#70ec85', color: '#213547', fontWeight: 'bold', marginBottom: 18 }}>Adicionar</button>
      <ul className="task-list">
        {tasks.map(t =>(
          <li className="task-card" key={t.id}>
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{t.title}</div>
            <div style={{ color: '#888', fontSize: '0.95em' }}>{t.hora || ""}</div>
            <div style={{ marginTop: 8 }}>
              {t.done ? <span style={{ color: '#70ec85', fontWeight: 'bold' }}>Concluída</span> : <span style={{ color: '#ff5252', fontWeight: 'bold' }}>Não concluída</span>}
              {!t.synced && (
                <span style={{ color: '#ffd600', fontWeight: 'bold', marginLeft: 12, border: '1px solid #ffd600', borderRadius: 4, padding: '2px 6px', fontSize: '0.85em' }}>
                  Não sincronizada
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
