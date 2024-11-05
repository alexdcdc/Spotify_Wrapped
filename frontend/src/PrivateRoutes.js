import {Navigate, Outlet} from 'react-router-dom'
import {get} from 'react-router-dom'

function PrivateRoutes() {
  const token = localStorage.getItem('token');
  return (
    token ? <Outlet/> : <Navigate to='/'/>
  )
}
export default PrivateRoutes