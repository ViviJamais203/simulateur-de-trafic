export default function SimulationControls({
    activeSpeed, setActiveSpeed,
    isPaused, onTogglePause, onReset }) {

    const speeds = [0.5, 1, 2, 4]

    return (
        <nav className="speed-controls">
            <button
                className={`speed-btn${isPaused ? ' active' : ''}`}
                onClick={onTogglePause}
            >
                {isPaused ? "Reprendre" : "Pause"}
            </button>
            {speeds.map(speed => (
                <button
                    key={speed}
                    className={`speed-btn${!isPaused && activeSpeed === speed ? ' active' : ''}`}
                    onClick={() => setActiveSpeed(speed)}
                >
                    x{speed}
                </button>
            ))}
            <button className="speed-btn reset-btn" onClick={onReset}>
                Reset
            </button>
        </nav>
    )
}
