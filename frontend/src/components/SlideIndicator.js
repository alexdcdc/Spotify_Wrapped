import React from 'react'
import './SlideIndicator.css'

function SlideIndicator ({ currentSlide, totalSlides, setter }) {
  return (
    <div className='slide-indicator'>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className={`dot ${index === currentSlide ? 'active' : ''}`}
          onClick={() => { setter(index) }}
        />
      ))}
    </div>
  )
}

export default SlideIndicator
