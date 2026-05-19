import { describe, it, expect } from 'vitest'
import { Road } from '../Road.js'
import { Vehicle } from '../Vehicle.js'

describe('Road.calculateLength', () => {
    it('calcule correctement la distance euclidienne entre start et end', () => {
        const road = new Road('r1', 0, 0, 300, 400, 50)
        expect(road.length).toBe(500) // triangle 3-4-5
    })

    it('renvoie 0 pour une route de longueur nulle', () => {
        const road = new Road('r1', 100, 100, 100, 100, 50)
        expect(road.length).toBe(0)
    })
})

describe('Road.isFull — capacité', () => {
    it('n\'est pas pleine quand elle est vide', () => {
        const road = new Road('r1', 0, 0, 300, 0, 50) // maxVehicles = 10
        expect(road.isFull()).toBe(false)
    })

    it('est pleine quand le nombre de véhicules atteint maxVehicles', () => {
        const road = new Road('r1', 0, 0, 300, 0, 50) // maxVehicles = 10
        for (let i = 0; i < 10; i++) {
            new Vehicle(i, road, 'AtoB', 10)
        }
        expect(road.isFull()).toBe(true)
    })
})

describe('Road.getVehicleAhead — TC-VEH-04', () => {
    it('retourne le véhicule le plus proche devant, avec la bonne distance', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const v1 = new Vehicle(0, road, 'AtoB', 10)
        v1.progress = 200
        const v2 = new Vehicle(1, road, 'AtoB', 10)
        v2.progress = 150
        const v3 = new Vehicle(2, road, 'AtoB', 10)
        v3.progress = 100

        const result = road.getVehicleAhead(v3)

        expect(result).not.toBeNull()
        expect(result.vehicle).toBe(v2)
        expect(result.distance).toBe(50)
    })

    it('retourne null s\'il n\'y a personne devant', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const v1 = new Vehicle(0, road, 'AtoB', 10)
        v1.progress = 100

        const result = road.getVehicleAhead(v1)

        expect(result).toBeNull()
    })

    it('ignore les véhicules en sens inverse', () => {
        const road = new Road('r1', 0, 0, 1000, 0, 50)
        const v1 = new Vehicle(0, road, 'BtoA', 10)
        v1.progress = 200
        const v2 = new Vehicle(1, road, 'AtoB', 10)
        v2.progress = 100

        const result = road.getVehicleAhead(v2)

        expect(result).toBeNull()
    })
})