import {Navigate, Outlet} from 'react-router-dom'

function PrivateRoutes() {
  const token = localStorage.getItem('token')
  const isRegistered = (localStorage.getItem('isRegistered') === 'true')
  return (
    token ? (isRegistered ? <Outlet/> : <Navigate to='/register'/>) : <Navigate to='/'/>
  )
}
export default PrivateRoutes