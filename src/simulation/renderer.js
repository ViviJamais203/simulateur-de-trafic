/**
 * @module renderer
 * @description Module de rendu 2D du simulateur sur un canvas HTML.
 * Dessine les routes, les intersections, les feux de circulation,
 * les zones de congestion et les véhicules.
 */

const ROAD_WIDTH = 100
const VEHICLE_RADIUS = 6
const LIGHT_RADIUS = 8
const LIGHT_EDGE_MARGIN = 8

/**
 * Efface le canvas et redessine l'ensemble de la scène de simulation.
 * Ordre de dessin : routes → zones de congestion → intersections (avec feux) → véhicules.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas.
 * @param {{ roads: Road[], intersections: Intersection[] }} network - Le réseau routier à dessiner.
 * @param {Vehicle[]} [vehicles=[]] - Liste des véhicules actifs à dessiner.
 * @param {Map<string, Object>} [congestionZones=new Map()] - Zones de congestion indexées par clé `roadId-direction`.
 */
export function render(ctx, network, vehicles = [], congestionZones = new Map()) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    network.roads.forEach(road => drawRoad(ctx, road))
    congestionZones.forEach(zone => drawCongestionZone(ctx, zone))
    network.intersections.forEach(intersection => drawIntersection(ctx, intersection))
    vehicles.forEach(vehicle => drawVehicle(ctx, vehicle))
}

/**
 * Dessine un tronçon routier : fond gris foncé (largeur ROAD_WIDTH = 100px)
 * surmonté d'une ligne blanche centrale en pointillés (tirets 20px / espaces 20px).
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas.
 * @param {Road} road - Le tronçon à dessiner.
 */
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

/**
 * Dessine une intersection sous forme de carré ou d'hexagone selon `intersection.shape`,
 * puis dessine les feux de circulation associés à chaque route connectée.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas.
 * @param {Intersection} intersection - L'intersection à dessiner.
 */
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

/**
 * Dessine un hexagone régulier pour représenter une intersection hexagonale.
 * L'hexagone est orienté pointe en haut grâce à un décalage angulaire de `Math.PI / 6`.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas.
 * @param {Intersection} intersection - L'intersection dont `shapeRadius` définit le rayon.
 */
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

/**
 * Dessine le feu de circulation d'une route à l'extrémité `end` de celle-ci,
 * décalé latéralement vers l'extérieur de la chaussée (ROAD_WIDTH / 2 + LIGHT_EDGE_MARGIN).
 * Couleur : vert (#22c55e) si feu vert, rouge (#ef4444) sinon.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas.
 * @param {TrafficLight} light - Le feu à dessiner.
 * @param {Intersection} intersection - L'intersection contenant ce feu (sert à calculer l'orientation de la route).
 */
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

const LANE_OFFSET = 25

/**
 * Dessine la zone de congestion d'une voie sous forme d'un segment épais
 * orange semi-transparent (rgba(255, 120, 0, 0.4)).
 * La zone s'étend de `minProgress` à `maxProgress` le long de la voie,
 * en respectant le décalage latéral de voie (LANE_OFFSET = 25px).
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas.
 * @param {{ road: Road, direction: string, minProgress: number, maxProgress: number }} zone - La zone de congestion à dessiner.
 */
function drawCongestionZone(ctx, zone) {
    const { road, direction, minProgress, maxProgress } = zone
    const { start, end } = road
    const len = road.length

    const dxN = (end.x - start.x) / len
    const dyN = (end.y - start.y) / len
    const perpX = -dyN
    const perpY = dxN
    const sign = direction === 'AtoB' ? 1 : -1

    const t1 = minProgress / len
    const t2 = maxProgress / len

    const x1 = start.x + (end.x - start.x) * t1 + perpX * LANE_OFFSET * sign
    const y1 = start.y + (end.y - start.y) * t1 + perpY * LANE_OFFSET * sign
    const x2 = start.x + (end.x - start.x) * t2 + perpX * LANE_OFFSET * sign
    const y2 = start.y + (end.y - start.y) * t2 + perpY * LANE_OFFSET * sign

    ctx.save()
    ctx.strokeStyle = 'rgba(255, 120, 0, 0.4)'
    ctx.lineWidth = ROAD_WIDTH / 2 - 6
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.restore()
}

/**
 * Dessine un véhicule sous forme de disque cyan (#00ffff) de rayon VEHICLE_RADIUS (6px)
 * à sa position actuelle sur le canvas, calculée via `vehicle.getScreenPosition()`.
 * @param {CanvasRenderingContext2D} ctx - Contexte 2D du canvas.
 * @param {Vehicle} vehicle - Le véhicule à dessiner.
 */
function drawVehicle(ctx, vehicle) {
    const { x, y } = vehicle.getScreenPosition()

    ctx.fillStyle = '#00ffff'
    ctx.beginPath()
    ctx.arc(x, y, VEHICLE_RADIUS, 0, Math.PI * 2)
    ctx.fill()
}
