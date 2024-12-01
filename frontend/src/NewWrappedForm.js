import { useState } from 'react'
import { post } from './lib/requests'
import './NewWrappedForm.css'
import { useNavigate } from 'react-router-dom'

function NewWrappedForm ({enabled}) {
  const [wrappedName, setWrappedName] = useState('')
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
    createNewWrapped().then(
      (id) => {
        navigate('/wrapped/' + id)
      },
      (x) => {
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
          <label className='pop-up-form-label' htmlFor='name'>Name</label>
          <input className='pop-up-form-input' onChange={e => { setWrappedName(e.target.value) }} type='text' id='name' name='name' required />
          <br /><br />

          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default NewWrappedForm
