/**
 * @module petiteVille
 * @description Constructeur du réseau "Petite Ville" : une intersection à 4 branches (N, S, E, O).
 */

import { Intersection } from '../simulation/Intersection.js'
import { Road } from '../simulation/Road.js'

/**
 * Construit le réseau routier "Petite Ville" :
 * une intersection centrale à 4 branches (Nord, Sud, Est, Ouest).
 * Chaque route fait environ 500px de long et la limitation de vitesse est fixée à 50 km/h.
 * @param {number} lightCycle - Durée du cycle de feu vert (en secondes).
 * @returns {{ intersections: Intersection[], roads: Road[] }} Le réseau prêt à simuler.
 */
export function buildPetiteVille(lightCycle) {
    const CENTER_X = 400
    const CENTER_Y = 300
    const INTERSECTION_SIZE = 100

    const intersection = new Intersection('carrefour', CENTER_X, CENTER_Y, lightCycle)

    const roads = [
        new Road('route-nord',  CENTER_X, 50,  CENTER_X, CENTER_Y - INTERSECTION_SIZE / 2, 50),
        new Road('route-sud',   CENTER_X, 550, CENTER_X, CENTER_Y + INTERSECTION_SIZE / 2, 50),
        new Road('route-est',   750, CENTER_Y, CENTER_X + INTERSECTION_SIZE / 2, CENTER_Y, 50),
        new Road('route-ouest', 50,  CENTER_Y, CENTER_X - INTERSECTION_SIZE / 2, CENTER_Y, 50)
    ]

    roads.forEach(road => intersection.addRoad(road))
    intersection.initTrafficLights()

    return {
        intersections: [intersection],
        roads
    }
}
