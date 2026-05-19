/**
 * @module Simulation
 * @description Module principal du moteur de simulation de trafic.
 */

import { Vehicle } from "./Vehicle";

/**
 * Représente la simulation de trafic complète.
 * Gère le cycle de vie des véhicules, les feux de circulation,
 * la détection des embouteillages et les statistiques en temps réel.
 */
export class Simulation {
    /**
     * Crée une nouvelle instance de simulation.
     * @param {{ roads: Road[], intersections: Intersection[] }} network - Le réseau routier à simuler.
     * @param {number|string} spawnLimit - Nombre total de véhicules à faire circuler avant de terminer.
     * @param {number|string} spawnInterval - Intervalle de temps (en secondes) entre chaque apparition de véhicule.
     * @param {number|string} maxSpeed - Vitesse maximale des véhicules (en km/h).
     * @param {Function} [onFinish] - Callback appelé lorsque la simulation est terminée.
     */
    constructor(network, spawnLimit, spawnInterval, maxSpeed, onFinish) {
        this.network = network
        this.vehicles = []
        this.vehicleSpawned = 0
        this.nextVehicleId = 0
        this.spawnLimit = parseInt(spawnLimit)
        this.spawnTimer = 0
        this.spawnInterval = parseFloat(spawnInterval)
        this.maxSpeed = parseFloat(maxSpeed)
        this.onFinish = onFinish
        this.finished = false
        this.allRoadsBlocked = false
        this.statisticsTimer = 0
        this.statisticsInterval = 0.5
        this.congestionZones = new Map()
        this.statistics = { activeVehicles: 0, averageSpeed: 0, congestionZones: [] }
    }

    /**
     * Tente de faire apparaître un nouveau véhicule sur une route aléatoire.
     * Si la limite de véhicules est atteinte ou si la route choisie est pleine,
     * l'apparition est annulée. Met à jour `allRoadsBlocked` si toutes les routes sont saturées.
     */
    spawnVehicle() {
        if (this.vehicleSpawned >= this.spawnLimit) {
            this.allRoadsBlocked = false
            return
        }
        const roads = this.network.roads
        const road = roads[Math.floor(Math.random() * roads.length)]

        if (road.isFull()) {
            this.allRoadsBlocked = roads.every(r => r.isFull())
            return
        }

        this.allRoadsBlocked = false
        const vehicle = new Vehicle(this.nextVehicleId++, road, 'AtoB', this.maxSpeed)
        this.vehicles.push(vehicle)
        this.vehicleSpawned++
    }

    /**
     * Avance la simulation d'un pas de temps.
     * Met à jour les intersections, fait apparaître les véhicules selon le timer,
     * déplace tous les véhicules, retire ceux qui ont quitté le réseau,
     * et déclenche la fin de simulation si toutes les conditions sont remplies.
     * @param {number} deltaTime - Temps écoulé depuis le dernier pas (en secondes).
     */
    step(deltaTime) {
        if (this.finished)
            return
        this.network.intersections.forEach(intersection => intersection.update(deltaTime))

        this.spawnTimer += deltaTime
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer -= this.spawnInterval
            this.spawnVehicle()
        }

        const survivors = []
        this.vehicles.forEach(vehicle => {
            vehicle.update(deltaTime)

            if (vehicle.hasReachedEnd()) {
                const intersection = vehicle.road.endIntersection
                const stillAlive = vehicle.handleEndOfRoad(intersection)
                if (stillAlive) {
                    survivors.push(vehicle)
                }
            }
            else {
                survivors.push(vehicle)
            }
        });
        this.vehicles = survivors


        if (this.vehicleSpawned >= this.spawnLimit && survivors.length < 1) {
            this.handleSimulationFinished()
        }

        this.updateCongestionZones(deltaTime)

        this.statisticsTimer += deltaTime
        if (this.statisticsTimer >= this.statisticsInterval){
            this.statisticsTimer = 0
            this.updateStatistics()
        }
    }

    /**
     * Détecte et met à jour les zones de congestion sur chaque tronçon.
     * Une congestion est détectée lorsqu'au moins 2 véhicules en état `on_road`
     * ont une vitesse inférieure à 15 % de la vitesse maximale.
     * La zone est caractérisée par la progression minimale et maximale des véhicules arrêtés.
     * @param {number} deltaTime - Temps écoulé depuis le dernier pas (en secondes),
     *   utilisé pour incrémenter la durée des zones existantes.
     */
    updateCongestionZones(deltaTime) {
        const threshold = this.maxSpeed * 0.15

        this.network.roads.forEach(road => {
            for (const direction of ['AtoB', 'BtoA']) {
                const key = `${road.id}-${direction}`
                const list = direction === 'AtoB' ? road.vehiclesAtoB : road.vehiclesBtoA
                const stopped = list.filter(v => v.state === 'on_road' && v.currentSpeed < threshold)

                if (stopped.length >= 2) {
                    const progresses = stopped.map(v => v.progress)
                    const minProgress = Math.min(...progresses)
                    const maxProgress = Math.max(...progresses)

                    if (this.congestionZones.has(key)) {
                        const zone = this.congestionZones.get(key)
                        zone.duration += deltaTime
                        zone.minProgress = minProgress
                        zone.maxProgress = maxProgress
                    } else {
                        this.congestionZones.set(key, { road, direction, duration: 0, minProgress, maxProgress })
                    }
                } else {
                    this.congestionZones.delete(key)
                }
            }
        })
    }

    /**
     * Calcule et met à jour les statistiques de la simulation.
     * Détermine la vitesse moyenne des véhicules actifs et la position centrale
     * de chaque zone de congestion en interpolant le long de la route.
     * @returns {{ activeVehicles: number, averageSpeed: number, congestionZones: Array }} Statistiques actuelles.
     */
    updateStatistics() {
        let totalSpeed = 0
        this.vehicles.forEach(vehicle => totalSpeed += vehicle.currentSpeed)


        const averageSpeed = this.vehicles.length > 0
            ? Math.round(totalSpeed / this.vehicles.length * 100) / 100
            : 0
        const congestionZones = Array.from(this.congestionZones.values()).map(z => {
            const mid = (z.minProgress + z.maxProgress) / 2
            const t = mid / z.road.length
            const centerX = z.road.start.x + (z.road.end.x - z.road.start.x) * t
            const centerY = z.road.start.y + (z.road.end.y - z.road.start.y) * t
            return { roadId: z.road.id, direction: z.direction, duration: z.duration, centerX, centerY }
        })

        this.statistics = { activeVehicles: this.vehicles.length, averageSpeed, congestionZones }
        return this.statistics
    }

    /**
     * Marque la simulation comme terminée et déclenche le callback `onFinish`.
     * Réinitialise les statistiques affichées à zéro.
     */
    handleSimulationFinished() {
        this.statistics = { activeVehicles: 0, averageSpeed: 0}
        this.finished = true
        this.onFinish?.()
    }
}
