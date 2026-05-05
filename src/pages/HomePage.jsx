import { useNavigate } from "react-router-dom"

export default function Home(){
    const navigate = useNavigate()
    return (
        <div className="page home">
            <h1>Simulateur de trafic routier</h1>
            <p>Configurez les paramètres de circulation et observez le comportement du trafic en temps réel.</p>
            <button className="btn-primary" onClick={() => navigate("/parametres")}>
                Demarrer une simulation
            </button>
        </div>
    )
}
