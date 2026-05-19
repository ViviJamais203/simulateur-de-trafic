/**
 * @module carrefourMort
 * @description Constructeur du réseau "Carrefour Mort" : une intersection hexagonale à 6 branches.
 */

import { Road } from "../simulation/Road"
import { Intersection } from "../simulation/Intersection"

/**
 * Construit le réseau routier "Carrefour Mort" :
 * une intersection hexagonale centrale avec 6 routes réparties régulièrement tous les 60°.
 * Chaque route fait 280px de long et la limitation de vitesse est fixée à 50 km/h.
 * L'extrémité interne de chaque route rejoint le bord de l'hexagone (inradius ≈ 86.6px).
 * @param {number} lightCycle - Durée du cycle de feu vert (en secondes).
 * @returns {{ intersections: Intersection[], roads: Road[] }} Le réseau prêt à simuler.
 */
export function buildCarrefourMort(lightCycle) {
    const CENTER_X = 400
    const CENTER_Y = 300
    const ROAD_LENGTH = 280
    const HEX_RADIUS = 100
    const INRADIUS = HEX_RADIUS * Math.sqrt(3) / 2

    const carrefour = new Intersection('carrefour', CENTER_X, CENTER_Y, lightCycle)
    carrefour.shape = 'hexagon'
    carrefour.shapeRadius = HEX_RADIUS

    const roads = []
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i
        const startX = CENTER_X + Math.cos(angle) * ROAD_LENGTH
        const startY = CENTER_Y + Math.sin(angle) * ROAD_LENGTH
        const endX = CENTER_X + Math.cos(angle) * INRADIUS
        const endY = CENTER_Y + Math.sin(angle) * INRADIUS

        roads.push(new Road(`route-${i}`, startX, startY, endX, endY, 50))
    }

    roads.forEach(road => carrefour.addRoad(road))
    carrefour.initTrafficLights()

    return {
        intersections: [carrefour],
        roads
    }
}
