import { Vehicle } from "./Vehicle";

export class Simulation{
    constructor(network, spawnLimit, spawnInterval, maxSpeed){
        this.network = network
        this.vehicles = []
        this.vehicleSpawned = 0
        this.nextVehicleId = 0
        this.spawnLimit = spawnLimit
        this.spawnTimer = 0
        this.spawnInterval = spawnInterval
        this.maxSpeed = maxSpeed
    }

    spawnVehicle(){
        if (this.vehicleSpawned >= this.spawnLimit) {
            console.log(this.vehicleSpawned + "/" + this.spawnLimit)
            return
        }
        const roads = this.network.roads
        const road = roads[Math.floor(Math.random() * roads.length)]

        const vehicle = new Vehicle(this.nextVehicleId++, road, 'AtoB', this.maxSpeed)
        this.vehicles.push(vehicle)
        this.vehicleSpawned++
    }

    step(deltaTime){
        this.network.intersections.forEach(intersection => intersection.update(deltaTime))

        this.spawnTimer += deltaTime
        if(this.spawnTimer >= this.spawnInterval){
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
    }
}