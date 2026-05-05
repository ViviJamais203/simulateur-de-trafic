import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { SimulationCanvas } from "../components/SimulationCanvas"
import ParametersForm from "../components/ParametersForm"
import SimulationControls from "../components/SimulationControls"
import StatisticsPanel from "../components/StatisticsPanel"

export default function Simulation() {
    const location = useLocation()
    const navigate = useNavigate()
    const [activeSpeed, setActiveSpeed] = useState(1)
    const [isPaused, setIsPaused] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [resetKey, setResetKey] = useState(0)
    const [statistics, setStatistics] = useState({ activeVehicles: 0, averageSpeed: 0 })

    if (!location.state) {
        navigate("/parametres")
        return null
    }

    const { vehicleRange, speedRange, lightRange, spawnRange, checkedNetwork } = location.state

    const handleReset = () => {
        setResetKey(k => k + 1)
        setIsPaused(false)
        setIsFinished(false)
        setActiveSpeed(1)
        setStatistics({ activeVehicles: 0, averageSpeed: 0 })
    }

    return (
        <div className="page simulation-page">
            <div className="simulation-header">
                <h1>Simulation</h1>
                <button className="btn-back" onClick={() => navigate("/parametres", { state: location.state })}>
                    Parametres
                </button>
            </div>
            <div className="simulation-layout">
                <div className="simulation-sidebar">
                    <div className="card">
                        <ParametersForm
                            vehicleRange={vehicleRange}
                            speedRange={speedRange}
                            lightRange={lightRange}
                            spawnRange={spawnRange}
                            checkedNetwork={checkedNetwork}
                            simulationSpeed={activeSpeed}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="simulation-main">
                    <div className="canvas-wrapper">
                        <SimulationCanvas
                            key={resetKey}
                            vehicleRange={vehicleRange}
                            speedRange={speedRange}
                            lightRange={lightRange}
                            spawnRange={spawnRange}
                            checkedNetwork={checkedNetwork}
                            simulationSpeed={isPaused ? 0 : activeSpeed}
                            onFinish={() => { setIsFinished(true); setStatistics({ activeVehicles: 0, averageSpeed: 0 }) }}
                            onStatistics={(stats) => setStatistics(stats)}
                        />
                        {isFinished && (
                            <div className="finished-overlay">
                                <h2>Simulation terminée</h2>
                                <div className="finished-actions">
                                    <button className="btn-primary" onClick={handleReset}>Relancer</button>
                                    <button className="btn-primary btn-secondary" onClick={() => navigate("/parametres", { state: location.state })}>Nouvelle simulation</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <SimulationControls
                        activeSpeed={activeSpeed}
                        setActiveSpeed={setActiveSpeed}
                        isPaused={isPaused}
                        onTogglePause={() => setIsPaused(p => !p)}
                        onReset={handleReset}
                    />
                </div>
                <StatisticsPanel statistics={statistics} />
            </div>
        </div>
    )
}