import { describe, it, expect } from 'vitest'
import { Simulation } from '../Simulation.js'
import { buildPetiteVille } from '../../networks/petiteVille.js'

describe('Simulation — TC-OBS-03 : calcul de la vitesse moyenne', () => {
    it('retourne 0 quand il n\'y a aucun véhicule', () => {
        const network = buildPetiteVille(10)
        const sim = new Simulation(network, 10, 1, 50)

        const stats = sim.updateStatistics()

        expect(stats.averageSpeed).toBe(0)
        expect(stats.activeVehicles).toBe(0)
    })

    it('calcule correctement la moyenne avec plusieurs véhicules', () => {
        const network = buildPetiteVille(10)
        const sim = new Simulation(network, 10, 1, 50)

        // Force quelques véhicules avec des vitesses connues
        sim.vehicles = [
            { currentSpeed: 10 },
            { currentSpeed: 20 },
            { currentSpeed: 30 }
        ]

        const stats = sim.updateStatistics()

        expect(stats.averageSpeed).toBe(20)
        expect(stats.activeVehicles).toBe(3)
    })

    it('arrondit la moyenne au centième', () => {
        const network = buildPetiteVille(10)
        const sim = new Simulation(network, 10, 1, 50)

        sim.vehicles = [
            { currentSpeed: 10 },
            { currentSpeed: 10 },
            { currentSpeed: 11 }
        ]

        const stats = sim.updateStatistics()

        expect(stats.averageSpeed).toBe(10.33)
    })
})

describe('Simulation.spawnVehicle — apparition des véhicules', () => {
    it('crée un nouveau véhicule tant que la limite n\'est pas atteinte', () => {
        const network = buildPetiteVille(10)
        const sim = new Simulation(network, 5, 1, 50)

        sim.spawnVehicle()
        sim.spawnVehicle()
        sim.spawnVehicle()

        expect(sim.vehicleSpawned).toBe(3)
        expect(sim.vehicles.length).toBe(3)
    })

    it('ne crée pas de véhicule au-delà de la limite', () => {
        const network = buildPetiteVille(10)
        const sim = new Simulation(network, 2, 1, 50)

        sim.spawnVehicle()
        sim.spawnVehicle()
        sim.spawnVehicle() // tentative au-delà

        expect(sim.vehicleSpawned).toBe(2)
        expect(sim.vehicles.length).toBe(2)
    })
})

describe('Simulation.step — boucle principale', () => {
    it('met à jour les feux des intersections à chaque pas', () => {
        const network = buildPetiteVille(2)
        const sim = new Simulation(network, 0, 100, 50) // spawnInterval grand → pas de spawn parasite

        const initialGreenIndex = network.intersections[0].currentGreenIndex

        // Avance suffisamment pour forcer une transition de feu
        for (let i = 0; i < 100; i++) {
            sim.step(0.05) // total : 5 s, > cycle de 2 s
        }

        // L'intersection a forcément changé d'état au moins une fois
        expect(network.intersections[0].elapsedTime).toBeGreaterThan(0)
    })

    it('arrête la simulation quand tous les véhicules ont quitté', () => {
        const network = buildPetiteVille(10)
        let finishCalled = false
        const sim = new Simulation(network, 1, 0.5, 50, () => { finishCalled = true })

        // Force la fin manuellement (cas pathologique)
        sim.vehicleSpawned = 1
        sim.vehicles = []
        sim.step(0.1)

        expect(finishCalled).toBe(true)
        expect(sim.finished).toBe(true)
    })
})