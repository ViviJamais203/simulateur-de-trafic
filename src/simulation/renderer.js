const ROAD_WIDTH = 100

export function render(ctx, network) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    network.roads.forEach(road => drawRoad(ctx, road))
    
    network.intersections.forEach(int => drawIntersection(ctx, int))
}

function drawRoad(ctx, road) {
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = ROAD_WIDTH
    ctx.lineCap = 'square'
    ctx.beginPath()
    ctx.moveTo(road.intersectionA.x, road.intersectionA.y)
    ctx.lineTo(road.intersectionB.x, road.intersectionB.y)
    ctx.stroke()
    
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 5
    ctx.setLineDash([20, 20])
    ctx.beginPath()
    ctx.moveTo(road.intersectionA.x, road.intersectionA.y)
    ctx.lineTo(road.intersectionB.x, road.intersectionB.y)
    ctx.stroke()
    ctx.setLineDash([])
}

function drawIntersection(ctx, intersection) {
    if (intersection.roads.length >= 2) {
        ctx.fillStyle = '#1f2937'
        ctx.fillRect(
            intersection.x - ROAD_WIDTH / 2,
            intersection.y - ROAD_WIDTH / 2,
            ROAD_WIDTH,
            ROAD_WIDTH
        )
    }
}