import { Routes, Route } from 'react-router-dom'
import Home from './pages/HomePage'
import Parametres from './pages/ParametersPage'
import Simulation from './pages/SimulationPage'
import NotFound from './pages/NotFoundPage'
import './style.css'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/parametres" element={<Parametres />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
