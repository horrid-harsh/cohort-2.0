import DateTime from './DateTime'
import './navbar.scss'

const Navbar = () => {
  return (
    <nav>
        <div className='left'>
            <div className='apple-icon'>
                <img src="../nav-icons/apple.svg" alt="" />
            </div>
            <div className='nav-item'>
                <p>Harshwawrdhan</p>
            </div>
            <div className='nav-item'>
                <p>File</p>
            </div>
            <div className='nav-item'>
                <p>Window</p>
            </div>
            <div className='nav-item'>
                <p>Terminal</p>
            </div>
        </div>

        <div className='right'>
            <div className='nav-icon'>
                <img src="../nav-icons/wifi.svg" alt="" />
            </div>

            <div className='nav-item'>
                <DateTime />
            </div>
        </div>
    </nav>
  )
}

export default Navbar