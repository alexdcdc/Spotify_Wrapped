import './DancePanel.css'
import { useTheme } from "../../ThemeContext";
import DancingFigure from '../../images/dancing-person.png'
import SittingFigure from '../../images/sitting-person.png'
import DancingFigureDark from '../../images/dancing-person-dark.png'
import SittingFigureDark from '../../images/sitting-person-dark.png'

function DancePanel ({ data }) {
  const danceabilityScore = data.average_danceability
  const { theme } = useTheme()

  const sitting = (theme === "dark") ? SittingFigure : SittingFigureDark
  const dancing = (theme === "dark") ? DancingFigure : DancingFigureDark

  return (
    <div className='wrapped-background danceability-wrapper'>
      <h1>Your Danceability Spectrum</h1>
      <div className='danceability-meter-container'>
        <div className='icon-wrapper'>
          <img src={sitting} alt='Dance Visual Left' />
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
          <img src={dancing} alt='Dance Visual Right' />
        </div>
      </div>
    </div>
  )
}

export default DancePanel
