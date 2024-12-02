import { useState } from 'react'
import { post } from './lib/requests'
import './NewWrappedForm.css'
import { useNavigate } from 'react-router-dom'

function NewWrappedForm ({enabled, cancelFunction}) {
  const [wrappedName, setWrappedName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const createNewWrapped = async () => {
    const body = { name: wrappedName }
    const url = 'http://localhost:8000/api/wrapped'
    const response = await post(url, body, true)
    if (!response.ok) {
      return Promise.reject(new Error('Unable to create new Wrapped'))
    }

    const data = await response.json()
    return data.wrapped.id
  }

  const createWrappedAndRedirect = (e) => {
    e.preventDefault()
    setIsLoading(true)
    alert('Your submission is being processed, please wait...')
    createNewWrapped().then(
      (id) => {
        setIsLoading(false)
        navigate('/wrapped/' + id)
      },
      (x) => {
        setIsLoading(false)
        console.log(x)
      }
    )
  }

  if (!enabled) {
    return
  }

  return (
    <div className='pop-up-form-container'>
      <div className='pop-up-form'>
        <form onSubmit={createWrappedAndRedirect}>
          <label className='pop-up-form-label' htmlFor='name'>Input New Wrapped Name</label>
          <input className='pop-up-form-input' onChange={e => {
            setWrappedName(e.target.value)
          }} type='text' id='name' name='name' required/>
          <br/><br/>

          <div className="button-align">
          <button type='submit' disabled={isLoading}>Submit</button>
          <button type='cancel' onClick={cancelFunction}>Cancel</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default NewWrappedForm
