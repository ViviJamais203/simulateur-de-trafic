export default function ParametersForm({
    vehicleRange, setVehicleRange,
    speedRange, setSpeedRange,
    lightRange, setLightRange,
    spawnRange, setSpawnRange,
    checkedNetwork, setCheckedNetwork,
    disabled, onSubmit }) {

    return (
        <form onSubmit={onSubmit}>
            <fieldset>
                <legend>Paramètres du trafic</legend>
                <section>
                    <label htmlFor="vehicles">Nombre de véhicules</label>
                    <input id="VehicleInput" name="vehicles" value={vehicleRange} onChange={(e) => setVehicleRange(e.target.value)} type="range" min="5" max="200" step="5" disabled={disabled}/>
                    <p id="VehicleNumber">{vehicleRange}</p>
                </section>

                <section>
                    <label htmlFor="speed">Vitesse maximale</label>
                    <input id="SpeedInput" name="speed" value={speedRange} onChange={(e) => setSpeedRange(e.target.value)} type="range" min="40" max="120" step="1" disabled={disabled} />
                    <p id="MaxSpeed">{speedRange}</p>
                </section>

                <section>
                    <label htmlFor="lights">Cycle des feux</label>
                    <input id="LightInput" name="lights" value={lightRange} onChange={(e) => setLightRange(e.target.value)} type="range" min="8" max="30" step="1" disabled={disabled} />
                    <p id="LightCycle">{lightRange}</p>
                </section>

                <section>
                    <label htmlFor="spawns">Taux d'apparition des véhicules</label>
                    <input id="SpawnInput" name="spawns" value={spawnRange} onChange={(e) => setSpawnRange(e.target.value)} type="range" min="1" max="5" step="0.5" disabled={disabled} />
                    <p id="SpawnRate">{spawnRange}</p>
                </section>
            </fieldset>

            <fieldset>
                <legend>Réseau routier</legend>
                <section>
                    <input name="network" type="radio" value="option1" checked={checkedNetwork == "option1"} onChange={(e) => setCheckedNetwork(e.target.value)} disabled={disabled} />
                </section>
                <section>
                    <input name="network" type="radio" value="option2" checked={checkedNetwork == "option2"} onChange={(e) => setCheckedNetwork(e.target.value)} disabled={disabled} />
                </section>
            </fieldset>

            <button type="submit">Lancer la simulation</button>
        </form>
    )
}