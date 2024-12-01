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
import Profile from "./Profile";

function App () {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Login />} />
          <Route path='contact' element={<Contact />} />
          <Route path='callback' element={<Callback />} />
          <Route path='register' element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route path='profile' element={<Profile/>}/>
            <Route path='dashboard' element={<Dashboard />}/>
            <Route path='wrapped/:id' element={<WrappedPage />} />
            <Route path='create-wrapped' element={<NewWrappedForm />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
