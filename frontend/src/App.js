import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Callback from './Callback'
import Register from './Register'
import PrivateRoutes from './PrivateRoutes'
import SpotifyOverview from './components/SpotifyOverview'
import PanelTwo from './components/panelTwo'
import NewWrappedForm from './NewWrappedForm'
import WrappedPage from './WrappedPage'

function App () {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Login />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='callback' element={<Callback />} />
          <Route path='register' element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route path='dashboard'>
              <Route path='' element={<Dashboard />} />
              <Route path='overview' element={<SpotifyOverview />} /> {/* New route for SpotifyOverview */}
              <Route path='panel-two' element={<PanelTwo />} />
            </Route>
            <Route path='wrapped/:id' element={<WrappedPage />} />
            <Route path='create-wrapped' element={<NewWrappedForm />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
