import './TopTracksPanel.css'

function TopTracksPanel ({ data }) {
  const spotifyData = data

  return (
    <div className='wrapped-background spotify-wrapper'>
      <h1>The music that defined your month.</h1>
      <div className='yearly-tracks'>
        {spotifyData.items.length > 0
          ? (
              spotifyData.items.slice(0, 5).map((_, index) => {
                const track1 = spotifyData.items[index * 2]
                const track2 = spotifyData.items[index * 2 + 1]
                return (
                  <YearlyTrackItem
                    track1={track1}
                    track2={track2}
                    year={2015 + index}
                    startIndex={index * 2}
                    key={`${track1?.id || track2?.id || index}-${index}`}
                  />
                )
              })
            )
          : (
            <p>No tracks available.</p>
            )}
      </div>

    </div>
  )
}

function YearlyTrackItem ({ track1, track2, startIndex }) {
  if (!track1 || !track2) return null

  const track1Name = track1.name
  const artist1Name = track1.artists[0].name
  const track1Url = track1.external_urls.spotify
  const artist1Url = track1.artists[0].external_urls.spotify
  const albumImage1 = track1.album.images[0]?.url

  const track2Name = track2.name
  const artist2Name = track2.artists[0].name
  const track2Url = track2.external_urls.spotify
  const artist2Url = track2.artists[0].external_urls.spotify
  const albumImage2 = track2.album.images[0]?.url

  return (
    <div className='yearly-track-item'>
      <div className='album-cover-container'>
        <img src={albumImage1} alt={`${track1Name} cover`} className='album-cover' />
        <img src={albumImage2} alt={`${track2Name} cover`} className='album-cover' />
      </div>
      <div className='track-details'>
        <p className='track-label'>{startIndex + 1}</p>
        <a href={track1Url} target='_blank' rel='noopener noreferrer' className='track-name'>
          {track1Name}
        </a>
        <a href={artist1Url} target='_blank' rel='noopener noreferrer' className='artist-name'>
          {artist1Name}
        </a>
      </div>
      <div className='track-details'>
        <p className='track-label'>{startIndex + 2}</p>
        <a href={track2Url} target='_blank' rel='noopener noreferrer' className='track-name'>
          {track2Name}
        </a>
        <a href={artist2Url} target='_blank' rel='noopener noreferrer' className='artist-name'>
          {artist2Name}
        </a>
      </div>
    </div>
  )
}

export default TopTracksPanel
