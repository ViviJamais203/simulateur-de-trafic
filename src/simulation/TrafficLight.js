/**
 * @module TrafficLight
 * @description Module représentant un feu de circulation.
 */

/**
 * Représente un feu de circulation associé à une route d'entrée d'intersection.
 * L'état initial est toujours rouge ; c'est l'intersection qui l'active au vert.
 */
export class TrafficLight {
    /**
     * Crée un nouveau feu de circulation, initialement au rouge.
     * @param {Road} road - La route d'entrée contrôlée par ce feu.
     */
    constructor(road) {
        this.road = road
        this.state = 'red'
    }

    /** Passe le feu au vert. */
    setGreen() {this.state = 'green'}

    /** Passe le feu au rouge. */
    setRed() {this.state = 'red'}

    /**
     * Indique si le feu est actuellement au vert.
     * @returns {boolean} `true` si le feu est vert.
     */
    isGreen() {return this.state == 'green'}
}
