import { useNavigate } from "react-router-dom"

export default function Home(){
    const navigate = useNavigate()
    return (
        <>
            <h1>Simulateur de trafic routier</h1>
            <button onClick={() => navigate("/parametres")}>Démarrer une simulation</button>
        </>
    )
}