import petiteVille from '../../assets/petiteVille.png'
import carrefourMort from '../../assets/carrefourMort.png'

export default function ParametersForm({
    vehicleRange, setVehicleRange,
    speedRange, setSpeedRange,
    lightRange, setLightRange,
    spawnRange, setSpawnRange,
    checkedNetwork, setCheckedNetwork,
    disabled, onSubmit }) {

    return (
        <form className="params-form" onSubmit={onSubmit}>
            <fieldset>
                <legend>Parametres du trafic</legend>

                <div className="param-row">
                    <label htmlFor="vehicles">Nombre de vehicules</label>
                    <input id="vehicles" name="vehicles" value={vehicleRange} onChange={(e) => setVehicleRange(e.target.value)} type="range" min="5" max="200" step="5" disabled={disabled}/>
                    <span className="param-value">{vehicleRange}</span>
                </div>

                <div className="param-row">
                    <label htmlFor="speed">Vitesse maximale</label>
                    <input id="speed" name="speed" value={speedRange} onChange={(e) => setSpeedRange(e.target.value)} type="range" min="40" max="120" step="1" disabled={disabled} />
                    <span className="param-value">{speedRange}</span>
                </div>

                <div className="param-row">
                    <label htmlFor="lights">Cycle des feux</label>
                    <input id="lights" name="lights" value={lightRange} onChange={(e) => setLightRange(e.target.value)} type="range" min="8" max="30" step="1" disabled={disabled} />
                    <span className="param-value">{lightRange}</span>
                </div>

                <div className="param-row">
                    <label htmlFor="spawns">Taux d'apparition</label>
                    <input id="spawns" name="spawns" value={spawnRange} onChange={(e) => setSpawnRange(e.target.value)} type="range" min="1" max="5" step="0.5" disabled={disabled} />
                    <span className="param-value">{spawnRange}</span>
                </div>
            </fieldset>

            <fieldset>
                <legend>Reseau routier</legend>
                <div className="radio-group network-radio-group">
                    <div className="radio-option">
                        <input id="net-1" name="network" type="radio" value="option1" checked={checkedNetwork == "option1"} onChange={(e) => setCheckedNetwork(e.target.value)} disabled={disabled} />
                        <label htmlFor="net-1" className="radio-label network-label">
                            <img src={petiteVille} alt="Petite ville" className="network-preview" />
                            Petite ville
                        </label>
                    </div>
                    <div className="radio-option">
                        <input id="net-2" name="network" type="radio" value="option2" checked={checkedNetwork == "option2"} onChange={(e) => setCheckedNetwork(e.target.value)} disabled={disabled} />
                        <label htmlFor="net-2" className="radio-label network-label">
                            <img src={carrefourMort} alt="Carrefour de la mort" className="network-preview" />
                            Carrefour de la mort
                        </label>
                    </div>
                </div>
            </fieldset>

            {!disabled && (
                <button className="btn-primary" type="submit">Lancer la simulation</button>
            )}
        </form>
    )
}
