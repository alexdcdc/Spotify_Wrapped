import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate();

    const postUserInfo = async (e) => {
        e.preventDefault()
        const url = "http://localhost:8000/api/user";

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Token ' + localStorage.getItem('token'),
            },
            body: new URLSearchParams({
                'first_name': firstName,
                'last_name': lastName,
                'username': username,
            }),
        };

        const response = await fetch(url, payload);
        if (response.ok) {
            navigate("/dashboard");
        }
        else {
            console.error("An error occurred while trying to submit user information");
            return Promise.reject()
        }
    }


    return (
        <form onSubmit={postUserInfo}>
            <label htmlFor="first_name">First Name:</label>
            <input onChange = {e => {setFirstName(e.target.value)}} type="text" id="fname" name="fname" required/>
            <br/><br/>

            <label htmlFor="last_name">Last Name:</label>
            <input onChange = {e => {setLastName(e.target.value)}} type="text" id="lname" name="lname" required/>
            <br/><br/>

            <label htmlFor="username">Username:</label>
            <input onChange = {e => {setUsername(e.target.value)}} type="text" id="username" name="username" required/>
            <br/><br/>

            <button type="submit">Submit</button>
        </form>
    )
}

export default Register;