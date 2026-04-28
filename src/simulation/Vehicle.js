export class Vehicle {
    constructor(id, road, direction, speed) {
        this.id = id
        this.road = road
        this.direction = direction
        this.progress = 0
        this.speed = speed
        this.state = 'on_road'
        this.crossing = null

        if (direction == 'AtoB') {
            road.vehiclesAtoB.push(this)
        } else {
            road.vehiclesBtoA.push(this)
        }
    }

    update(deltaTime) {
        if (this.state == 'on_road') {
            this.progress += this.speed * deltaTime
        } else if (this.state == 'crossing') {
            this.crossing.progress += this.speed * deltaTime

            if (this.crossing.progress >= this.crossing.arcLength) {
                this.road = this.crossing.nextRoad
                this.direction = this.crossing.nextDirection
                this.progress = 0
                this.state = 'on_road'
                this.road.vehiclesBtoA.push(this)
                this.crossing = null
            }
        }
    }

    hasReachedEnd() {
        return this.state == 'on_road' && this.progress >= this.road.length
    }


    getScreenPosition() {
        if (this.state == 'crossing') {
            const c = this.crossing
            const t = c.progress / c.arcLength
            const currentAngle = c.startAngle + c.delta * t

            if (c.isStraight) {
                return {
                    x: c.startX + (c.endX - c.startX) * t,
                    y: c.startY + (c.endY - c.startY) * t
                }
            } else {
                return {
                    x: c.cx + c.radius * Math.cos(currentAngle),
                    y: c.cy + c.radius * Math.sin(currentAngle)
                }
            }
        }

        const { start, end } = this.road
        const length = this.road.length

        let t
        if (this.direction === 'AtoB') {
            t = this.progress / length
        } else {
            t = 1 - (this.progress / length)
        }

        const centerX = start.x + (end.x - start.x) * t
        const centerY = start.y + (end.y - start.y) * t

        const dx = (end.x - start.x) / length
        const dy = (end.y - start.y) / length

        const perpX = -dy
        const perpY = dx

        const LANE_OFFSET = 25
        const sign = this.direction == 'AtoB' ? 1 : -1

        const x = centerX + perpX * LANE_OFFSET * sign
        const y = centerY + perpY * LANE_OFFSET * sign

        return { x, y }
    }

    handleEndOfRoad(intersection) {
        if (this.direction == 'AtoB') {
            const idx = this.road.vehiclesAtoB.indexOf(this)
            this.road.vehiclesAtoB.splice(idx, 1)

            const otherRoads = intersection.roads.filter(r => r !== this.road)
            const nextRoad = otherRoads[Math.floor(Math.random() * otherRoads.length)]

            const exit = this.getScreenPosition()
            const exitDir = getMarchDirection(this.road, 'AtoB')

            const entry = computeLaneEntryPoint(nextRoad, 'BtoA')
            const entryDir = getMarchDirection(nextRoad, 'BtoA')

            const cross = exitDir.x * entryDir.y - exitDir.y * entryDir.x
            const isStraight = Math.abs(cross) < 0.01

            if (isStraight) {
                const dx = entry.x - exit.x
                const dy = entry.y - exit.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                this.state = 'crossing'
                this.crossing = {
                    isStraight: true,
                    startX: exit.x,
                    startY: exit.y,
                    endX: entry.x,
                    endY: entry.y,
                    progress: 0,
                    arcLength: distance,
                    nextRoad,
                    nextDirection: 'BtoA'
                }
                return true
            }

            const center = computeArcCenter(exit, exitDir, entry, entryDir)

            const radius = Math.sqrt(
                (exit.x - center.x) ** 2 + (exit.y - center.y) ** 2
            )

            const startAngle = Math.atan2(exit.y - center.y, exit.x - center.x)
            const endAngle = Math.atan2(entry.y - center.y, entry.x - center.x)

            let delta = endAngle - startAngle
            while (delta > Math.PI) delta -= 2 * Math.PI
            while (delta < -Math.PI) delta += 2 * Math.PI

            const arcLength = radius * Math.abs(delta)

            this.state = 'crossing'
            this.crossing = {
                isStraight: false,
                cx: center.x,
                cy: center.y,
                radius,
                startAngle,
                delta,
                progress: 0,
                arcLength,
                nextRoad,
                nextDirection: 'BtoA'
            }

            return true
        } else {
            const idx = this.road.vehiclesBtoA.indexOf(this)
            this.road.vehiclesBtoA.splice(idx, 1)
            return false
        }
    }

}

function getMarchDirection(road, direction) {
    const { start, end } = road
    const length = road.length

    if (direction == 'AtoB') {
        return {
            x: (end.x - start.x) / length,
            y: (end.y - start.y) / length
        }
    } else {
        return {
            x: (start.x - end.x) / length,
            y: (start.y - end.y) / length
        }
    }
}

function computeLaneEntryPoint(road, direction) {
    const { start, end } = road
    const length = road.length

    const t = direction == 'AtoB' ? 0 : 1

    const centerX = start.x + (end.x - start.x) * t
    const centerY = start.y + (end.y - start.y) * t

    const dx = (end.x - start.x) / length
    const dy = (end.y - start.y) / length

    const prepX = -dy
    const prepY = dx

    const LANE_OFFSET = 25
    const sign = direction == 'AtoB' ? 1 : -1

    return {
        x: centerX + prepX * LANE_OFFSET * sign,
        y: centerY + prepY * LANE_OFFSET * sign
    }
}

function computeArcCenter(p1, dir1, p2, dir2) {
    if (Math.abs(dir1.x) < 0.01) {
        return { x: p2.x, y: p1.y }
    } else {
        return { x: p1.x, y: p2.y }
    }
}