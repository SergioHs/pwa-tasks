import { useEffect, useState } from "react";
import { getTasks } from "./utils/db";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { shareTask } from "./utils/native";
import OfflineIndicator from "./components/OfflineIndicator";


async function handleShare(task) {
    try {
        await shareTask(task);
    } catch (err) {
        alert(err.message || 'Não foi possível compartilhar.');
    }
}

function Dashboard() {
    const {currentUser, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error("Erro ao fazer logout: " + error);
        }
    }
    
    useEffect(() => {
        async function fetchTasks() {
            const allTasks = await getTasks();
            setTasks(allTasks);
            const filtered = allTasks.filter(t => t.done);
            setCompletedTasks(filtered);
        }
        fetchTasks();
    }, [])

    return(
        <div className="main-container">
            <OfflineIndicator />
            <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <Link to="/">
                    <button className="styled-input" style={{ background: '#1976d2', color: '#fff', fontWeight: 'bold' }}>Voltar para Home</button>
                </Link>
            </div>
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <span style={{ marginRight: 15 }}>Bem-vindo, {currentUser?.email}!</span>
            </div>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Total de tarefas concluídas: {completedTasks.length}</p>
            <ul className="task-list">
                {completedTasks.map(t => (
                <li className="task-card" key={t.id}>
                    <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{t.title}</div>
                    <div style={{ color: '#888', fontSize: '0.95em' }}>{t.hora || ""}</div>
                    <div style={{ marginTop: 8 }}>
                        <span style={{ color: '#70ec85', fontWeight: 'bold' }}>� Concluída</span>
                    </div>
                    <button
                        style={{ marginTop: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
                        onClick={() => handleShare(t)}
                    >Compartilhar</button>
                </li>
                ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}
export default Dashboard;