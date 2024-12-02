import {useState, useEffect} from 'react'
import {get} from './lib/requests'
import './Dashboard.css'
import './App.css'
import WrappedCard from './WrappedCard'
import NewWrappedForm from "./NewWrappedForm";

function Dashboard() {
  const [firstName, setFirstName] = useState('')
  const [wrappedList, setWrappedList] = useState([])
  const [wrappedFormEnabled, setWrappedFormEnabled] = useState(false)

  const getUserData = async () => {
    const url = 'http://localhost:8000/api/user'

    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get user data'))
    }

    const user = await response.json()
    setFirstName(user.first_name)
  }

  const getUserWrapped = async () => {
    const url = 'http://localhost:8000/api/wrapped'
    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get user wrapped'))
    }

    const data = await response.json()
    setWrappedList(data.wrapped_list)
  }

  const handleDeleteWrapped = (id) => {
    setWrappedList(wrappedList.filter(wrapped => wrapped.id !== id))
  }

  const displayWrappedForm = () => {
    setWrappedFormEnabled(true)
  }

  const hideWrappedForm = () => {
    setWrappedFormEnabled(false)
  }

  useEffect(() => {
    getUserData()
    getUserWrapped()
  }, [])

  return (

    <div className="dashboard">
      <NewWrappedForm enabled={wrappedFormEnabled} cancelFunction={hideWrappedForm}/>
      <h1 className="title pb-3">{firstName}'s Dashboard</h1>
      <div className="grid-container">


        <button className="card create-new" onClick={displayWrappedForm}>
          <div className="plus-icon">+</div>
          <p className="title">Create New</p>
        </button>
        {wrappedList.map(
          (wrappedData) => <WrappedCard name={wrappedData.name} dateCreated={new Date(wrappedData.date_created)}
                                        key={wrappedData.id} id={wrappedData.id} color={wrappedData.color}
                                        onDelete={handleDeleteWrapped}/>
        )}
      </div>
    </div>

  )
}

export default Dashboard
