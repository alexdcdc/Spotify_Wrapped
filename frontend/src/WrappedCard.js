import './WrappedCard.css'
import { useNavigate } from 'react-router-dom'
function WrappedCard (props) {
  const navigate = useNavigate()
  return (
    <div className='wrapped-card'>
      <h3>{props.name}</h3>
      <p>Created {props.dateCreated.toDateString()}</p>
      <button onClick={() => { navigate('/wrapped/' + props.id) }}>View Wrapped</button>
    </div>

  )
}

export default WrappedCard
