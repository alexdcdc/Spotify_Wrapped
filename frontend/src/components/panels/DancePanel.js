import './DancePanel.css'
import DancingFigure from '../../images/dancingFigure.svg'

function DancePanel ({ data }) {
  const danceabilityScore = data.average_danceability

  return (
    <div className='wrapped-background danceability-wrapper'>
      <h1>Your Danceability Spectrum</h1>
      <div className='svg-container left-side'>
        <img src={DancingFigure} alt='Dance Visual Left' />
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
      <div className='svg-container right-side'>

        <img src='./musical_notes.svg' alt='Dance Visual Right' />
      </div>
    </div>
  )
}

export default DancePanel
