import {Outlet} from "react-router-dom"

function Layout() {
    return (
        <div>
            <h1>Rendered by Layout component!</h1>
            {<Outlet/>}
        </div>
    )
}

export default Layout