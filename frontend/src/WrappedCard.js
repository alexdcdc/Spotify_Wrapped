import './WrappedCard.css'
import {useNavigate} from 'react-router-dom'
import { del } from './lib/requests'

function WrappedCard({id, name, dateCreated, color, onDelete}) {
  const navigate = useNavigate()

  return (
    <div className='card'>
      <div className="image-placeholder" style={{ backgroundColor: "#" + color }}/>
      <h3>{name}</h3>
      <p>Created {dateCreated.toDateString()}</p>
      <div className="button-container">
        <button className="view-details-button" onClick={() => navigate('/wrapped/' + id)}>View Wrapped</button>
        {/* View details */}
        <button className="delete-button" onClick={() => {onDelete(id)}}>Delete</button>
        {/* Delete button */}
      </div>
      </div>

      )
      }

      export default WrappedCard
