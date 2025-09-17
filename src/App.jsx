import { useEffect, useState } from 'react'
// Atualiza o badge do app (desktop) usando a Badges API, se suportado
function updateAppBadge(pendingCount) {
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(pendingCount);
  } else if ('setExperimentalAppBadge' in navigator) {
    navigator.setExperimentalAppBadge(pendingCount);
  }
}
import { v4 as uuidv4 } from "uuid"
import { addTask, getTasks } from './utils/db'
import { getUserLocation, exportTasksToJson, copyTaskToClipboard, listenTaskByVoice } from './utils/native'
import { getGoogleCalendarUrl } from './utils/calendar'
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

  // Atualiza badge sempre que tasks mudam
  useEffect(() => {
    const pending = tasks.filter(t => !t.done).length;
    updateAppBadge(pending);
  }, [tasks]);

  async function syncAndReload() {
    await syncTasks();
    await loadTasks();
  }

  async function handleAdd() {
    console.log('handleAdd')
    // Usar função utilitária para localização
    const location = await getUserLocation();
    const task = {
      id: uuidv4(),
      title, 
      hora,
      done,
      lastUpdated: Date.now(),
      synced: false,
      location // {lat, lng} ou null
    }
    await addTask(task);
    setTitle("")
    setHora("")
    setDone(false)
    await loadTasks();

    let notifyPromise = Promise.resolve();
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Nova tarefa criada", {
          body: `Tarefa: ${task.title}`,
          icon: "/vite.svg"
        });
        notifyPromise = new Promise(res => setTimeout(res, 350));
      } else if (Notification.permission !== "denied") {
        notifyPromise = Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Nova tarefa criada", {
              body: `Tarefa: ${task.title}`,
              icon: "/vite.svg"
            });
            return new Promise(res => setTimeout(res, 350));
          }
        });
      }
    }

    if (navigator.onLine) {
      await notifyPromise;
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => exportTasksToJson(tasks)} className="styled-input" style={{ background: '#2196f3', color: '#fff', fontWeight: 'bold' }}>Exportar JSON</button>
        <button onClick={handleVoiceAdd} className="styled-input" style={{ background: '#ff9800', color: '#fff', fontWeight: 'bold' }}>Adicionar por voz</button>
      </div>
      <ul className="task-list">
        {tasks.map(t =>(
          <li className="task-card" key={t.id}>
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{t.title}</div>
            <div style={{ color: '#888', fontSize: '0.95em' }}>{t.hora || ""}</div>
            {t.location && (
              <div style={{ color: '#2196f3', fontSize: '0.9em', marginTop: 4 }}>
                <span>Latitude: {t.location.lat?.toFixed(5)}</span><br />
                <span>Longitude: {t.location.lng?.toFixed(5)}</span>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              {t.done ? <span style={{ color: '#70ec85', fontWeight: 'bold' }}>Concluída</span> : <span style={{ color: '#ff5252', fontWeight: 'bold' }}>Não concluída</span>}
              {!t.synced && (
                <span style={{ color: '#ffd600', fontWeight: 'bold', marginLeft: 12, border: '1px solid #ffd600', borderRadius: 4, padding: '2px 6px', fontSize: '0.85em' }}>
                  Não sincronizada
                </span>
              )}
            </div>
            <div style={{ marginTop: 6, marginBottom: 2 }}>
              <button onClick={() => copyTaskToClipboard(t)} style={{ fontSize: '0.9em', background: '#eee', color: '#000', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Copiar</button>
            </div>
            <div style={{ marginBottom: 2 }}>
              <a
                href={getGoogleCalendarUrl(t)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.9em', background: '#4285F4', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', textDecoration: 'none' }}
                title="Adicionar ao Google Agenda"
              >Google Agenda</a>
            </div>
          </li>
        ))}

      </ul>
    </div>
  )
  // Adicionar tarefa por voz
  function handleVoiceAdd() {
    listenTaskByVoice(
      (transcript) => {
        setTitle(transcript);
        // Foca no input de título se possível
        setTimeout(() => {
          const el = document.querySelector('input.styled-input');
          if (el) el.focus();
        }, 100);
      },
      (err) => {
        alert('Erro no reconhecimento de voz: ' + err);
      }
    );
  }
}

export default App
