const ROAD_WIDTH = 100
const VEHICLE_RADIUS = 6

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
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(
        intersection.x - ROAD_WIDTH / 2,
        intersection.y - ROAD_WIDTH / 2,
        ROAD_WIDTH,
        ROAD_WIDTH
    )
}

function drawVehicle(ctx, vehicle) {
    const { x, y } = vehicle.getScreenPosition()
    
    ctx.fillStyle = '#e63946'
    ctx.beginPath()
    ctx.arc(x, y, VEHICLE_RADIUS, 0, Math.PI * 2)
    ctx.fill()
}