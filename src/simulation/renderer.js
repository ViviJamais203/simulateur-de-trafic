const ROAD_WIDTH = 100
const VEHICLE_RADIUS = 6
const LIGHT_RADIUS = 8
const LIGHT_EDGE_MARGIN = 8

export function render(ctx, network, vehicles = []) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    network.roads.forEach(road => drawRoad(ctx, road))
    network.intersections.forEach(intersection => drawIntersection(ctx, intersection))
    vehicles.forEach(vehicle => drawVehicle(ctx, vehicle))
}

function drawRoad(ctx, road) {
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = ROAD_WIDTH
    ctx.lineCap = 'square'
    ctx.beginPath()
    ctx.moveTo(road.start.x, road.start.y)
    ctx.lineTo(road.end.x, road.end.y)
    ctx.stroke()

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 5
    ctx.setLineDash([20, 20])
    ctx.beginPath()
    ctx.moveTo(road.start.x, road.start.y)
    ctx.lineTo(road.end.x, road.end.y)
    ctx.stroke()
    ctx.setLineDash([])
}

function drawIntersection(ctx, intersection) {
    if (intersection.shape === 'hexagon') {
        drawHexagon(ctx, intersection)
    } else {
        ctx.fillStyle = '#1f2937'
        ctx.fillRect(
            intersection.x - ROAD_WIDTH / 2,
            intersection.y - ROAD_WIDTH / 2,
            ROAD_WIDTH,
            ROAD_WIDTH
        )
    }

    intersection.lights.forEach(light => drawTrafficLight(ctx, light, intersection))
}

function drawHexagon(ctx, intersection) {
    const R = intersection.shapeRadius
    ctx.fillStyle = '#1f2937'
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 6) + (Math.PI / 3) * i
        const vx = intersection.x + R * Math.cos(angle)
        const vy = intersection.y + R * Math.sin(angle)
        if (i === 0) ctx.moveTo(vx, vy)
        else ctx.lineTo(vx, vy)
    }
    ctx.closePath()
    ctx.fill()
}

function drawTrafficLight(ctx, light, intersection) {
    const road = light.road

    const dx = intersection.x - road.start.x
    const dy = intersection.y - road.start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const ux = dx / length
    const uy = dy / length

    // Place the light at the road endpoint (hexagon edge or square edge)
    const stopX = road.end.x
    const stopY = road.end.y

    const perpX = -uy
    const perpY = ux
    const sideOffset = ROAD_WIDTH / 2 + LIGHT_EDGE_MARGIN

    const lightX = stopX + perpX * sideOffset
    const lightY = stopY + perpY * sideOffset

    ctx.beginPath()
    ctx.arc(lightX, lightY, LIGHT_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = light.isGreen() ? '#22c55e' : '#ef4444'
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1.5
    ctx.stroke()
}

function drawVehicle(ctx, vehicle) {
    const { x, y } = vehicle.getScreenPosition()

    ctx.fillStyle = '#00ffff'
    ctx.beginPath()
    ctx.arc(x, y, VEHICLE_RADIUS, 0, Math.PI * 2)
    ctx.fill()
}
