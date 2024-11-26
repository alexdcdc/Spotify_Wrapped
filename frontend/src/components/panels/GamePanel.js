import { useState } from 'react'
import PlaybackButton from '../PlaybackButton'
import './GamePanel.css'

function GamePanel ({ data }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correctMessage, setCorrectMessage] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  const correctTrack = data.correct
  const trackChoices = data.choices.map((track) => <option key={track.id}>{track.name}</option>)

  console.log(data)
  if (!correctTrack || !data.choices) {
    return (<p>Invalid data passed into game panel</p>)
  }

  const checkAnswer = (e) => {
    e.preventDefault()
    if (answer === correctTrack.name) {
      setCorrectMessage("That's correct!")
      setIsCorrect(true)
    } else {
      setCorrectMessage('Incorrect. The correct answer was "' + correctTrack.name + '."')
    }
    setSubmitted(true)
  }

  const updateAnswer = (e) => {
    setAnswer(e.target.value)
  }

  const content = (!submitted
    ? (
      <div>
        <form onSubmit={checkAnswer}>
          <div className='input-container'>
            <input
              className='answer-input' list='track-choices' name='track-name' value={answer}
              onChange={updateAnswer}
            />
            <datalist id='track-choices'>
              {trackChoices}
            </datalist>
            <input className='submit-button' type='submit' />
          </div>
        </form>
        <PlaybackButton
          url={correctTrack.preview_url} start={data.clip_start} duration={data.clip_duration}
          maxPlays={2}
        />
      </div>
      )
    : (<p class={'result-text' + (isCorrect ? ' correct' : ' incorrect')}>{correctMessage}</p>)
  )

  return (
    <div>
      <div className='game-wrapper'>
        <h1>Can you guess the song name?</h1>
        {content}
      </div>
    </div>

  )
}

export default GamePanel
