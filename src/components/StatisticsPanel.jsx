const CANVAS_W = 800
const CANVAS_H = 600
const DIRECTIONS = ['Est', 'Nord-Est', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud-Ouest', 'Sud', 'Sud-Est']

function getDirection(centerX, centerY) {
    const dx = centerX - CANVAS_W / 2
    const dy = -(centerY - CANVAS_H / 2)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    const index = Math.round(((angle % 360) + 360) / 45) % 8
    return DIRECTIONS[index]
}

function formatDuration(seconds) {
    const s = Math.floor(seconds)
    const m = Math.floor(s / 60)
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

export default function StatisticsPanel({ statistics }) {
    const zones = statistics?.congestionZones ?? []

    return (
        <div className="statistics-panel">
            <div className="stat-card">
                <span className="stat-label">Véhicules actifs</span>
                <span className="stat-value">{statistics?.activeVehicles ?? 0}</span>
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
