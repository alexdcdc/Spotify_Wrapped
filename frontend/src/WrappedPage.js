import { get } from './lib/requests'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LLMPanel from './components/LLMPanel'
import IntroPanel from './components/IntroPanel'
import PreLLMPanel from './components/PreLLMPanel'
import TopTracksPanel from './components/PanelOne'
import TopGenresPanel from './components/TopGenresPanel'
import PreGamePanel from './components/PreGamePanel'
import DancePanel from './components/DancePanel'
import GamePanel from './components/GamePanel'
import SlideIndicator from './components/SlideIndicator'
import "./WrappedPage.css"

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
  const [wrappedName, setWrappedName] = useState('')
  const [wrappedPanels, setWrappedPanels] = useState([])
  const [currentPanelNum, setCurrentPanelNum] = useState(0)
  const [totalPanels, setTotalPanels] = useState(0)
  const [loaded, setLoaded] = useState(false)
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
    setWrappedPanels(wrapped.panels)
    setTotalPanels(wrapped.panels.length)
    setLoaded(true)
  }

  useEffect(() => {
    getWrappedData()
  }, [])

  if (loaded) {
    if (totalPanels === 0) {
      return (<div>Empty wrapped.</div>)
    }
    const Component = componentMap[wrappedPanels[currentPanelNum].type]
    return (
      <div>
        <div>Wrapped name: {wrappedName} <br /> Wrapped panels: {wrappedPanels.join(',')}</div>
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
          : (<p>All done! <Link to='/dashboard'>Back to dashboard</Link></p>)}

        <SlideIndicator currentSlide={currentPanelNum} totalSlides={totalPanels} />
      </div>
    )
  } else {
    return (<p>Loading...</p>)
  }
}

export default WrappedPage
