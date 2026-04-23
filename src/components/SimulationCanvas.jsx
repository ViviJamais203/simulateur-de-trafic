import { useRef, useEffect } from "react";
import { buildPetiteVille } from '../networks/petiteVille.js'
import { render } from '../simulation/renderer.js'

export function SimulationCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const network = buildPetiteVille(50)
        render(ctx, network)
    }, [])

    return <canvas ref={canvasRef} width={800} height={600} />
}