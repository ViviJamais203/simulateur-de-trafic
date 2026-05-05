export default function StatisticsPanel({ statistics }) {
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
        </div>
    )
}
