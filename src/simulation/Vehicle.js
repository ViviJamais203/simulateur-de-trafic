export class Vehicle{
    constructor(id, road, direction, speed){
        this.id = id
        this.road = road
        this.direction = direction
        this.progress = 0
        this.speed = speed

        if (direction == 'AtoB') {
            road.vehiclesAtoB.push(this)
        }
        else {
            road.vehiclesBtoA.push(this)
        }
    }

    update(deltaTime) {
        this.progress += this.speed * deltaTime
    }

    hasReachedEnd() {
        return this.progress >= this.road.length
    }

    handleEndOfRoad(intersection) {
        if (this.direction == 'AtoB') {
            const idx = this.road.vehiclesAtoB.indexOf(this)
            this.road.vehiclesAtoB.splice(idx, 1)

            const otherRoads = intersection.roads.filter(r => r !== this.road)
            const newRoad = otherRoads[Math.floor(Math.random() * otherRoads.length)]

            this.road = newRoad
            this.direction = 'BtoA'
            this.progress = 0
            newRoad.vehiclesBtoA.push(this)

            return true
        }
        else {
            const idx = this.road.vehiclesBtoA.indexOf(this)
            this.road.vehiclesBtoA.splice(idx, 1)
            return false
        }
    }

    getScreenPosition() {
        const {start, end} = this.road
        const length = this.road.length

        let t
        if (this.direction == 'AtoB'){
            t = this.progress / length
        }
        else {
            t = 1 - (this.progress / length)
        }

        const x = start.x + (end.x - start.x) * t
        const y = start.y + (end.y - start.y) * t

        return {x, y}
    }
}