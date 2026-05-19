/**
 * @module Road
 * @description Module représentant un tronçon routier bidirectionnel.
 */

/**
 * Représente un tronçon routier bidirectionnel.
 * Chaque route maintient deux files de véhicules (AtoB et BtoA) et une capacité maximale
 * calculée automatiquement selon sa longueur (1 place tous les 30px).
 */
export class Road {
    /**
     * Crée un nouveau tronçon routier.
     * @param {string} id - Identifiant unique de la route.
     * @param {number} startX - Coordonnée X du point de départ.
     * @param {number} startY - Coordonnée Y du point de départ.
     * @param {number} endX - Coordonnée X du point d'arrivée.
     * @param {number} endY - Coordonnée Y du point d'arrivée.
     * @param {number} speedLimit - Vitesse limite sur ce tronçon (en km/h).
     */
    constructor(id, startX, startY, endX, endY, speedLimit) {
        this.id = id
        this.start = { x: startX, y: startY }
        this.end = { x: endX, y: endY }
        this.speedLimit = speedLimit
        this.length = this.calculateLength()
        this.vehiclesAtoB = []
        this.vehiclesBtoA = []
        this.maxVehicles = Math.floor(this.length / 30)
    }

    /**
     * Vérifie si la route a atteint sa capacité maximale de véhicules (toutes voies confondues).
     * La capacité maximale est `floor(longueur / 30)`.
     * @returns {boolean} `true` si la route est saturée.
     */
    isFull() {
        return (this.vehiclesAtoB.length + this.vehiclesBtoA.length) >= this.maxVehicles
    }

    /**
     * Calcule la longueur euclidienne du tronçon en pixels.
     * @returns {number} Longueur du tronçon (en pixels).
     */
    calculateLength() {
        const dx = this.end.x - this.start.x
        const dy = this.end.y - this.start.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    /**
     * Recherche le véhicule immédiatement devant le véhicule donné sur la même voie.
     * La comparaison porte sur les valeurs de `progress` : le plus proche ayant
     * une progression supérieure est considéré comme étant "devant".
     * @param {Vehicle} vehicle - Le véhicule pour lequel chercher un obstacle devant.
     * @returns {{ vehicle: Vehicle, distance: number }|null} L'objet contenant le véhicule
     *   le plus proche et sa distance en pixels, ou `null` s'il n'y a personne devant.
     */
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
