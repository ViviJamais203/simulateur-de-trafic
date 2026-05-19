import { describe, it, expect } from 'vitest'
import { Road } from '../Road.js'
import { Intersection } from '../Intersection.js'

describe('Intersection — TC-FEU-02 : un seul feu vert à la fois', () => {
    it('n\'a jamais plus d\'un feu vert sur une intersection à 4 routes', () => {
        const cx = 400, cy = 300
        const intersection = new Intersection('i1', cx, cy, 5)
        intersection.addRoad(new Road('nord', cx, 50, cx, cy - 50, 50))
        intersection.addRoad(new Road('sud', cx, 550, cx, cy + 50, 50))
        intersection.addRoad(new Road('est', 750, cy, cx + 50, cy, 50))
        intersection.addRoad(new Road('ouest', 50, cy, cx - 50, cy, 50))
        intersection.initTrafficLights()

        for (let i = 0; i < 1000; i++) {
            intersection.update(0.05) // total simulé : 50 s, > plusieurs cycles
            const greenCount = intersection.lights.filter(l => l.isGreen()).length
            expect(greenCount).toBeLessThanOrEqual(1)
        }
    })

    it('a exactement un feu vert au démarrage après initTrafficLights', () => {
        const cx = 400, cy = 300
        const intersection = new Intersection('i1', cx, cy, 5)
        intersection.addRoad(new Road('nord', cx, 50, cx, cy - 50, 50))
        intersection.addRoad(new Road('sud', cx, 550, cx, cy + 50, 50))
        intersection.initTrafficLights()

        const greenCount = intersection.lights.filter(l => l.isGreen()).length
        expect(greenCount).toBe(1)
    })

    it('passe en phase de transition tous rouges entre deux phases vertes', () => {
        const cx = 400, cy = 300
        const intersection = new Intersection('i1', cx, cy, 2) // cycle court
        intersection.addRoad(new Road('nord', cx, 50, cx, cy - 50, 50))
        intersection.addRoad(new Road('sud', cx, 550, cx, cy + 50, 50))
        intersection.initTrafficLights()

        // Avance jusqu'à passer le 1er cycle (2s) → entre en transition
        intersection.update(2.1)

        expect(intersection.inTransition).toBe(true)
        const greenCount = intersection.lights.filter(l => l.isGreen()).length
        expect(greenCount).toBe(0)
    })

    it('après la transition, le feu suivant passe au vert', () => {
        const cx = 400, cy = 300
        const intersection = new Intersection('i1', cx, cy, 2)
        intersection.addRoad(new Road('nord', cx, 50, cx, cy - 50, 50))
        intersection.addRoad(new Road('sud', cx, 550, cx, cy + 50, 50))
        intersection.initTrafficLights()

        intersection.update(2.1) // entre en transition
        intersection.update(1.1) // sort de transition (transitionDuration = 1)

        expect(intersection.inTransition).toBe(false)
        expect(intersection.currentGreenIndex).toBe(1)
        expect(intersection.lights[1].isGreen()).toBe(true)
    })
})

describe('Intersection.getLightForRoad', () => {
    it('retourne le feu associé à une route donnée', () => {
        const cx = 400, cy = 300
        const intersection = new Intersection('i1', cx, cy, 5)
        const road = new Road('nord', cx, 50, cx, cy - 50, 50)
        intersection.addRoad(road)
        intersection.initTrafficLights()

        const light = intersection.getLightForRoad(road)

        expect(light).toBeDefined()
        expect(light.road).toBe(road)
    })
})