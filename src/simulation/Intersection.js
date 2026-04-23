export class Intersection {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y

        this.trafficLight = null
        
        this.roads = []
    }

    addRoad(road) {
        this.roads.push(road)
    }
}