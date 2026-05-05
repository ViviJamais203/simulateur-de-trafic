import { Vehicle } from "./Vehicle";

export class Simulation {
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
        this.statistics = { activeVehicles: 0, averageSpeed: 0 }
    }

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

        this.statisticsTimer += deltaTime
        if (this.statisticsTimer >= this.statisticsInterval){
            this.statisticsTimer = 0
            this.updateStatistics()
        }
    }

    updateStatistics() {
        let totalSpeed = 0
        this.vehicles.forEach(vehicle => totalSpeed += vehicle.currentSpeed)

        console.log("vehicles.length:", this.vehicles.length, "| totalSpeed:", totalSpeed)

        const averageSpeed = this.vehicles.length > 0
            ? Math.round(totalSpeed / this.vehicles.length * 100) / 100
            : 0
        this.statistics = { activeVehicles: this.vehicles.length, averageSpeed }
        console.log(this.statistics)
        return this.statistics
    }

    handleSimulationFinished() {
        this.statistics = { activeVehicles: 0, averageSpeed: 0}
        this.finished = true
        this.onFinish?.()
    }
}