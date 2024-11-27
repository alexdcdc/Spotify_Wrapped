import './DancePanel.css'
import DancingFigure from '../../images/dancing-person.png'
import SittingFigure from '../../images/sitting-person.png'

function DancePanel ({ data }) {
  const danceabilityScore = data.average_danceability

  return (
    <div className='wrapped-background danceability-wrapper'>
      <h1>Your Danceability Spectrum</h1>
      <div className='danceability-meter-container'>
        <div className='icon-wrapper'>
          <img src={SittingFigure} alt='Dance Visual Left' />
        </div>

        <div className='score-container'>
          <div className='spectrum'>
            <div
              className='score-indicator'
              style={{
                left: `calc(${danceabilityScore}% - 10px)` // Adjust position
              }}
            />
          </div>
          <p>Your danceability score: {danceabilityScore}</p>
        </div>
        <div className='icon-wrapper'>
          <img src={DancingFigure} alt='Dance Visual Right' />
        </div>
      </div>
    </div>
  )
}

export default DancePanel
