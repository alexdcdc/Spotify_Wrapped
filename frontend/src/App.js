import './App.css';
import {Routes, Route} from "react-router-dom";
import Login from "./Login"
import Layout from "./Layout"
import Dashboard from "./Dashboard";
import Callback from "./Callback"
import Register from "./Register"
import SpotifyOverview from "./components/SpotifyOverview";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Login/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="dashboard/overview" element={<SpotifyOverview />} /> {/* New route for SpotifyOverview */}
                    <Route path="callback" element={<Callback/>}/>
                    <Route path="register" element={<Register/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
