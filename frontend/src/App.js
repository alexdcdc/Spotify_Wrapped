import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Callback from './Callback'
import Contact from './Contact'
import Register from './Register'
import PrivateRoutes from './PrivateRoutes'
import PanelOne from './components/PanelOne'
import DanceabilityPanel from './components/danceabilityPanel'
import LLMPanel from './components/LLMPanel'
import TopGenresPanel from './components/TopGenresPanel'
import NewWrappedForm from './NewWrappedForm'
import WrappedPage from './WrappedPage'
import SpotifyWrappedPersonality from './components/LLMPanel'

function App () {
  sessionStorage.setItem('isDark', !sessionStorage.getItem('isDark'))
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='contact' element={<Contact />} />
          <Route index element={<Login />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='callback' element={<Callback />} />
          <Route path='register' element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route path='dashboard/panel-one' element={<PanelOne />} /> {/* New route for SpotifyOverview */}
            <Route path='dashboard/llm-panel' element={<LLMPanel />} />
            <Route path='dashboard/danceability-panel' element={<DanceabilityPanel />} />
            <Route path='dashboard'>
              <Route path='' element={<Dashboard />} />
              <Route path='panel-two' element={<TopGenresPanel />} />
            </Route>
            <Route path='wrapped/:id' element={<WrappedPage />} />
            <Route path='create-wrapped' element={<NewWrappedForm />} />
            <Route path='wrapped-llm' element={<SpotifyWrappedPersonality />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
