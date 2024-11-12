import { get } from './lib/requests'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

function WrappedPage () {
  const [wrappedName, setWrappedName] = useState('')
  const { id } = useParams()

  const getWrappedData = async () => {
    const url = 'http://localhost:8000/api/wrapped/' + id
    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get wrapped information'))
    }

    const data = await response.json()
    const wrapped = data.wrapped
    setWrappedName(wrapped.name)
  }

  useState(() => {
    getWrappedData()
  }, [])

  return (
    <div>Wrapped name: {wrappedName}</div>
  )
}

export default WrappedPage
