const ROAD_WIDTH = 100

export function render(ctx, network) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    network.roads.forEach(road => drawRoad(ctx, road))
    
    network.intersections.forEach(intersection => drawIntersection(ctx, intersection))
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