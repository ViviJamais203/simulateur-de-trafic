/**
 * @module SimulationCanvas
 * @description Composant React gérant le rendu canvas et la boucle d'animation de la simulation.
 */

import { useRef, useEffect } from "react";
import { buildPetiteVille } from '../networks/petiteVille.js'
import { buildCarrefourMort } from "../networks/carrefourMort.js";
import { Simulation } from '../simulation/Simulation.js'
import { render } from '../simulation/renderer.js'

/**
 * Composant React qui initialise et anime la simulation de trafic sur un canvas HTML.
 *
 * Gère :
 * - La construction du réseau routier selon le réseau sélectionné.
 * - La boucle d'animation via `requestAnimationFrame`.
 * - L'application de la vitesse de simulation via une ref pour éviter
 *   de redémarrer la boucle à chaque changement de `simulationSpeed`.
 * - La mise à jour des statistiques à une fréquence de `1000 / simulationSpeed` ms.
 * - La notification du composant parent lors d'un blocage de routes ou de la fin de simulation.
 *
 * @param {Object} props
 * @param {'option1'|'option2'} props.checkedNetwork - Réseau sélectionné ('option1' = Petite Ville, 'option2' = Carrefour Mort).
 * @param {number} props.vehicleRange - Nombre total de véhicules à simuler.
 * @param {number} props.speedRange - Vitesse maximale des véhicules (en km/h).
 * @param {number} props.lightRange - Durée du cycle de feu vert (en secondes).
 * @param {number} props.spawnRange - Intervalle d'apparition des véhicules (en secondes).
 * @param {number} props.simulationSpeed - Multiplicateur de vitesse de simulation (ex. 0.5, 1, 2, 4).
 * @param {Function} [props.onFinish] - Callback déclenché à la fin de la simulation.
 * @param {Function} [props.onRoadsBlocked] - Callback déclenché lorsque toutes les routes sont saturées.
 * @param {Function} [props.onStatistics] - Callback de mise à jour des statistiques.
 * @returns {JSX.Element} Un élément `<canvas>` de 800×600 pixels.
 */
export function SimulationCanvas({
    checkedNetwork,
    vehicleRange,
    speedRange,
    lightRange,
    spawnRange,
    simulationSpeed,
    onFinish,
    onRoadsBlocked,
    onStatistics
}) {
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

        const interval = setInterval(() => {
            onStatistics?.(simulation.statistics)
        }, 1000 / simulationSpeed)

        const loop = (currentTime) => {
            const deltaTime = (currentTime - lastTime) / 1000
            lastTime = currentTime
            simulation.step(deltaTime * speedRef.current)
            render(ctx, network, simulation.vehicles, simulation.congestionZones)
            if (simulation.allRoadsBlocked !== wasBlocked) {
                wasBlocked = simulation.allRoadsBlocked
                onRoadsBlockedRef.current?.(wasBlocked)
            }
            rafId = requestAnimationFrame(loop)
        }

        rafId = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(rafId)
            clearInterval(interval)
        }
    }, [])

    return <canvas ref={canvasRef} width={800} height={600} />
}

export default function StatisticsPanel({ statistics }) {
    return (
        <div>
            <p>Véhicules actifs : {statistics?.activeVehicles ?? 0}</p>
            <p>Vitesse moyenne : {statistics?.averageSpeed ?? 0} km/h</p>
        </div>
    )
}
