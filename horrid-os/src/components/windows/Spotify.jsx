import './spotify.scss'
import MacWindow from './MacWindow'

const Spotify = ({ windowName, windowProps }) => {
  return (
    <MacWindow windowName={windowName} windowProps={windowProps} width='20vw'>
        <div className='spotify-window'>
            <iframe data-testid="embed-iframe" style={{borderRadius:"12px"}} src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4OzrY981I1W?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </MacWindow>
  )
}

export default Spotify