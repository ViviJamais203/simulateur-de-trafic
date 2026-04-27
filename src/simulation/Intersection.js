export class Intersection {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.roads = []
        this.trafficLight = null
    }
    
    addRoad(road) {
        this.roads.push(road)
    }
}