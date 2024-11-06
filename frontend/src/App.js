import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Layout from './Layout'
import Dashboard from './Dashboard'
import Callback from './Callback'
import Register from './Register'
import PrivateRoutes from './PrivateRoutes'

//main app
function App () {
  console.log("hihiii!")
  return (
    <div>
      <p>hello world!</p>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Login />} />
          <Route path='callback' element={<Callback />} />
          <Route path='register' element={<Register />} />
          <Route element={<PrivateRoutes/>}>
            <Route path='dashboard' element={<Dashboard/>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
