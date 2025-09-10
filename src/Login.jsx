import { useState } from 'react'
import { login } from './utils/firebase'
import { Link } from "react-router-dom"

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
                disabled={loading}
                style={{ width: "100%", padding: 10, fontSize: 16 }}
                >
                {loading ? "Entrando..." : "Entrar"}
            </button>
        </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20 }}>
            Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
        
        </>
    )

}

export default Login;