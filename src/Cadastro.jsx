import { useState } from 'react'
import { register } from './utils/firebase'
import { Link } from 'react-router-dom'

function Cadastro(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        if(password !== confirmPassword){
            setError("As senhas não coicidem!");
            setLoading(false);
            return;
        }
        if(password.length < 6){
            setError("A senha deve ter pelo menos 6 caracteres");
            setLoading(false);
            return;
        }

        try {
            await register(email, password)
            window.location.href = "/";
        } catch (err) {
            setError("Erro ao criar a conta: " + err.message);
        }
        setLoading(false);
    }



    return(
        <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
            <h2>Cadastro</h2>
            <form onSubmit={handleRegister}>
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
                <div style={{ marginBottom: 15 }}>
                <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: 10, fontSize: 16 }}
                />
                </div>
                {error && (
                <div style={{ color: "red", marginBottom: 15 }}>
                    {error}
                </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: 10, fontSize: 16 }}
                >
                {loading ? "Criando conta..." : "Criar Conta"}
                </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 20 }}>
                Já tem conta? <Link to="/login">Faça login</Link>
            </p>
        </div>
    )
}

export default Cadastro;