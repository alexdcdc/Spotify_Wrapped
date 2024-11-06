import {Navigate, Outlet} from 'react-router-dom'

function PrivateRoutes() {
  const token = sessionStorage.getItem('token')
  const isRegistered = (sessionStorage.getItem('isRegistered') === 'true')
  return (
    token ? (isRegistered ? <Outlet/> : <Navigate to='/register'/>) : <Navigate to='/'/>
  )
}
export default PrivateRoutes