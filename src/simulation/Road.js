export class Road{
    constructor(id, intersectionA, intersectionB, speedLimit) {
        this.id = id
        this.intersectionA = intersectionA
        this.intersectionB = intersectionB
        this.speedLimit = speedLimit

        this.length = this.calculateLength()

        this.vehiclesAtoB = [];
        this.vehiclesBtoA = [];
    }

    calculateLength() {
        const dx = this.intersectionB.x - this.intersectionA.x
        const dy = this.intersectionB.y - this.intersectionA.y
        return Math.sqrt(dx * dx + dy * dy)
    }
}