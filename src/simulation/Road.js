export class Road {
    constructor(id, startX, startY, endX, endY, speedLimit) {
        this.id = id
        this.start = { x: startX, y: startY }
        this.end = { x: endX, y: endY }
        this.speedLimit = speedLimit
        this.length = this.calculateLength()
        this.vehiclesAtoB = []
        this.vehiclesBtoA = []
    }
    
    calculateLength() {
        const dx = this.end.x - this.start.x
        const dy = this.end.y - this.start.y
        return Math.sqrt(dx * dx + dy * dy)
    }
}