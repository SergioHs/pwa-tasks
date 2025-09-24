import { useState } from 'react'
import { login } from './utils/firebase'
import { Link } from "react-router-dom"
import OfflineIndicator from "./components/OfflineIndicator"
import { useOnlineStatus } from './hooks/useOnlineStatus'

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { isOnline } = useOnlineStatus();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(email, password);
            window.location.href = '/';

        } catch (err) {
            setError("Erro ao fazer login " + err.message);
        }
        setLoading(false);
    }

    return (
        <>
        <OfflineIndicator />
        <div style={{ maxWidth: 400, margin: "50px auto", padding: 20}}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 15 }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", padding: 10, fontSize: 16 }}
                />
            </div>
            <div style={{ marginBottom: 15 }}>
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: 10, fontSize: 16 }}
                />
            </div>
            {error && (
                <div style={{ color: 'red', marginBottom: 15}}>
                    {{error}}
                </div>
            )}
            <button
                type="submit"
                disabled={loading || !isOnline}
                style={{ 
                    width: "100%", 
                    padding: 10, 
                    fontSize: 16,
                    opacity: !isOnline ? 0.5 : 1,
                    cursor: !isOnline ? 'not-allowed' : 'pointer'
                }}
                title={!isOnline ? "Login não disponível offline" : ""}
                >
                {loading ? "Entrando..." : !isOnline ? "Offline - Login Indisponível" : "Entrar"}
            </button>
        </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20 }}>
            Não tem conta? {isOnline ? (
                <Link to="/cadastro">Cadastre-se</Link>
            ) : (
                <span style={{ 
                    color: '#999', 
                    cursor: 'not-allowed',
                    textDecoration: 'line-through' 
                }} title="Cadastro não disponível offline">
                    Cadastre-se
                </span>
            )}
        </p>
        
        </>
    )

}

export default Login;