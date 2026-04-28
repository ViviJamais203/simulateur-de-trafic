import { Intersection } from '../simulation/Intersection.js'
import { Road } from '../simulation/Road.js'

export function buildPetiteVille() {
    const CENTER_X = 400
    const CENTER_Y = 300
    const INTERSECTION_SIZE = 100
    
    const intersection = new Intersection('carrefour', CENTER_X, CENTER_Y)
    
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