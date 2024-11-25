import './LLMPanel.css'

function LLMPanel ({ data }) {
  const llmData = data

  return (
    <div className='llm-wrapper'>
      <h1>Your Personality Snapshot</h1>
      <div className='insight-content'>
        {llmData.personality_description && (
          <div className='insight-card'>
            <h2>Personality & Thinking Style</h2>
            <p>{llmData.personality_description}</p>
          </div>
        )}

        {llmData.fashion_choices && (
          <div className='insight-card'>
            <h2>Fashion Choices</h2>
            <p>{llmData.fashion_choices}</p>
          </div>
        )}

        {llmData.behavior_description && (
          <div className='insight-card'>
            <h2>Behavior</h2>
            <p>{llmData.behavior_description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LLMPanel
