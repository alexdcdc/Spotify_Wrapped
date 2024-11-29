import { get } from './lib/requests'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LLMPanel from './components/panels/LLMPanel'
import IntroPanel from './components/panels/IntroPanel'
import PreLLMPanel from './components/panels/PreLLMPanel'
import TopTracksPanel from './components/panels/TopTracksPanel'
import TopGenresPanel from './components/panels/TopGenresPanel'
import PreGamePanel from './components/panels/PreGamePanel'
import DancePanel from './components/panels/DancePanel'
import GamePanel from './components/panels/GamePanel'
import SlideIndicator from './components/SlideIndicator'
import TopTracksPlayer from './components/TopTracksPlayer'
import './WrappedPage.css'

const componentMap = {
  IN: IntroPanel,
  TT: TopTracksPanel,
  PL: PreLLMPanel,
  LM: LLMPanel,
  TG: TopGenresPanel,
  PG: PreGamePanel,
  GM: GamePanel,
  DC: DancePanel
}

function WrappedPage () {
  const [wrappedPanels, setWrappedPanels] = useState([])
  const [currentPanelNum, setCurrentPanelNum] = useState(0)
  const [totalPanels, setTotalPanels] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const updateFont = () => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    document.body.style.fontFamily = "'Montserrat', sans-serif"
  }

  const getWrappedData = async () => {
    const url = 'http://localhost:8000/api/wrapped/' + id
    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get wrapped information'))
    }

    const data = await response.json()
    const wrapped = data.wrapped
    setWrappedPanels(wrapped.panels)
    setTotalPanels(wrapped.panels.length)
    setLoaded(true)
  }

  useEffect(() => {
    updateFont()
    getWrappedData()
  }, [])

  if (loaded) {
    if (totalPanels === 0) {
      return (<div>Empty wrapped.</div>)
    }
    const Component = componentMap[wrappedPanels[currentPanelNum].type]
    return (
      <div>
        <Component data={currentPanelNum < totalPanels ? wrappedPanels[currentPanelNum].data : {}} />
        {/* Circular button to navigate to TopGenresPanel.js */}
        {currentPanelNum + 1 < totalPanels
          ? (
            <button
              className='navigate-button' onClick={() => {
                setCurrentPanelNum((currentPanelNum + 1))
              }}
            >
              &gt;
            </button>
            )
          : (<button className='navigate-button to-dashboard-button' onClick={() => { navigate('/dashboard') }}>Back to dashboard &#8594;</button>)}

        <SlideIndicator currentSlide={currentPanelNum} totalSlides={totalPanels} setter={setCurrentPanelNum} />
        <TopTracksPlayer topTracks={wrappedPanels.filter(panel => panel.type === 'TT')[0].data} />
      </div>
    )
  } else {
    return (<p>Loading...</p>)
  }
}

export default WrappedPage
