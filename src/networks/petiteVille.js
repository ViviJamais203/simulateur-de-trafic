import { Intersection } from "../simulation/Intersection";
import { Road } from "../simulation/Road";

export function buildPetiteVille(speedLimit) {
    const center = new Intersection('center', 400, 300)
    const north = new Intersection('north', 400, 100)
    const south = new Intersection('south', 400, 500)
    const east = new Intersection('east', 700, 300)
    const west = new Intersection('west', 100, 300)

    const intersections = [center, north, south, east, west]

    const roads = [
        new Road('r-n', center, north, speedLimit),
        new Road('r-s', center, south, speedLimit),
        new Road('r-e', center, east, speedLimit),
        new Road('r-w', center, west, speedLimit)
    ]

    roads.forEach(road => {
        road.intersectionA.addRoad(road)
        road.intersectionB.addRoad(road)
    })

    return {intersections, roads}
}