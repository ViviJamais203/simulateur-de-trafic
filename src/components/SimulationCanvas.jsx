import { useRef, useEffect } from "react";
import { buildPetiteVille } from '../networks/petiteVille.js'
import { buildCarrefourMort } from "../networks/carrefourMort.js";
import { Simulation } from '../simulation/Simulation.js'
import { render } from '../simulation/renderer.js'

export function SimulationCanvas({
    checkedNetwork,
    vehicleRange,
    speedRange,
    lightRange,
    spawnRange,
    simulationSpeed,
    onFinish,
    onRoadsBlocked }) {

    const canvasRef = useRef(null)
    const speedRef = useRef(simulationSpeed)
    const onRoadsBlockedRef = useRef(onRoadsBlocked)

    useEffect(() => {
        speedRef.current = simulationSpeed
    }, [simulationSpeed])

    useEffect(() => {
        onRoadsBlockedRef.current = onRoadsBlocked
    }, [onRoadsBlocked])

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const network = checkedNetwork == "option1" ? buildPetiteVille(lightRange) : buildCarrefourMort(lightRange)
        const simulation = new Simulation(network, vehicleRange, spawnRange, speedRange, () => onFinish?.())

        let lastTime = performance.now()
        let rafId
        let wasBlocked = false

        const loop = (currentTime) => {
            const deltaTime = (currentTime - lastTime) / 1000
            lastTime = currentTime

            simulation.step(deltaTime * speedRef.current)
            render(ctx, network, simulation.vehicles)

            if (simulation.allRoadsBlocked !== wasBlocked) {
                wasBlocked = simulation.allRoadsBlocked
                onRoadsBlockedRef.current?.(wasBlocked)
            }

            rafId = requestAnimationFrame(loop)
        }

        rafId = requestAnimationFrame(loop)

        return () => cancelAnimationFrame(rafId)
    }, [])

    return <canvas ref={canvasRef} width={800} height={600} />
}