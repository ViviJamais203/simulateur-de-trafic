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

    // Retourne le véhicule devant `vehicle` sur la même voie, et la distance qui les sépare.
    // Retourne null s'il n'y a personne devant.
    getVehicleAhead(vehicle) {
        const list = vehicle.direction === 'AtoB' ? this.vehiclesAtoB : this.vehiclesBtoA
        let closest = null
        let closestDistance = Infinity
        list.forEach(other => {
            if (other === vehicle) return
            const distance = other.progress - vehicle.progress
            if (distance > 0 && distance < closestDistance) {
                closest = other
                closestDistance = distance
            }
        })
        return closest ? { vehicle: closest, distance: closestDistance } : null
    }
}