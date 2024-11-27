import {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function Dashboard() {
    const [firstName, setFirstName] = useState("");

    const getUserData = async () => {
        const url = "http://localhost:8000/api/user";
        const payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Token ' + localStorage.getItem('token'),
            }
        }
        const response = await fetch(url, payload);
        if (!response.ok) {
            return Promise.reject("Unable to get user data");
        }

        const user = await response.json();
        setFirstName(user.first_name);
    }

    useEffect(() => {getUserData()}, [])

    return (

        <div className="dashboard">
            <h1 className="title pb-3">{firstName}'s Dashboard</h1>
            <div className="grid-container">

                <button className="card create-new" onClick="location.href='create-new.html'">
                    <div className="plus-icon">+</div>
                    <p className="title">Create New</p>
                </button>


                <button className="card" onClick="location.href='my-fav-wrap.html'">
                    <div className="image-placeholder"></div>
                    <p>My Fav Wrap</p>
                </button>


                <button className="card" onClick="location.href='wrap-2.html'">
                    <div className="image-placeholder"></div>
                    <p>Wrap 2</p>
                </button>
            </div>
      </div>

    )
}

export default Dashboard;