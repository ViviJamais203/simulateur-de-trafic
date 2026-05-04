import ParametersForm from "../components/ParametersForm"
import { SimulationCanvas } from "../components/SimulationCanvas"
import SimulationControls from "../components/SimulationControls"
import { useNavigate, useLocation } from "react-router-dom"
export default function Simulation(){
    const location = useLocation()
    const navigate = useNavigate

    if (!location.state) {
        navigate("/parametres")
        return null
    }

    const { vehicleRange, speedRange, lightRange, spawnRange, checkedNetwork } = location.state

    return (
        <>
            <h1>Simulation</h1>
            <ParametersForm 
                vehicleRange={vehicleRange}
                speedRange={speedRange}
                lightRange={lightRange}
                spawnRange={spawnRange}
                checkedNetwork={checkedNetwork}
                disabled={true}
            />
            <SimulationCanvas 
                vehicleRange={vehicleRange}
                speedRange={speedRange}
                lightRange={lightRange}
                spawnRange={spawnRange}
                checkedNetwork={checkedNetwork}
            />
            <SimulationControls />
        </>
    )
}