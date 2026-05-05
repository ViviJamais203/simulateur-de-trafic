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
        this.congestionZones = new Map()
        this.statistics = { activeVehicles: 0, averageSpeed: 0, congestionZones: [] }
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

        this.updateCongestionZones(deltaTime)

        this.statisticsTimer += deltaTime
        if (this.statisticsTimer >= this.statisticsInterval){
            this.statisticsTimer = 0
            this.updateStatistics()
        }
    }

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

    handleSimulationFinished() {
        this.statistics = { activeVehicles: 0, averageSpeed: 0}
        this.finished = true
        this.onFinish?.()
    }
}