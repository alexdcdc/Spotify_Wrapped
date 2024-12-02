import { deleteAcct } from "./lib/auth"
import {useEffect, useState} from 'react';
import {generateUrl, get} from './lib/requests'

function Profile() {

    const [imageUrl, setImageUrl] = useState("")
    const [creationDate, setCreationDate] = useState("")
    const [spotifyId, setSpotifyId] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")

    const fetchProfileImage = async () => {
        const url = generateUrl("api/profile-image")
        const response = await get(url, {}, true)

        if (!response.ok) {
            console.log("Failed to fetch user profile image")
        }

        const data = await response.json()
        if (data.found) {
            setImageUrl(data.images[0].url)
        }

    }

    const fetchUserInfo = async () => {
        const url = generateUrl("api/user")
        const response = await get(url,{},true);

        if (!response.ok) {
            console.log("Failed to fetch user data");
        }

        const data = await response.json()

        const full_date = new Date(data.account_created)

        setUsername(data.username)
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setSpotifyId(data.spotify_profile.spotify_id)
        setCreationDate(full_date.toDateString())
        setEmail(data.email)
    }

    useEffect(() => {
        fetchUserInfo()
        fetchProfileImage()
    }, [])


    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h1>Profile</h1>
                <div className="profile-row">
                    <div className="profile-image">{imageUrl ? <img src={imageUrl}/> : username}</div>
                    <div className="profile-details">
                        <p><strong>Name: </strong>{firstName} {lastName}</p>
                        <p><strong>Email: </strong>{email}</p>
                        <p><strong>Spotify ID: </strong>{spotifyId}</p>
                        <p><strong>Account created: </strong>{creationDate}</p>
                    </div>
                </div>
                <button className="delete-button" onClick={ () => {deleteAcct()} }>Delete account</button>
            </div>
        </div>


    );
}

export default Profile;
