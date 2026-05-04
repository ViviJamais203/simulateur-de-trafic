import { TrafficLight } from "./TrafficLight"

export class Intersection {
    constructor(id, x, y, cycleDuration) {
        this.id = id
        this.x = x
        this.y = y
        this.roads = []
        this.lights = []
        this.cycleDuration = cycleDuration
        this.currentGreenIndex  = 0
        this.elapsedTime = 0
    }
    
    addRoad(road) {
        this.roads.push(road)
        road.endIntersection = this
    }

    initTrafficLights() {
        this.roads = sortRoadsClockwise(this.roads, this.x, this.y)
        this.lights = this.roads.map(road => new TrafficLight(road))
        if (this.lights.length > 0){
            this.lights[0].setGreen()
        }
    }

    update(deltaTime) {
        if (this.lights.length == 0) return
        this.elapsedTime += deltaTime
        if (this.elapsedTime >= this.cycleDuration) {
            this.elapsedTime -= this.cycleDuration
            this.lights[this.currentGreenIndex].setRed()
            this.currentGreenIndex = (this.currentGreenIndex + 1) % this.lights.length
            this.lights[this.currentGreenIndex].setGreen()
        }
    }

    getLightForRoad(road) {
        return this.lights.find(l => l.road == road)
    }
}

function sortRoadsClockwise(roads, cx, cy) {
    return [...roads]
        .map(road => {
            const otherX = (road.end.x == cx && road.end.y == cy) ? road.start.x : road.end.x
            const otherY = (road.end.x == cx && road.end.y == cy) ? road.start.y : road.end.y
            const angle = Math.atan2(otherY - cy, otherX - cx)
            return { road, angle }
        })
        .sort((a, b) => a.angle - b.angle)
        .map(({ road }) => road)
}