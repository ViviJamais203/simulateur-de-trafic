import { Road } from "../simulation/Road"
import { Intersection } from "../simulation/Intersection"

export function buildCarrefourMort() {
    const CENTER_X = 400
    const CENTER_Y = 300
    const ROAD_LENGTH = 280
    
    const carrefour = new Intersection('carrefour', CENTER_X, CENTER_Y)
    
    const roads = []
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i
        const startX = CENTER_X + Math.cos(angle) * ROAD_LENGTH
        const startY = CENTER_Y + Math.sin(angle) * ROAD_LENGTH
        
        roads.push(new Road(`route-${i}`, startX, startY, CENTER_X, CENTER_Y, 50))
    }
    
    roads.forEach(road => carrefour.addRoad(road))
    
    return {
        intersections: [carrefour],
        roads
    }
}