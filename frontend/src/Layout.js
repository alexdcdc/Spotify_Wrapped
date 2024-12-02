import {Outlet} from "react-router-dom"
import NavBar from "./NavBar"
import {useState} from "react";

function Layout() {
  return (
    <div>
      <NavBar/>

      {<Outlet/>}
    </div>

  )
}
export default Layout
