/**
 * @module StatisticsPanel
 * @description Composant React affichant les statistiques en temps réel de la simulation.
 */

const CANVAS_W = 800
const CANVAS_H = 600
const DIRECTIONS = ['Est', 'Nord-Est', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud-Ouest', 'Sud', 'Sud-Est']

/**
 * Convertit des coordonnées canvas en direction cardinale textuelle (8 directions).
 * Calcule l'angle depuis le centre du canvas (400, 300) vers le point donné,
 * en inversant l'axe Y pour correspondre aux conventions géographiques (Nord = haut).
 * @param {number} centerX - Coordonnée X du point sur le canvas.
 * @param {number} centerY - Coordonnée Y du point sur le canvas.
 * @returns {string} Direction cardinale parmi : 'Est', 'Nord-Est', 'Nord', 'Nord-Ouest',
 *   'Ouest', 'Sud-Ouest', 'Sud', 'Sud-Est'.
 */
function getDirection(centerX, centerY) {
    const dx = centerX - CANVAS_W / 2
    const dy = -(centerY - CANVAS_H / 2)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    const index = Math.round(((angle % 360) + 360) / 45) % 8
    return DIRECTIONS[index]
}

/**
 * Formate une durée en secondes en chaîne lisible par l'utilisateur.
 * Affiche les minutes uniquement si la durée dépasse 60 secondes.
 * @param {number} seconds - Durée en secondes.
 * @returns {string} Chaîne formatée, ex. : `"1m 23s"` ou `"45s"`.
 */
function formatDuration(seconds) {
    const s = Math.floor(seconds)
    const m = Math.floor(s / 60)
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

/**
 * Composant React affichant les statistiques temps réel de la simulation :
 * nombre de véhicules actifs, vitesse moyenne et liste des congestions actives
 * avec leur direction cardinale et leur durée.
 * @param {Object} props
 * @param {{ activeVehicles: number, averageSpeed: number, congestionZones: Array<{ roadId: string, direction: string, duration: number, centerX: number, centerY: number }> }} [props.statistics] - Statistiques de la simulation.
 * @returns {JSX.Element} Panneau de statistiques.
 */
export default function StatisticsPanel({ statistics }) {
    const zones = statistics?.congestionZones ?? []

    return (
        <div className="statistics-panel">
            <div className="stat-card">
                <span className="stat-label">Véhicules actifs</span>
                <span className="stat-value">
                    {statistics?.activeVehicles ?? 0}
                    <span className="stat-unit"> véh.</span>
                </span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Vitesse moyenne</span>
                <span className="stat-value">
                    {statistics?.averageSpeed ?? 0}
                    <span className="stat-unit"> km/h</span>
                </span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Congestions actives</span>
                {zones.length === 0 ? (
                    <span className="stat-no-congestion">Aucune</span>
                ) : (
                    <ul className="congestion-list">
                        {zones.map((zone) => (
                            <li key={`${zone.roadId}-${zone.direction}`} className="congestion-row">
                                <span className="congestion-dot" />
                                <span>{getDirection(zone.centerX, zone.centerY)}</span>
                                <span className="congestion-duration">{formatDuration(zone.duration)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
