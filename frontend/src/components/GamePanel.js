import { useState } from 'react'
import PlaybackButton from './PlaybackButton'

function GamePanel ({ data }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correctMessage, setCorrectMessage] = useState('')

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
    } else {
      setCorrectMessage('Incorrect. The correct answer was "' + correctTrack.name + '."')
    }
    setSubmitted(true)
  }

  const updateAnswer = (e) => {
    setAnswer(e.target.value)
  }

  if (!submitted) {
    return (
      <div>
        <PlaybackButton url={correctTrack.preview_url} start={data.clip_start} duration={data.clip_duration} maxPlays={2} />
        <form onSubmit={checkAnswer}>
          <input list='track-choices' name='track-name' value={answer} onChange={updateAnswer} />
          <datalist id='track-choices'>
            {trackChoices}
          </datalist>
          <input type='submit' />
        </form>
      </div>
    )
  }

  return (<p>{correctMessage}</p>)
}

export default GamePanel
