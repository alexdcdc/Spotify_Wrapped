import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Callback from './Callback'
import Register from './Register'
import PrivateRoutes from './PrivateRoutes'
import PanelOne from './components/PanelOne';
import PanelTwo from './components/panelTwo';

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
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='dashboard/panel-one' element={<PanelOne />} /> {/* New route for SpotifyOverview */}
            <Route path='dashboard/panel-two' element={<PanelTwo />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
