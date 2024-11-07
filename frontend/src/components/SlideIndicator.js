import React from 'react';
import './SlideIndicator.css';

function SlideIndicator({ currentSlide, totalSlides }) {
    return (
        <div className="slide-indicator">
            {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                ></div>
            ))}
        </div>
    );
}

export default SlideIndicator;
