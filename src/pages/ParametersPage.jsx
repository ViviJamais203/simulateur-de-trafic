import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ParametersForm from "../components/ParametersForm"

export default function Parametres() {
    const navigate = useNavigate()
    const [vehicleRange, setVehicleRange] = useState(75)
    const [speedRange, setSpeedRange] = useState(65)
    const [lightRange, setLightRange] = useState(18)
    const [spawnRange, setSpawnRange] = useState(2.5)
    const [checkedNetwork, setCheckedNetwork] = useState("option1")

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate("/simulation", {
            state: { vehicleRange, speedRange, lightRange, spawnRange, checkedNetwork }
        })
    }

    return (
        <>
            <h1>Paramètres</h1>
            <ParametersForm 
                vehicleRange={vehicleRange}
                setVehicleRange={setVehicleRange}
                speedRange={speedRange}
                setSpeedRange={setSpeedRange}
                lightRange={lightRange}
                setLightRange={setLightRange}
                spawnRange={spawnRange}
                setSpawnRange={setSpawnRange}
                checkedNetwork={checkedNetwork}
                setCheckedNetwork={setCheckedNetwork}
                disabled={false}
                onSubmit={handleSubmit}
            />
        </>
    )
}