import './WrappedCard.css'
import {useNavigate} from 'react-router-dom'

function WrappedCard({id, name, dateCreated, color}) {
  const navigate = useNavigate()
  return (
    <div className='card' onClick={() => {
      navigate('/wrapped/' + id)
    }}>
      <div className="image-placeholder" style={{backgroundColor: "#" + color}}/>
      <h3>{name}</h3>
      <p>Created {dateCreated.toDateString()}</p>
    </div>

  )
}

export default WrappedCard
