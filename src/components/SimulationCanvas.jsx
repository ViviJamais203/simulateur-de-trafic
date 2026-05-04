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
    spawnRange }) {

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const network = checkedNetwork == "option1" ? buildPetiteVille(lightRange) : buildCarrefourMort(lightRange)
        const simulation = new Simulation(network, vehicleRange, spawnRange, speedRange)

        let lastTime = performance.now()
        let rafId

        const loop = (currentTime) => {
            const deltaTime = (currentTime - lastTime) / 1000
            lastTime = currentTime

            simulation.step(deltaTime)
            render(ctx, network, simulation.vehicles)

            rafId = requestAnimationFrame(loop)
        }

        rafId = requestAnimationFrame(loop)

        return () => cancelAnimationFrame(rafId)
    }, [])

    return <canvas ref={canvasRef} width={800} height={600} />
}