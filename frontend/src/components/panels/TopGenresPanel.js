import './TopGenresPanel.css'

const TopGenresPanel = ({ data }) => {
  const genres = data.top_genres

  // Limit to the top 5 genres
  const topGenres = Array.isArray(genres) ? genres.slice(0, 5) : []

  return (
    <div className='panel-two'>
      <div className='box'>
        <h2 className='panel-heading'>My Top Genres</h2>
        <ul className='genre-list'>
          {topGenres.map((genre, index) => (
            <li key={index} className='genre-item'>
              {/* Bar with proportional width and color */}
              <div className={`genre-bar genre-${index + 1}`} />
              {/* Text block with rank and genre name */}
              <div className='genre-text'>
                <span className='genre-rank'>#{index + 1}</span>
                <span className='genre-name'>{genre[0]}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopGenresPanel
