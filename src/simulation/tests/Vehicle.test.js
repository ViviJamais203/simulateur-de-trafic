import { describe, it, expect } from 'vitest'
import { Road } from '../Road.js'
import { Vehicle } from '../Vehicle.js'
import { Intersection } from '../Intersection.js'

describe('Vehicle.update — TC-VEH-02 : avancement sur route libre', () => {
    it('avance de speed * deltaTime quand la route est libre et sans feu', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const vehicle = new Vehicle(0, road, 'AtoB', 10)

        vehicle.update(0.1)

        expect(vehicle.progress).toBeCloseTo(1.0, 2)
    })

    it('cumule la progression sur plusieurs appels', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const vehicle = new Vehicle(0, road, 'AtoB', 10)

        vehicle.update(0.1)
        vehicle.update(0.1)
        vehicle.update(0.1)

        expect(vehicle.progress).toBeCloseTo(3.0, 2)
    })

    it('la vitesse courante est égale à la vitesse max sur route libre', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const vehicle = new Vehicle(0, road, 'AtoB', 20)

        vehicle.update(0.1)

        expect(vehicle.currentSpeed).toBe(20)
    })
})

describe('Vehicle.computeSpeedFactor — TC-VEH-04 : détection de proximité', () => {
    it('retourne 0 quand un véhicule est devant à moins de SAFE_DISTANCE (20)', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const v1 = new Vehicle(0, road, 'AtoB', 10)
        v1.progress = 110
        const v2 = new Vehicle(1, road, 'AtoB', 10)
        v2.progress = 100

        const factor = v2.computeSpeedFactor()

        expect(factor).toBe(0)
    })

    it('retourne 1 quand le véhicule devant est à plus de BRAKING_DISTANCE (60)', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const v1 = new Vehicle(0, road, 'AtoB', 10)
        v1.progress = 200
        const v2 = new Vehicle(1, road, 'AtoB', 10)
        v2.progress = 100

        const factor = v2.computeSpeedFactor()

        expect(factor).toBe(1)
    })

    it('retourne une valeur entre 0 et 1 dans la zone de freinage', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const v1 = new Vehicle(0, road, 'AtoB', 10)
        v1.progress = 140 // distance = 40, entre SAFE (20) et BRAKING (60)
        const v2 = new Vehicle(1, road, 'AtoB', 10)
        v2.progress = 100

        const factor = v2.computeSpeedFactor()

        expect(factor).toBeGreaterThan(0)
        expect(factor).toBeLessThan(1)
        expect(factor).toBeCloseTo(0.5, 1) // (40-20)/(60-20) = 0.5
    })

    it('retourne 1 quand il n\'y a personne devant ni feu rouge', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const vehicle = new Vehicle(0, road, 'AtoB', 10)

        const factor = vehicle.computeSpeedFactor()

        expect(factor).toBe(1)
    })
})

describe('Vehicle.getDistanceToRedLight — comportement aux feux', () => {
    it('s\'arrête (factor=0) quand un feu rouge est à moins de SAFE_DISTANCE', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const intersection = new Intersection('i1', 1000, 0, 10)
        intersection.addRoad(road)
        intersection.initTrafficLights()
        // initTrafficLights met le premier feu en vert, on force tout en rouge :
        intersection.lights.forEach(l => l.setRed())

        const vehicle = new Vehicle(0, road, 'AtoB', 10)
        vehicle.progress = 990 // distance au feu = 10 < 20

        expect(vehicle.computeSpeedFactor()).toBe(0)
    })

    it('passe normalement (factor=1) quand le feu est vert', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const intersection = new Intersection('i1', 1000, 0, 10)
        intersection.addRoad(road)
        intersection.initTrafficLights() // premier feu en vert par défaut

        const vehicle = new Vehicle(0, road, 'AtoB', 10)
        vehicle.progress = 990

        expect(vehicle.computeSpeedFactor()).toBe(1)
    })
})