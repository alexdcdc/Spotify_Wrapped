import './WrappedCard.css'
import {useNavigate} from 'react-router-dom'
import { del } from './lib/requests'

function WrappedCard({id, name, dateCreated, color, onDelete}) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    const url = `http://localhost:8000/api/wrapped/${id}`

    const response = await del(url, {}, true)

    if (response.ok) {
      onDelete(id)  // Call the delete handler from parent component
    } else {
      console.error('Failed to delete card')
    }
  }

  return (
    <div className='card'>
      <div className="image-placeholder" style={{ backgroundColor: "#" + color }}/>
      <h3>{name}</h3>
      <p>Created {dateCreated.toDateString()}</p>
      <div className="button-container">
        <button className="view-details-button" onClick={() => navigate('/wrapped/' + id)}>View Wrapped</button>
        {/* View details */}
        <button className="delete-button" onClick={handleDelete}>Delete</button>
        {/* Delete button */}
      </div>
      </div>

      )
      }

      export default WrappedCard
