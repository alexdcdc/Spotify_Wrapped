import './App.css';
import {Routes, Route} from "react-router-dom";
import Login from "./Login"
import Layout from "./Layout"
import Dashboard from "./Dashboard";
import Callback from "./Callback"
import Register from "./Register"
import Profile from "./Profile";
import Contact from "./Contact";
import Logout from "./Logout";


function App() {

    return (
        <div>


            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Login/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="callback" element={<Callback/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="contact" element={<Contact/>}/>
                    <Route path="logout" element={<Logout/>}/>
                </Route>
            </Routes>
        </div>


    );
}

export default App;
