function GamePanel ({data}) {
  if (!data.correct || !data.choices) {
    return (<p>Invalid data passed into game panel</p>)
  }

  const correctTrack = data.correct
  const trackChoices = data.choices

  const checkAnswer = (e) => {
    console.log()
  }




  return (
    <form onSubmit = {checkAnswer}>
      <datalist>
        {trackChoices.map((track) => <option>{track.name}</option>)}
      </datalist>
      <input type="submit">Submit</input>
    </form>
  )
}

export default GamePanel
