import { describe, it, expect } from 'vitest'
import { TrafficLight } from '../TrafficLight.js'
import { Road } from '../Road.js'

describe('TrafficLight — comportement de base', () => {
    it('est rouge par défaut à la création', () => {
        const road = new Road('r1', 0, 0, 100, 0, 50)
        const light = new TrafficLight(road)

        expect(light.isGreen()).toBe(false)
        expect(light.state).toBe('red')
    })

    it('passe au vert avec setGreen()', () => {
        const road = new Road('r1', 0, 0, 100, 0, 50)
        const light = new TrafficLight(road)

        light.setGreen()

        expect(light.isGreen()).toBe(true)
    })

    it('repasse au rouge avec setRed()', () => {
        const road = new Road('r1', 0, 0, 100, 0, 50)
        const light = new TrafficLight(road)

        light.setGreen()
        light.setRed()

        expect(light.isGreen()).toBe(false)
    })

    it('est lié à une route précise', () => {
        const road = new Road('r1', 0, 0, 100, 0, 50)
        const light = new TrafficLight(road)

        expect(light.road).toBe(road)
    })
})